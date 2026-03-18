import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { categoryService } from '@/services/Category';
import EventFilter from './EventFilter';

export default async function EventFilterContainer() {
  const response = await categoryService.getCateogires();

  if (!response.success) {
    return (
      <div className="px-4 pb-3 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>필터를 불러오지 못했습니다.</AlertTitle>
          <AlertDescription>{response.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <EventFilter categories={response.data} />;
}
