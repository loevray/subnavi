import { CustomErrorSerialized } from '@/lib/errors/serviceErrors.server';

export type Result<D, E = Error> =
  | {
      success: true;
      data: D;
    }
  | { success: false; error: E };
export type ServiceResult<D> = Result<D, CustomErrorSerialized['error']>;
