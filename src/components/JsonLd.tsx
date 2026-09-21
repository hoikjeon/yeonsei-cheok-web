// JSON-LD를 <script>로 직렬화합니다.
// '<' 를 이스케이프해 문자열 안의 </script> 가 태그를 조기에 닫지 못하게 막습니다.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
