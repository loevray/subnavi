import { AppErrorCode, ErrorResponseBody } from './error-contract';

export abstract class CustomError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code: AppErrorCode, statusCode: number, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = new.target.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toResponse(): CustomErrorSerialized {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.details !== undefined ? { details: this.details } : undefined),
        ...(process.env.NODE_ENV === 'development' ? { stack: this.stack } : undefined),
      },
    };
  }

  static fromCode(code: number, message: string, details?: unknown) {
    switch (code) {
      case 400:
        return new ValidationError(message, details);
      case 401:
        return new UnauthorizedError(message, details);
      case 403:
        return new ForbiddenError(message, details);
      case 404:
        return new NotFoundError(message, details);
      case 409:
        return new ConflictError(message, details);
      default:
        return new InternalError(message, details);
    }
  }
}

export type CustomErrorSerialized = ErrorResponseBody;

export class ValidationError extends CustomError {
  constructor(message: string, details?: unknown, statusCode: number = 400) {
    super(message, 'VALIDATION', statusCode, details);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, details?: unknown, statusCode: number = 500) {
    super(message, 'DATABASE', statusCode, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 'NOT_FOUND', 404, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(message, 'UNAUTHORIZED', 401, details);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, 'FORBIDDEN', 403, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict', details?: unknown) {
    super(message, 'CONFLICT', 409, details);
  }
}

export class InternalError extends CustomError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 'INTERNAL', 500, details);
  }
}

export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};
