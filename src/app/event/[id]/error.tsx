'use client';

import { useRouter } from 'next/navigation';

import UnexpectedErrorPage from '@/components/common/UnexpectedErrorPage';

type EventDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EventDetailError({ error, reset }: EventDetailErrorProps) {
  const router = useRouter();

  return (
    <UnexpectedErrorPage
      error={error}
      logLabel="Error captured by event/[id]/error.tsx:"
      title={
        <>
          행사 상세 정보를 불러오는 중
          <br />
          예기치 못한 오류가 발생했어요.
        </>
      }
      description={
        <>
          상세 화면을 준비하는 과정에서 문제가 생겼어요.
          <br />
          잠시 후 다시 시도하거나 행사 목록으로 돌아가 주세요.
        </>
      }
      primaryActionLabel="다시 시도하기"
      onPrimaryAction={reset}
      secondaryActionLabel="행사 목록으로 돌아가기 →"
      onSecondaryAction={() => router.push('/?page=1')}
    />
  );
}
