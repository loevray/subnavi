import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AppErrorBoundary from './error';

describe('app/error.tsx', () => {
  afterEach(() => {
    cleanup();
  });

  it('예상하지 못한 오류에 대한 공통 fallback UI를 렌더링한다', () => {
    const reset = vi.fn();
    const error = Object.assign(new globalThis.Error('boom'), { digest: 'digest-123' });

    render(<AppErrorBoundary error={error} reset={reset} />);

    expect(screen.getByRole('heading', { name: '서버에서 예기치 못한 오류가 발생했어요.' })).toBeTruthy();
    expect(screen.getByText(/TRACE/i)).toBeTruthy();
    expect(screen.getByText('digest-123')).toBeTruthy();
  });

  it('다시 시도 버튼은 reset 콜백을 호출한다', () => {
    const reset = vi.fn();

    render(<AppErrorBoundary error={new globalThis.Error('boom')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: '다시 시도하기' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('secondary 액션이 없으면 추가 버튼을 렌더링하지 않는다', () => {
    render(<AppErrorBoundary error={new globalThis.Error('boom')} reset={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /홈으로 돌아가기/i })).toBeNull();
  });
});
