'use client';

import UnexpectedErrorPage from '@/components/common/UnexpectedErrorPage';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <UnexpectedErrorPage
      error={error}
      logLabel="Error captured by error.tsx:"
      title={
        <>
          서버에서 예기치 못한
          <br />
          오류가 발생했어요.
        </>
      }
      description={
        <>
          저희 쪽 문제예요.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      }
      primaryActionLabel="다시 시도하기"
      onPrimaryAction={reset}
    />
  );
}
