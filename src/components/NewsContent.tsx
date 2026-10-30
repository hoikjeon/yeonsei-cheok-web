import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { parseNewsDocument, type NewsNode } from '@/lib/newsContent';
import NaturalWidthImage from '@/components/NaturalWidthImage';
import './news-content.css';

function renderNode(node: NewsNode, key: number): ReactNode {
  const children = node.content?.map(renderNode);
  const style: CSSProperties = { textAlign: node.attrs?.textAlign as CSSProperties['textAlign'] };
  switch (node.type) {
    case 'text': {
      let text: ReactNode = node.text;
      for (const mark of node.marks || []) {
        if (mark.type === 'bold') text = <strong>{text}</strong>;
        if (mark.type === 'italic') text = <em>{text}</em>;
        if (mark.type === 'underline') text = <u>{text}</u>;
        if (mark.type === 'strike') text = <s>{text}</s>;
        if (mark.type === 'textStyle') text = <span style={mark.attrs as CSSProperties}>{text}</span>;
        if (mark.type === 'link') text = <a href={mark.attrs?.href} target="_blank" rel="noopener noreferrer">{text}</a>;
      }
      return <Fragment key={key}>{text}</Fragment>;
    }
    case 'paragraph': return <p key={key} style={style}>{children?.length ? children : <br />}</p>;
    case 'heading': {
      const Tag = node.attrs?.level === 3 ? 'h3' : node.attrs?.level === 4 ? 'h4' : 'h2';
      return <Tag key={key} style={style}>{children}</Tag>;
    }
    case 'hardBreak': return <br key={key} />;
    case 'horizontalRule': return <hr key={key} />;
    case 'bulletList': return <ul key={key}>{children}</ul>;
    case 'orderedList': return <ol key={key} start={Number(node.attrs?.start) || 1}>{children}</ol>;
    case 'listItem': return <li key={key}>{children}</li>;
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
    case 'image': return (
      // 편집기에서 정한 폭(%)과 원본 폭 중 작은 쪽으로 보여 줍니다. 작은 원본을 늘려 흐려지지 않게 합니다.
      <NaturalWidthImage key={key} as="figure" frameProps={{ 'data-align': node.attrs?.align ? String(node.attrs.align) : undefined }} baseWidth={`${node.attrs?.width || 100}%`}
        src={String(node.attrs?.src)} alt={String(node.attrs?.alt || '')} width={960} height={720} sizes="(min-width: 1024px) 960px, 100vw">
        {/* 실제 비율은 CSS(height: auto)가 맞추고, width·height 는 내려받을 크기를 고르는 기준으로만 씁니다. */}
        {node.attrs?.caption ? <figcaption>{node.attrs.caption}</figcaption> : null}
      </NaturalWidthImage>
    );
    default: return <Fragment key={key}>{children}</Fragment>;
  }
}

export default function NewsContent({ content, className = '' }: { content: string; className?: string }) {
  const document = parseNewsDocument(content);
  return <div className={`news-content ${className}`}>
    {document ? document.content?.map(renderNode) : <p className="whitespace-pre-wrap">{content}</p>}
  </div>;
}
