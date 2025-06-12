import { serverEventsApi } from '@/lib/api-client-server';

export default async function Page() {
  const data = await serverEventsApi.getAll();
  console.log(data);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
