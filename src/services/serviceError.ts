import type { PostgrestError } from '@supabase/postgrest-js';

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors/serviceErrors.server';
import type { ServiceResult } from './type';

export function validationFailure<T>(message: string, details?: unknown): ServiceResult<T> {
  return {
    success: false,
    error: new ValidationError(message, details).toResponse().error,
  };
}

export function notFoundFailure<T>(message: string, details?: unknown): ServiceResult<T> {
  return {
    success: false,
    error: new NotFoundError(message, details).toResponse().error,
  };
}

export function handleSingleRowPostgrestError<T>(
  error: PostgrestError,
  operation: string,
  notFoundMessage: string
): ServiceResult<T> {
  if (error.code === 'PGRST116') {
    return notFoundFailure<T>(notFoundMessage, error);
  }

  throw new DatabaseError(`Failed to ${operation}: ${error.message}`, error);
}

export function throwUnexpectedPostgrestError(error: PostgrestError, operation: string): never {
  throw new DatabaseError(`Failed to ${operation}: ${error.message}`, error);
}
