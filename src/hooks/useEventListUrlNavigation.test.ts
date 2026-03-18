import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEventListUrlNavigation } from './useEventListUrlNavigation';

const pushMock = vi.fn();

let mockPathname = '/';
let mockSearchParams = '';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(mockSearchParams),
}));

describe('useEventListUrlNavigation', () => {
  beforeEach(() => {
    pushMock.mockReset();
    mockPathname = '/';
    mockSearchParams = '';
  });

  it('현재 쿼리를 유지하면서 새 searchParam을 push해야 한다', () => {
    mockSearchParams = 'keyword=test&page=2';

    const { result } = renderHook(() => useEventListUrlNavigation());

    act(() => {
      result.current.navigateWithParams((params) => {
        params.set('region', '서울');
      });
    });

    expect(pushMock).toHaveBeenCalledWith('/?keyword=test&page=2&region=%EC%84%9C%EC%9A%B8', { scroll: false });
  });

  it('쿼리가 모두 제거되면 pathname만 push해야 한다', () => {
    mockPathname = '/events';
    mockSearchParams = 'keyword=test';

    const { result } = renderHook(() => useEventListUrlNavigation());

    act(() => {
      result.current.navigateWithParams((params) => {
        params.delete('keyword');
      });
    });

    expect(pushMock).toHaveBeenCalledWith('/events', { scroll: false });
  });
});
