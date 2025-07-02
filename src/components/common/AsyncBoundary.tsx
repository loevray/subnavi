import { ErrorBoundary, ErrorBoundaryProps } from 'next/dist/client/components/error-boundary';
import { Suspense, SuspenseProps } from 'react';

export default function AsyncBoundary({ errorComponent, fallback, children }: ErrorBoundaryProps & SuspenseProps) {
  return (
    <ErrorBoundary errorComponent={errorComponent}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
