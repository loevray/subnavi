export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  console.log(keyword);
  return <div>{/* <EventList /> */}</div>;
}
