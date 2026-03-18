import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MainError from './error';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('app/(main)/error.tsx', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('홈 피드용 로컬 에러 UI를 렌더링한다', () => {
    render(<MainError error={Object.assign(new globalThis.Error('boom'), { digest: 'main-123' })} reset={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '메인 페이지를 불러오는 중 예기치 못한 오류가 발생했어요.' })).toBeTruthy();
    expect(screen.getByText('main-123')).toBeTruthy();
  });

  it('홈 이동 버튼은 루트 경로로 push한다', () => {
    render(<MainError error={new globalThis.Error('boom')} reset={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '홈으로 돌아가기 →' }));

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
