import { categoryService } from '@/services/Category';
import EventFilter from './EventFilter';

export default async function EventFilterContainer() {
  const categories = await categoryService.getCateogires();
  return <EventFilter categories={categories} />;
}
