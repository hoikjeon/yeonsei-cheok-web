'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Minus, Link as LinkIcon, Unlink, Undo2, Redo2, Eraser, ImagePlus, Trash2 } from 'lucide-react';
import { NEWS_FONT_SIZES, newsColor, safeNewsLink, type NewsNode } from '@/lib/newsContent';
import '@/components/news-content.css';

const NewsImage = Image.extend({
  addAttributes() {
    return {
      src: { default: null }, alt: { default: '' },
      width: { default: 100 }, align: { default: 'center' }, caption: { default: '' },
    };
  },
  parseHTML() {
    return [{
      tag: 'figure[data-news-image]',
      getAttrs: (element) => ({ src: element.querySelector('img')?.getAttribute('src'), alt: element.querySelector('img')?.getAttribute('alt') || '', width: Number(element.getAttribute('data-width')) || 100, align: element.getAttribute('data-align') || 'center', caption: element.querySelector('figcaption')?.textContent || '' }),
    }, { tag: 'img[src]:not([src^="data:"])' }];
  },
  renderHTML({ node }) {
    const { src, alt, width, align, caption } = node.attrs;
    return ['figure', { 'data-news-image': '', 'data-width': width, 'data-align': align, style: `width: ${width}%` }, ['img', { src, alt }], ...(caption ? [['figcaption', {}, caption]] : [])];
  },
});

