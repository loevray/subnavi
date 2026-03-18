export type AppErrorCode =
  | 'VALIDATION'
  | 'DATABASE'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INTERNAL';

export type SerializedAppError = {
  code: AppErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
  stack?: string;
};

export type ErrorResponseBody = {
  error: SerializedAppError;
};

export function isSerializedAppError(value: unknown): value is SerializedAppError {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SerializedAppError>;
  return (
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string' &&
    typeof candidate.statusCode === 'number'
  );
}
