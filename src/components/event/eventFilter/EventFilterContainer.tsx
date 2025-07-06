import { categoryService } from '@/services/Category';
import EventFilter from './EventFilter';

export default async function EventFilterContainer() {
  const response = await categoryService.getCateogires();
  if (!response.success) return <div>이벤트 카테고리 fetching 실패</div>;
  const { data: categories } = response;
  return <EventFilter categories={categories} />;
}
