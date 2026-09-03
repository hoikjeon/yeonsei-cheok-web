'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';

export async function toggleGeneralConsultation(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const currentStatus = formData.get('currentStatus') === 'true';

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    redirect('/admin/consultations/general?error=invalid-id');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    redirect('/admin/consultations/general?error=database-config');
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase
    .from('consultations')
    .update({ is_checked: !currentStatus })
    .eq('id', id);

  if (error) {
    console.error('Failed to update general consultation:', error.message);
    redirect('/admin/consultations/general?error=update-failed');
  }

  revalidatePath('/admin');
  revalidatePath('/admin/consultations');
  revalidatePath('/admin/consultations/general');
}

