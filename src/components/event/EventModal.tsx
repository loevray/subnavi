'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { EventsApi } from '@/lib/api-client';
import { Plus } from 'lucide-react';
import EventForm from './eventForm/EventForm';

/* 
  일종의 컨테이너 역할 수행
  도메인+모달
*/

const EventModal = () => {
  const [open, setOpen] = useState(false);
  const { Categories, Regions } = EventsApi;
  const regionPromise = useMemo(() => Regions.getAll(), [Regions]);
  const categoriesPromise = useMemo(() => Categories.getAll(), [Categories]);
  return (
    <div className="p-8 bg-background min-h-screen">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />새 행사 추가
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <EventForm
            onEventFormSubmit={() => {}}
            setOpen={setOpen}
            regionsPromise={regionPromise}
            categoriesPromise={categoriesPromise}
          />
        </DialogContent>
      </Dialog>

      <Card className="max-w-md mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">행사 관리</h3>
          <p className="text-sm text-muted-foreground">
            새 행사를 추가하려면 위 버튼을 클릭하세요. 모든 필수 정보를 입력해주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventModal;
