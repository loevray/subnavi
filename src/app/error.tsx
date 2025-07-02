'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function ErrorPage({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h2 className="text-2xl font-semibold text-destructive">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
      <Button onClick={onAction} className="mt-6">
        {actionLabel}
      </Button>
    </div>
  );
}

type ErrorProps = {
  error: Error & { digest?: string }; // Next.js는 `digest` 추가함
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error captured by error.tsx:', error);
  }, [error]);

  const router = useRouter();

  // 기본 메시지
  const title = '문제가 발생했습니다.';
  const description = '잠시 후 다시 시도해주세요.';

  // 커스텀 에러 유형 분기
  if (error.name === 'ValidationError') {
    return (
      <ErrorPage title="입력 오류" description={error.message} actionLabel="뒤로가기" onAction={() => router.back()} />
    );
  }

  if (error.name === 'ForbiddenError') {
    return (
      <ErrorPage
        title="접근 권한 없음"
        description="이 리소스에 접근할 권한이 없습니다."
        actionLabel="홈으로 가기"
        onAction={() => router.push('/')}
      />
    );
  }

  if (error.name === 'NotFoundError') {
    return (
      <ErrorPage
        title="찾을 수 없습니다"
        description="요청한 리소스를 찾을 수 없습니다."
        actionLabel="홈으로 가기"
        onAction={() => router.push('/')}
      />
    );
  }

  // fallback
  return <ErrorPage title={title} description={description} actionLabel="다시 시도" onAction={reset} />;
}
