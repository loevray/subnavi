export function isDevelopmentEnvironment(nodeEnv: string | undefined = process.env.NODE_ENV) {
  return nodeEnv === 'development';
}

export function createNotFoundApiResponse() {
  return Response.json(
    {
      error: {
        code: 'NOT_FOUND',
        message: 'Not Found',
        statusCode: 404,
      },
    },
    { status: 404 }
  );
}
