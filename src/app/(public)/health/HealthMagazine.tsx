'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronRight, ChevronDown, BookOpen, X } from 'lucide-react';
import styles from './health.module.css';

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  keywords: string[];
  thumbnail: string;
  thumbnailPosition: string;
};
const categories = [
  { id: 'all', label: '전체 건강정보' },
  { id: 'spine', label: '척추 건강' },
  { id: 'joint', label: '관절 건강' },
];

export default function HealthMagazine({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('ko-KR').replace(/\s+/g, '');
    return articles.filter(article =>
      (category === 'all' || article.category === category) &&
      (!term || [article.title, article.description, ...article.keywords].join(' ').toLocaleLowerCase('ko-KR').replace(/\s+/g, '').includes(term))
    ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [articles, category, query]);
  const reset = () => { setQuery(''); setCategory('all'); setVisibleCount(5); };

  return <div className={styles.shell}>
    <div className={styles.content}>
      <div className={styles.toolbar}>
        <div className={styles.categories} aria-label="글 분류">{categories.map(item => <button key={item.id} aria-pressed={category === item.id} className={category === item.id ? styles.selected : ''} onClick={() => { setCategory(item.id); setVisibleCount(5); }}>{item.label}</button>)}</div>
        <div className={styles.searchBox}><input type="search" aria-label="건강정보 검색" placeholder="검색어를 입력해주세요." value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(5); }} />{query && <button aria-label="검색어 지우기" onClick={() => setQuery('')}><X size={17} /></button>}<Search size={22} aria-hidden="true" /></div>
      </div>
      <section aria-labelledby="articles-heading">
        <div className={styles.listHeading}><h2 id="articles-heading">{query.trim() ? '검색 결과' : category === 'all' ? '최신 콘텐츠' : categories.find(item => item.id === category)?.label}</h2><span aria-live="polite">총 <strong>{filtered.length}</strong>건</span></div>
        <ul className={styles.articleList}>
          {filtered.slice(0, visibleCount).map((article, index) => {
            return <li key={article.slug}><Link className={styles.article} href={`/health/${article.slug}`}><div className={styles.articleText}><span className={styles.articleCategory}>{article.category === 'spine' ? '척추 건강' : '관절 건강'}</span><h3>{article.title}</h3><p>{article.description}</p><time dateTime={article.publishedAt}>{article.publishedAt.replaceAll('-', '.')}</time></div><div className={styles.thumbnail}><Image src={article.thumbnail} alt="" fill sizes="(max-width: 600px) 96px, 168px" style={{ objectPosition: article.thumbnailPosition }} priority={index === 0} /></div></Link></li>;
          })}
        </ul>
        {filtered.length === 0 && <div className={styles.empty}><Search size={32} strokeWidth={1.4} /><h3>{query.trim() ? '검색 결과가 없습니다' : '새로운 건강정보를 준비하고 있습니다'}</h3><p>{query.trim() ? '다른 증상이나 질환명으로 검색해 보세요.' : '먼저 등록된 척추 건강 이야기를 살펴보세요.'}</p><button onClick={reset}>전체 건강정보 보기 <ChevronRight size={16} /></button></div>}
        {filtered.length > visibleCount && <button className={styles.more} onClick={() => setVisibleCount(count => count + 5)}>콘텐츠 더 보기 <ChevronDown size={17} /></button>}
      </section>
      <div className={styles.bottomNote}><BookOpen size={18} /><p>내 몸을 이해하는 작은 시작, 연세척 건강 매거진.</p></div>
    </div>
  </div>;
}