function Tool({ label, active = false, disabled = false, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className={`flex h-9 min-w-9 items-center justify-center rounded-md px-2 transition disabled:opacity-30 ${active ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-200'}`}>{children}</button>;
}

export default function NewsRichEditor({ initialDocument, onChange, uploadImage, disabled, allowedImages, onReady }: {
  initialDocument: NewsNode; onChange: (doc: NewsNode) => void;
  uploadImage: (file: File, progress: (value: number) => void) => Promise<string>;
  disabled: boolean; allowedImages: string[]; onReady?: (editor: Editor) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const insertRef = useRef<(files: File[], position?: number) => void>(() => {});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [failed, setFailed] = useState<File[]>([]);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, code: false, codeBlock: false, link: { openOnClick: false, autolink: false, defaultProtocol: 'https', isAllowedUri: (url) => Boolean(safeNewsLink(url)) } }),
      TextStyleKit.configure({ fontFamily: false, lineHeight: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] }),
      NewsImage,
      Placeholder.configure({ placeholder: '내용을 작성하세요. 복사한 이미지는 Ctrl+V / ⌘+V로 넣을 수 있습니다.' }),
    ],
    content: initialDocument,
    editorProps: {
      attributes: { class: 'news-content', role: 'textbox', 'aria-label': '게시물 본문', 'aria-multiline': 'true' },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.items || []).filter((item) => item.kind === 'file').map((item) => item.getAsFile()).filter((file): file is File => Boolean(file));
        if (!files.length) return false;
        event.preventDefault();
        insertRef.current(files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files || []);
        if (moved || !files.length) return false;
        event.preventDefault();
        insertRef.current(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
        return true;
      },
      transformPastedHTML: (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('script,style,iframe,object,embed,svg').forEach((node) => node.remove());
        doc.querySelectorAll('img').forEach((img) => {
          if (!allowedImages.includes(img.getAttribute('src') || '')) {
            img.remove();
            setError('외부 문서의 이미지는 이미지 자체를 복사해 붙여넣거나 파일로 첨부해주세요.');
          }
        });
        doc.querySelectorAll('*').forEach((element) => {
          const node = element as HTMLElement;
          const color = newsColor(node.style.color);
          const background = newsColor(node.style.backgroundColor);
          const size = NEWS_FONT_SIZES.includes(node.style.fontSize) ? node.style.fontSize : '';
          const align = ['left', 'center', 'right'].includes(node.style.textAlign) ? node.style.textAlign : '';
          const weight = /^(bold|[6-9]00)$/.test(node.style.fontWeight) ? 'bold' : '';
          const italic = node.style.fontStyle === 'italic';
          const decoration = node.style.textDecoration.includes('underline') ? 'underline' : node.style.textDecoration.includes('line-through') ? 'line-through' : '';
          node.removeAttribute('style');
          if (color) node.style.color = color;
          if (background) node.style.backgroundColor = background;
          if (size) node.style.fontSize = size;
          if (align) node.style.textAlign = align;
          if (weight) node.style.fontWeight = weight;
          if (italic) node.style.fontStyle = 'italic';
          if (decoration) node.style.textDecoration = decoration;
          for (const attr of Array.from(node.attributes)) if (attr.name.startsWith('on') || ['class', 'id'].includes(attr.name)) node.removeAttribute(attr.name);
        });
        return doc.body.innerHTML;
      },
    },
    onUpdate: ({ editor: updated }) => onChange(updated.getJSON() as NewsNode),
    onCreate: ({ editor: created }) => onReady?.(created),
  });
  useEffect(() => { editor?.setEditable(!disabled && !uploading); }, [editor, disabled, uploading]);

  const insertImages = useCallback(async (files: File[], position?: number) => {
    if (!editor || disabled || uploading) return;
    if (position !== undefined) editor.commands.setTextSelection(position);
    const start = editor.state.selection.from;
    setUploading(true);
    setError('');
    setFailed([]);
    editor.setEditable(false);
    let nextPosition = start;
    const failures: File[] = [];
    for (const file of files) {
      setProgress(0);
      try {
        const src = await uploadImage(file, setProgress);
        if (editor.isDestroyed) break;
        editor.chain().insertContentAt(nextPosition, { type: 'image', attrs: { src, alt: '', width: 100, align: 'center', caption: '' } }).run();
        nextPosition = editor.state.selection.to;
      } catch (err) { failures.push(file); setError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.'); }
    }
    setFailed(failures);
    setUploading(false);
    if (!editor.isDestroyed) editor.setEditable(!disabled);
  }, [editor, disabled, uploading, uploadImage]);
  useEffect(() => { insertRef.current = (files, position) => { void insertImages(files, position); }; }, [insertImages]);
  if (!editor) return <div className="flex min-h-96 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500">편집기를 준비하고 있습니다…</div>;
  const locked = disabled || uploading;
  const imageSelected = editor.isActive('image');
  const imageAttrs = editor.getAttributes('image');
  const textAttrs = editor.getAttributes('textStyle');
  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
    <fieldset disabled={locked} className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 disabled:opacity-60">
      <select aria-label="문단 형식" value={editor.isActive('heading') ? String(editor.getAttributes('heading').level) : 'p'} onChange={(event) => event.target.value === 'p' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().setHeading({ level: Number(event.target.value) as 2 | 3 | 4 }).run()} className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"><option value="p">본문</option><option value="2">큰 소제목</option><option value="3">소제목</option><option value="4">작은 소제목</option></select>
      <select aria-label="글자 크기" value={textAttrs.fontSize || ''} onChange={(event) => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()} className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"><option value="">기본 크기</option>{NEWS_FONT_SIZES.map((size) => <option key={size} value={size}>{size.replace('px', '')}</option>)}</select>
      <Tool label="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></Tool>
      <Tool label="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></Tool>
      <Tool label="밑줄" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={17} /></Tool>
      <Tool label="취소선" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={17} /></Tool>
      <label className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-2 text-xs font-bold text-slate-600" title="글자 색상">글자색<input type="color" aria-label="글자 색상" value={newsColor(textAttrs.color) || '#334155'} onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} className="h-6 w-6 cursor-pointer border-0 bg-transparent" /></label>
      <label className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-2 text-xs font-bold text-slate-600" title="형광펜 색상">형광펜<input type="color" aria-label="형광펜 색상" value={newsColor(textAttrs.backgroundColor) || '#fef08a'} onChange={(event) => editor.chain().focus().setBackgroundColor(event.target.value).run()} className="h-6 w-6 cursor-pointer border-0 bg-transparent" /></label>
      <Tool label="왼쪽 정렬" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={17} /></Tool>
      <Tool label="가운데 정렬" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={17} /></Tool>
      <Tool label="오른쪽 정렬" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={17} /></Tool>
      <Tool label="글머리표" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={17} /></Tool>
      <Tool label="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></Tool>
      <Tool label="인용문" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={17} /></Tool>
      <Tool label="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={17} /></Tool>
      <Tool label="링크 삽입 또는 수정" active={editor.isActive('link')} onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setLinkOpen(!linkOpen); }}><LinkIcon size={17} /></Tool>
      <Tool label="링크 해제" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}><Unlink size={17} /></Tool>
      <Tool label="서식 지우기" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().unsetTextAlign().run()}><Eraser size={17} /></Tool>
      <Tool label="실행 취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={17} /></Tool>
      <Tool label="다시 실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={17} /></Tool>
      <Tool label="본문 이미지 추가" onClick={() => input.current?.click()}><ImagePlus size={17} /><span className="ml-1 text-xs font-bold">이미지</span></Tool>
    </fieldset>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" aria-label="본문 이미지 파일" onChange={(event) => { void insertImages(Array.from(event.target.files || [])); event.target.value = ''; }} />
    {linkOpen && <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-blue-50 p-3"><input aria-label="연결할 주소" type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://..." className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" /><button type="button" className="rounded-md bg-navy-950 px-4 py-2 text-sm font-bold text-white" onClick={() => { const href = safeNewsLink(linkUrl.trim()); if (!href) { setError('올바른 링크 주소를 입력해주세요.'); return; } editor.chain().focus().extendMarkRange('link').setLink({ href }).run(); setLinkOpen(false); setError(''); }}>적용</button><button type="button" onClick={() => setLinkOpen(false)} className="px-2 text-sm">취소</button></div>}
    {imageSelected && <fieldset disabled={locked} className="flex flex-wrap items-center gap-2 border-b border-blue-200 bg-blue-50 p-3 text-sm">
      <span className="font-bold text-blue-900">선택한 이미지</span>
      <select aria-label="이미지 너비" value={imageAttrs.width || 100} onChange={(event) => editor.chain().focus().updateAttributes('image', { width: Number(event.target.value) }).run()} className="rounded-md border border-blue-200 bg-white p-2">{[25, 50, 75, 100].map((width) => <option key={width} value={width}>너비 {width}%</option>)}</select>
      <select aria-label="이미지 정렬" value={imageAttrs.align || 'center'} onChange={(event) => editor.chain().focus().updateAttributes('image', { align: event.target.value }).run()} className="rounded-md border border-blue-200 bg-white p-2"><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select>
      <input aria-label="이미지 설명" value={imageAttrs.caption || ''} maxLength={500} onChange={(event) => editor.commands.updateAttributes('image', { caption: event.target.value })} placeholder="이미지 아래 설명" className="min-w-0 basis-full rounded-md border border-blue-200 px-3 py-2 sm:flex-1 sm:basis-auto" />
      <input aria-label="이미지 대체 텍스트" value={imageAttrs.alt || ''} maxLength={300} onChange={(event) => editor.commands.updateAttributes('image', { alt: event.target.value })} placeholder="이미지 설명 (대체 텍스트)" className="min-w-0 basis-full rounded-md border border-blue-200 px-3 py-2 sm:flex-1 sm:basis-auto" />
      <Tool label="선택한 본문 이미지 삭제" onClick={() => editor.chain().focus().deleteSelection().run()}><Trash2 size={17} /></Tool>
      <p className="w-full text-xs text-blue-700">이미지를 끌어서 본문 안의 위치를 바꿀 수 있습니다.</p>
    </fieldset>}
    {uploading && <div role="status" className="border-b border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">이미지 업로드 중… {progress}%<progress value={progress} max={100} className="mt-2 block h-1 w-full" /></div>}
    {error && <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"><span className="flex-1">{error}</span>{failed.length > 0 && <button type="button" disabled={locked} onClick={() => void insertImages(failed)} className="font-bold underline">실패한 이미지 재시도</button>}<button type="button" onClick={() => { setError(''); setFailed([]); }} className="underline">닫기</button></div>}
    <EditorContent editor={editor} />
  </div>;
}
