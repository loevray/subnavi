'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { siFacebook, siX, siKakaotalk } from 'simple-icons/icons';
import { Share } from 'lucide-react';

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  icon: { path: string; hex: string };
  size?: number;
  color?: string;
}

function SvgIcon({
  icon,
  size = 24,
  color,
  className,
  ...props
}: SvgIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color ?? `#${icon.hex}`}
      className={className}
      dangerouslySetInnerHTML={{ __html: `<path d="${icon.path}" />` }}
      aria-hidden="true"
      {...props}
    />
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedURL = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const snsLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    X: `https://x.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`,
    kakao: `https://sharer.kakao.com/talk/friends/picker/link?url=${encodedURL}`,
  };

  const handleShare = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <Share />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleShare(snsLinks.facebook)}
        >
          <SvgIcon icon={siFacebook} size={20} className="mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleShare(snsLinks.X)}
        >
          <SvgIcon icon={siX} size={20} className="mr-2" />X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleShare(snsLinks.kakao)}
        >
          <SvgIcon icon={siKakaotalk} size={20} className="mr-2" />
          KakaoTalk
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
