// 첨부 이미지 검증 규칙.
// 병원소식(관리자)과 치료체험후기(회원)에서 개수·형식 기준을 공유하고 용량은 서비스별로 둡니다.

export const MAX_IMAGE_COUNT = 10;
// 치료체험후기는 기존 10MB 제한을 유지하고, 병원소식은 별도 20MB 제한을 사용합니다.
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_NEWS_IMAGE_SIZE = 20 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** FormData 에서 실제 파일만 골라냅니다. */
export function collectUploadFiles(formData: FormData, field = 'files') {
  return formData
    .getAll(field)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

/**
 * 개수·형식·크기를 검사합니다.
 * 통과하면 null, 문제가 있으면 사용자에게 보여줄 메시지를 돌려줍니다.
 */
export function validateUploadFiles(files: File[], maxSize = MAX_IMAGE_SIZE): string | null {
  if (files.length > MAX_IMAGE_COUNT) {
    return `이미지는 최대 ${MAX_IMAGE_COUNT}개까지 첨부할 수 있습니다.`;
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES[file.type]) {
      return 'JPG, PNG, WEBP, GIF 이미지만 첨부할 수 있습니다.';
    }
    if (file.size > maxSize) {
      return `이미지 한 개의 크기는 ${Math.round(maxSize / (1024 * 1024))}MB를 넘을 수 없습니다.`;
    }
  }

  return null;
}
