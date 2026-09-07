import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { parseNewsDocument, type NewsNode } from '@/lib/newsContent';
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
      <figure key={key} data-align={node.attrs?.align} style={{ width: `${node.attrs?.width || 100}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={String(node.attrs?.src)} alt={String(node.attrs?.alt || '')} loading="lazy" />
        {node.attrs?.caption ? <figcaption>{node.attrs.caption}</figcaption> : null}
      </figure>
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
