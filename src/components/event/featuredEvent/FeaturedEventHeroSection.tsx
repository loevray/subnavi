import { EventListItem } from '@/dto/event/event-list.dto';
import FeaturedEventHero from './FeaturedEventHero';

export default function FeaturedEventHeroSection({ event }: { event: EventListItem }) {
  return <FeaturedEventHero event={event} />;
}
