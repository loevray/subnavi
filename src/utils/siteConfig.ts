const LOCAL_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(
  siteUrl: string | undefined = process.env.NEXT_PUBLIC_BASE_URL,
  nodeEnv: string | undefined = process.env.NODE_ENV
) {
  const trimmed = siteUrl?.trim();

  if (trimmed) {
    return trimmed;
  }

  if (nodeEnv !== 'production') {
    return LOCAL_SITE_URL;
  }

  throw new Error('Missing NEXT_PUBLIC_BASE_URL for production metadata.');
}

export function getMetadataBase(
  siteUrl: string | undefined = process.env.NEXT_PUBLIC_BASE_URL,
  nodeEnv: string | undefined = process.env.NODE_ENV
) {
  return new URL(getSiteUrl(siteUrl, nodeEnv));
}

export function getApiBaseUrl(apiBaseUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL) {
  const trimmed = apiBaseUrl?.trim();
  return trimmed ? trimmed : '/api';
}

export function getOptionalEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
