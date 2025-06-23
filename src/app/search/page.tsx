export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search_query: string }>;
}) {
  const { search_query } = await searchParams;
  console.log(search_query);
  return <div>검색 페이지 입니다</div>;
}
