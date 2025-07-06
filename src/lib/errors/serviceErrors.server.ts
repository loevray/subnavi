export abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'CustomError';
    // Error.captureStackTrace가 있으면 사용 (Node.js 환경)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toResponse(): CustomErrorSerialized {
    return {
      error: {
        message: this.message,
        statusCode: this.statusCode,
        //객체인지 체크...
        ...(this.details !== undefined ? { details: this.details } : undefined),
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
      },
    };
  }

  //추후 as const로 타입 대체 필요
  //db 에러는 client에서 불필요함
  static fromCode(code: number, message: string, details?: unknown) {
    switch (code) {
      case 400:
        return new ValidationError(message, details);
      case 404:
        return new NotFoundError(message, details);
      default:
        return new InternalError(message, details);
    }
  }
}

export type CustomErrorSerialized = {
  error: {
    message: string;
    statusCode: number;
    details?: unknown;
    stack?: string;
  };
};

/* 
  - 내부에서만 다뤄야 하는 Validation에러와 유저에게 보여줘야하는 에러가 나뉨
  - db column명 <=> be property명 매핑 문제는 client에게 x
  - 클라이언트에게 요청 받은 데이터의 validation 에러는 o
  - 클라이언트에게 응답하는 데이터의 validation 에러는?
*/

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

export class InternalError extends CustomError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 500, details);
    this.name = 'InternalError';
  }
}

// 에러 타입 가드 헬퍼 함수들
export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError || (error instanceof Error && error.name === 'CustomError');
};
