import { InternalError, isCustomError } from '@/lib/errors/serviceErrors.server';

export default function handleCustomError(error: unknown): Response {
  console.error('Custom Error:', error);

  if (isCustomError(error)) {
    return Response.json(error.toResponse(), { status: error.statusCode });
  }

  // 예상치 못한 에러
  const internalError = new InternalError();
  return Response.json(internalError.toResponse(), { status: 500 });
}
