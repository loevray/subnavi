export abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    // Error.captureStackTrace가 있으면 사용 (Node.js 환경)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: unknown, statusCode: number = 400) {
    super(message, statusCode, details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, details?: unknown, statusCode: number = 500) {
    super(message, statusCode, details);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, 403, details);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict', details?: unknown) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

// 에러 타입 가드 헬퍼 함수들
export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError;
};

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

// 에러 코드 상수
export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 에러 생성 팩토리 함수들 (선택적)
export const createValidationError = (message: string, details?: unknown) =>
  new ValidationError(message, details);

export const createDatabaseError = (message: string, details?: unknown) =>
  new DatabaseError(message, details);

export const createNotFoundError = (message?: string, details?: unknown) =>
  new NotFoundError(message, details);
