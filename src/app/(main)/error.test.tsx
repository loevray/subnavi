import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MainError from './error';

describe('app/(main)/error.tsx', () => {
  afterEach(() => {
    cleanup();
  });

  it('홈 피드용 로컬 에러 UI를 렌더링한다', () => {
    render(<MainError error={Object.assign(new globalThis.Error('boom'), { digest: 'main-123' })} reset={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '메인 페이지를 불러오는 중 예기치 못한 오류가 발생했어요.' })).toBeTruthy();
    expect(screen.getByText('main-123')).toBeTruthy();
    expect(screen.getByRole('main').className).toContain('hide-layout-header');
  });

  it('secondary 액션이 없으면 추가 버튼을 렌더링하지 않는다', () => {
    render(<MainError error={new globalThis.Error('boom')} reset={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /홈으로 돌아가기/i })).toBeNull();
  });
});
