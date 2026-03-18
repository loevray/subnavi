import type { PostgrestError } from '@supabase/postgrest-js';
import { describe, expect, it } from 'vitest';

import {
  handleSingleRowPostgrestError,
  notFoundFailure,
  throwUnexpectedPostgrestError,
  validationFailure,
} from './serviceError';

const singleRowMissingError = {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  hint: '',
  message: 'JSON object requested, multiple (or no) rows returned',
  name: 'PostgrestError',
} satisfies PostgrestError;

const duplicateKeyError = {
  code: '23505',
  details: 'Key (id)=(123) already exists.',
  hint: '',
  message: 'duplicate key value violates unique constraint "events_pkey"',
  name: 'PostgrestError',
} satisfies PostgrestError;

describe('serviceError helpers', () => {
  it('returns a serialized validation failure for expected request errors', () => {
    const result = validationFailure<never>('Request validation failed', { field: 'id' });

    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({
        code: 'VALIDATION',
        message: 'Request validation failed',
        statusCode: 400,
        details: { field: 'id' },
      }),
    });
  });

  it('returns a serialized not-found failure for expected missing-resource cases', () => {
    const result = notFoundFailure<never>('Event not found', { id: 'missing-id' });

    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({
        code: 'NOT_FOUND',
        message: 'Event not found',
        statusCode: 404,
        details: { id: 'missing-id' },
      }),
    });
  });

  it('maps the Supabase single-row missing error to a not-found failure', () => {
    const result = handleSingleRowPostgrestError<never>(
      singleRowMissingError,
      'fetch event by id',
      'Event not found'
    );

    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({
        code: 'NOT_FOUND',
        message: 'Event not found',
        statusCode: 404,
      }),
    });
  });

  it('throws for unexpected Supabase database errors', () => {
    expect(() => throwUnexpectedPostgrestError(duplicateKeyError, 'create event')).toThrowError(
      'Failed to create event: duplicate key value violates unique constraint "events_pkey"'
    );
  });

  it('throws from the single-row helper when the error is not a missing-row case', () => {
    expect(() =>
      handleSingleRowPostgrestError<never>(duplicateKeyError, 'fetch event by id', 'Event not found')
    ).toThrowError('Failed to fetch event by id: duplicate key value violates unique constraint "events_pkey"');
  });
});
