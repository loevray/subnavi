'use client';

import UnexpectedErrorPage from '@/components/common/UnexpectedErrorPage';

type MainErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MainError({ error, reset }: MainErrorProps) {
  return (
    <UnexpectedErrorPage
      error={error}
      logLabel="Error captured by (main)/error.tsx:"
      title={
        <>
          메인 페이지를 불러오는 중
          <br />
          예기치 못한 오류가 발생했어요.
        </>
      }
      description={
        <>
          홈 피드와 추천 섹션을 준비하는 과정에서 문제가 생겼어요.
          <br />
          잠시 후 다시 시도해주세요
        </>
      }
      primaryActionLabel="다시 시도하기"
      onPrimaryAction={reset}
    />
  );
}
