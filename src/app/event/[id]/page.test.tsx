import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { EventDetailResponse } from '@/dto/event/event-detail.dto';
import EventDetail from './page';

const { getEventByIdMock, notFoundMock } = vi.hoisted(() => ({
  getEventByIdMock: vi.fn(),
  notFoundMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

vi.mock('@/services/Event', () => ({
  eventService: {
    getEventById: getEventByIdMock,
  },
}));

vi.mock('./EventDetailView', () => ({
  default: ({ event }: { event: { title: string } }) => <div>{event.title}</div>,
}));

const mockEvent = {
  id: '3c7a8cdd-9f4f-4ddb-b5ce-86adf5cb8cf4',
  title: '테스트 행사',
} as unknown as EventDetailResponse;

const routeParams = {
  params: Promise.resolve({
    id: '3c7a8cdd-9f4f-4ddb-b5ce-86adf5cb8cf4',
  }),
};

describe('app/event/[id]/page.tsx', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    getEventByIdMock.mockReset();
    notFoundMock.mockReset();
    consoleErrorSpy.mockClear();
  });

  it('정상 응답이면 상세 화면을 렌더링한다', async () => {
    getEventByIdMock.mockResolvedValue({
      success: true,
      data: mockEvent,
    });

    const ui = await EventDetail(routeParams);
    render(ui);

    expect(screen.getByText('테스트 행사')).toBeTruthy();
  });

  it.each([
    {
      code: 'NOT_FOUND',
      statusCode: 404,
    },
    {
      code: 'VALIDATION',
      statusCode: 400,
    },
  ])('예상 가능한 $code 실패는 notFound()로 전환한다', async ({ code, statusCode }) => {
    const notFoundSignal = new Error(`notFound:${code}`);

    notFoundMock.mockImplementation(() => {
      throw notFoundSignal;
    });

    getEventByIdMock.mockResolvedValue({
      success: false,
      error: {
        code,
        message: 'expected failure',
        statusCode,
      },
    });

    await expect(EventDetail(routeParams)).rejects.toBe(notFoundSignal);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('예상하지 못한 실패는 서버 로그를 남기고 고정된 일반 에러를 throw한다', async () => {
    const unexpectedError = {
      code: 'INTERNAL',
      message: 'database connection lost',
      statusCode: 500,
    } as const;

    getEventByIdMock.mockResolvedValue({
      success: false,
      error: unexpectedError,
    });

    await expect(EventDetail(routeParams)).rejects.toThrow(
      '행사 상세 정보를 준비하는 중 예상하지 못한 문제가 발생했습니다.'
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected service failure in event/[id]/page:', {
      id: '3c7a8cdd-9f4f-4ddb-b5ce-86adf5cb8cf4',
      error: unexpectedError,
    });
  });
});
