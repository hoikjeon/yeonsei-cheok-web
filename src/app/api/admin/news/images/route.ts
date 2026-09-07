import { randomUUID } from 'node:crypto';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { isAdminNewsType, storedNewsTypes, validNewsId } from '@/lib/adminNews';
import { newsAdminClient } from '@/lib/adminNewsRepository';
import { ALLOWED_IMAGE_TYPES, newsImageMaxSize } from '@/lib/imageUploadRules';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  try {
    const origin = request.headers.get('origin');
    if (!origin || new URL(origin).host !== request.headers.get('host')) return Response.json({ error: '올바르지 않은 업로드 요청입니다.' }, { status: 403 });
    const { id, type, mime, size } = await request.json();
    const maxImageSize = newsImageMaxSize(type);
    const maxImageSizeMb = Math.round(maxImageSize / (1024 * 1024));
    if (!validNewsId(id) || !isAdminNewsType(type) || typeof mime !== 'string' || !Object.hasOwn(ALLOWED_IMAGE_TYPES, mime) || !Number.isInteger(size) || size <= 0 || size > maxImageSize) {
      return Response.json({ error: `JPG, PNG, WEBP, GIF 이미지를 파일당 ${maxImageSizeMb}MB 이하로 선택해주세요.` }, { status: 400 });
    }
    const client = newsAdminClient();
    const { data: post, error: lookupError } = await client.from('hospital_news').select('type').eq('id', id).maybeSingle();
    if (lookupError) throw lookupError;
    if (post && !storedNewsTypes(type).includes(post.type)) return Response.json({ error: '게시판 정보가 일치하지 않습니다.' }, { status: 400 });
    const path = `news/${type}/${id}/${randomUUID()}.${ALLOWED_IMAGE_TYPES[mime]}`;
    const { data, error } = await client.storage.from('reviews').createSignedUploadUrl(path, { upsert: false });
    if (error) throw error;
    const { data: publicData } = client.storage.from('reviews').getPublicUrl(path);
    return Response.json({ uploadUrl: data.signedUrl, publicUrl: publicData.publicUrl }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('News upload URL failed:', error);
    return Response.json({ error: '이미지 업로드를 준비하지 못했습니다. 다시 시도해주세요.' }, { status: 500 });
  }
}
