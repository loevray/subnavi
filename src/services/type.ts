import { SerializedAppError } from '@/lib/errors/error-contract';

export type Result<D, E = Error> =
  | {
      success: true;
      data: D;
    }
  | { success: false; error: E };
export type ServiceResult<D> = Result<D, SerializedAppError>;
