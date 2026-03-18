import { describe, expect, it } from 'vitest';

import { createNotFoundApiResponse, isDevelopmentEnvironment } from './runtimeEnvironment';

describe('runtimeEnvironment', () => {
  it('treats only development as dev mode', () => {
    expect(isDevelopmentEnvironment('development')).toBe(true);
    expect(isDevelopmentEnvironment('test')).toBe(false);
    expect(isDevelopmentEnvironment('production')).toBe(false);
    expect(isDevelopmentEnvironment('')).toBe(false);
  });

  it('returns a serialized 404 response for dev-only APIs', async () => {
    const response = createNotFoundApiResponse();
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Not Found',
        statusCode: 404,
      },
    });
  });
});
