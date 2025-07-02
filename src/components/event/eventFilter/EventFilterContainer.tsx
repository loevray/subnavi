import { categoryService } from '@/services/Category';
import EventFilter from './EventFilter';
import { sleep } from '@/utils/sleep';

export default async function EventFilterContainer() {
  const categories = await categoryService.getCateogires();
  await sleep();
  return <EventFilter categories={categories} />;
}
