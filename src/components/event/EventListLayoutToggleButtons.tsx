import { LayoutGridIcon, MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

export default function EventListLayoutToggleButtons() {
  return (
    <ToggleGroup
      defaultValue="grid"
      className="hidden md:flex gap-2"
      type="single"
    >
      <ToggleGroupItem
        className=""
        asChild
        value="column"
        aria-label="Column Layout"
      >
        <Button
          size="icon"
          className="data-[state=on]:bg-indigo-600 data-[state=on]:hover:bg-indigo-700 data-[state=on]:text-white text-black p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <MenuIcon />
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem
        className=""
        asChild
        value="grid"
        aria-label="Grid Layout"
      >
        <Button
          size="icon"
          className="data-[state=on]:bg-indigo-600 data-[state=on]:hover:bg-indigo-700 data-[state=on]:text-white text-black p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <LayoutGridIcon />
        </Button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
