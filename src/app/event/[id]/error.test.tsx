import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EventDetailError from './error';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('app/event/[id]/error.tsx', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('상세 페이지용 로컬 에러 UI를 렌더링한다', () => {
    render(
      <EventDetailError error={Object.assign(new globalThis.Error('boom'), { digest: 'detail-123' })} reset={vi.fn()} />
    );

    expect(screen.getByRole('heading', { name: '행사 상세 정보를 불러오는 중 예기치 못한 오류가 발생했어요.' })).toBeTruthy();
    expect(screen.getByText('detail-123')).toBeTruthy();
  });

  it('행사 목록 이동 버튼은 목록 경로로 push한다', () => {
    render(<EventDetailError error={new globalThis.Error('boom')} reset={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '행사 목록으로 돌아가기 →' }));

    expect(pushMock).toHaveBeenCalledWith('/?page=1');
  });
});
