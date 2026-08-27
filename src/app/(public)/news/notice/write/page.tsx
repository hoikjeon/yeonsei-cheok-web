import { redirect } from 'next/navigation';

export default function LegacyNoticeWritePage() {
  redirect('/admin/news/notice/write');
}
