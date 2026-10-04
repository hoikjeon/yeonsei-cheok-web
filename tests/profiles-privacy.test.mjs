import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const migration = await readFile(new URL('../setup_profiles_read_privacy.sql', import.meta.url), 'utf8');
const alice = '00000000-0000-0000-0000-000000000001';
const bob = '00000000-0000-0000-0000-000000000002';
const carol = '00000000-0000-0000-0000-000000000003';

async function fixture({ rls = true } = {}) {
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon;
    CREATE ROLE authenticated;
    CREATE ROLE service_role BYPASSRLS;
    CREATE ROLE auth_test_admin;
    CREATE SCHEMA auth;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role, auth_test_admin;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
      SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, email text NOT NULL, full_name text NOT NULL);
    GRANT INSERT, SELECT ON auth.users TO auth_test_admin;
    CREATE TABLE public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id),
      email text NOT NULL, full_name text NOT NULL
    );
    ${rls ? 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;' : ''}
    GRANT SELECT ON public.profiles TO PUBLIC;
    GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
    GRANT ALL ON public.profiles TO service_role;
    CREATE POLICY legacy_public_read ON public.profiles FOR SELECT USING (true);
    CREATE POLICY legacy_own_insert ON public.profiles FOR INSERT TO authenticated
      WITH CHECK ((SELECT auth.uid()) = id);
    CREATE POLICY legacy_own_update ON public.profiles FOR UPDATE TO authenticated
      USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
    CREATE FUNCTION public.handle_new_user() RETURNS trigger
      LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, full_name) VALUES (NEW.id, NEW.email, NEW.full_name);
        RETURN NEW;
      END;
    $$;
    CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    INSERT INTO auth.users VALUES
      ('${alice}', 'alice@example.invalid', 'Alice'),
      ('${bob}', 'bob@example.invalid', 'Bob');
    CREATE TABLE public.unrelated (id integer PRIMARY KEY);
    INSERT INTO public.unrelated VALUES (1);
    GRANT SELECT ON public.unrelated TO anon;
  `);
  return db;
}

async function asRole(db, role, uid = '') {
  await db.exec('RESET ROLE');
  await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [uid]);
  await db.exec(`SET ROLE ${role}`);
}

test('blocks public profile reads, preserves own reads, service access and signup trigger; repeatable', async () => {
  const db = await fixture();
  try {
    await asRole(db, 'anon');
    assert.equal((await db.query('SELECT * FROM public.profiles')).rows.length, 2);
    await db.exec('RESET ROLE');
    const before = (await db.query('SELECT * FROM public.profiles ORDER BY id')).rows;
    const policiesBefore = (await db.query("SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename='profiles' ORDER BY policyname")).rows;
    const triggerBefore = (await db.query("SELECT pg_get_functiondef('public.handle_new_user()'::regprocedure) AS definition")).rows;
    await db.exec(migration);
    await db.exec(migration);
    assert.deepEqual((await db.query('SELECT * FROM public.profiles ORDER BY id')).rows, before);
    assert.deepEqual((await db.query("SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename='profiles' AND policyname LIKE 'legacy_%' ORDER BY policyname")).rows, policiesBefore);
    assert.deepEqual((await db.query("SELECT pg_get_functiondef('public.handle_new_user()'::regprocedure) AS definition")).rows, triggerBefore);

    await asRole(db, 'anon');
    await assert.rejects(db.query('SELECT email, full_name FROM public.profiles'), /permission denied/);
    assert.equal((await db.query('SELECT * FROM public.unrelated')).rows.length, 1);

    await asRole(db, 'authenticated', alice);
    assert.deepEqual((await db.query('SELECT id FROM public.profiles')).rows, [{ id: alice }]);
    assert.deepEqual((await db.query('SELECT email FROM public.profiles WHERE id=$1', [bob])).rows, []);
    assert.equal((await db.query('UPDATE public.profiles SET full_name=$1 WHERE id=$2 RETURNING id', ['Alice updated', alice])).rows.length, 1);
    assert.equal((await db.query('UPDATE public.profiles SET full_name=$1 WHERE id=$2 RETURNING id', ['Unauthorized', bob])).rows.length, 0);
    await asRole(db, 'authenticated', bob);
    assert.deepEqual((await db.query('SELECT id FROM public.profiles')).rows, [{ id: bob }]);

    // Simulates the database signup trigger, not a real Supabase Auth signup.
    await asRole(db, 'auth_test_admin');
    await db.query('INSERT INTO auth.users VALUES ($1,$2,$3)', [carol, 'carol@example.invalid', 'Carol']);
    await asRole(db, 'authenticated', carol);
    assert.deepEqual((await db.query('SELECT id FROM public.profiles')).rows, [{ id: carol }]);
    await asRole(db, 'service_role');
    assert.equal((await db.query('SELECT * FROM public.profiles')).rows.length, 3);
  } finally { await db.close(); }
});

test('later read grants and broad FOR ALL policies cannot reopen profile reads', async () => {
  const db = await fixture();
  try {
    await db.exec(`
      CREATE POLICY legacy_all ON public.profiles FOR ALL USING (true) WITH CHECK (true);
    `);
    await db.exec(migration);
    await db.exec('GRANT SELECT (email, full_name) ON public.profiles TO anon');
    await asRole(db, 'anon');
    assert.deepEqual((await db.query('SELECT email, full_name FROM public.profiles')).rows, []);
    await db.exec('RESET ROLE; GRANT SELECT ON public.profiles TO anon;');
    await asRole(db, 'anon');
    assert.deepEqual((await db.query('SELECT * FROM public.profiles')).rows, []);
    await asRole(db, 'authenticated', alice);
    assert.deepEqual((await db.query('SELECT id FROM public.profiles')).rows, [{ id: alice }]);
  } finally { await db.close(); }
});

test('unexpected disabled RLS aborts before changing existing permissions', async () => {
  const db = await fixture({ rls: false });
  try {
    await assert.rejects(db.exec(migration), /profiles RLS is disabled/);
    await db.exec('ROLLBACK');
    await asRole(db, 'anon');
    assert.equal((await db.query('SELECT * FROM public.profiles')).rows.length, 2);
  } finally { await db.close(); }
});
