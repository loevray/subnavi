import { EventsApi } from '@/lib/api-client';

export default async function Page() {
  const data = await EventsApi.getAll();
  console.log(data);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
