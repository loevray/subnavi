import type { EventListItem } from '@/dto/event/event-list.dto';
import FeaturedEventHeroSection from '@/components/event/featuredEvent/FeaturedEventHeroSection';

export default function HomeFeedSection({ featuredEvent }: { featuredEvent?: EventListItem }) {
  if (!featuredEvent) {
    return null;
  }

  return <FeaturedEventHeroSection event={featuredEvent} />;
}
