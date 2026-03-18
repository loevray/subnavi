'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

import { EventCategoryListResponse, RegionListResponse } from '@/dto/event/shared-event.dto';
import { ApiError, EventsApi } from '@/lib/api-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventForm from './eventForm/EventForm';

const EventModal = () => {
  const [open, setOpen] = useState(false);
  const [regions, setRegions] = useState<RegionListResponse | null>(null);
  const [categories, setCategories] = useState<EventCategoryListResponse | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  async function loadFormOptions() {
    try {
      setIsLoadingOptions(true);
      setOptionsError(null);

      const [nextRegions, nextCategories] = await Promise.all([EventsApi.Regions.getAll(), EventsApi.Categories.getAll()]);

      setRegions(nextRegions);
      setCategories(nextCategories);
    } catch (error) {
      if (error instanceof ApiError) {
        setOptionsError(error.message);
        return;
      }

      setOptionsError(error instanceof Error ? error.message : 'Failed to load form options.');
    } finally {
      setIsLoadingOptions(false);
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen && (!regions || !categories) && !isLoadingOptions) {
      void loadFormOptions();
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create event</DialogTitle>
          </DialogHeader>
          {isLoadingOptions ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading form options...
            </div>
          ) : optionsError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unable to open the event form</AlertTitle>
                <AlertDescription>{optionsError}</AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <Button type="button" onClick={() => void loadFormOptions()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : regions && categories ? (
            <EventForm
              onEventFormSubmit={() => {}}
              setOpen={setOpen}
              regions={regions}
              categories={categories}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Card className="mt-8 max-w-md">
        <CardContent className="p-6">
          <h3 className="mb-2 text-lg font-semibold">Event management</h3>
          <p className="text-sm text-muted-foreground">
            Open the form to create a new event. Form options are loaded through the public API so client-side failures can
            be retried in place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventModal;
