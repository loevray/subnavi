import { describe, expect, it } from 'vitest';

import { getApiBaseUrl, getMetadataBase, getOptionalEnvValue, getSiteUrl } from './siteConfig';

describe('siteConfig', () => {
  it('uses the configured public site URL when present', () => {
    expect(getSiteUrl('https://subnavi.com', 'production')).toBe('https://subnavi.com');
    expect(getMetadataBase('https://subnavi.com', 'production').toString()).toBe('https://subnavi.com/');
  });

  it('falls back to localhost outside production', () => {
    expect(getSiteUrl('', 'development')).toBe('http://localhost:3000');
    expect(getMetadataBase('', 'test').toString()).toBe('http://localhost:3000/');
  });

  it('throws when the public site URL is missing in production', () => {
    expect(() => getSiteUrl('', 'production')).toThrow('Missing NEXT_PUBLIC_BASE_URL for production metadata.');
  });

  it('defaults client API requests to same-origin api routes', () => {
    expect(getApiBaseUrl('https://subnavi.com/api')).toBe('https://subnavi.com/api');
    expect(getApiBaseUrl('')).toBe('/api');
    expect(getApiBaseUrl('   ')).toBe('/api');
  });

  it('normalizes optional env values', () => {
    expect(getOptionalEnvValue('  value  ')).toBe('value');
    expect(getOptionalEnvValue('   ')).toBeUndefined();
    expect(getOptionalEnvValue(undefined)).toBeUndefined();
  });
});
