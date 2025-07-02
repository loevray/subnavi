'use client';

import { LayoutGridIcon, MenuIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { useState } from 'react';

export default function EventListLayoutToggleButtons() {
  const [value, setValue] = useState('grid');
  //전역 상태관리를 활용해서 grid, column값을 상위 컴포넌트로넘겨주자
  return (
    <ToggleGroup
      value={value}
      className="hidden md:flex gap-2"
      type="single"
      onValueChange={(value) => {
        if (value) setValue(value);
      }}
    >
      <ToggleGroupItem className="" asChild value="column" aria-label="Column Layout">
        <Button
          size="icon"
          className="data-[state=on]:bg-indigo-600 data-[state=on]:hover:bg-indigo-700 data-[state=on]:text-white text-black p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <MenuIcon />
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem className="" asChild value="grid" aria-label="Grid Layout">
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
