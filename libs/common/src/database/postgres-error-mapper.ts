import { FrameworkError, FrameworkErrorOptions } from '../errors';
import { PostgresErrorCode } from './postgres-error.enum';
import {
  CheckViolationError,
  ConfigurationLimitExceededError,
  DataExceptionError,
  DiskFullError,
  DivisionByZeroError,
  ForeignKeyViolationError,
  InsufficientResourcesError,
  IntegrityConstraintViolationError,
  InvalidTextRepresentationError,
  IoError,
  NotNullViolationError,
  NumericValueOutOfRangeError,
  OperatorInterventionError,
  OutOfMemoryError,
  SyntaxErrorOrAccessRuleViolationError,
  SystemError,
  TooManyConnectionsError,
  UndefinedColumnError,
  UndefinedTableError,
  UniqueViolationError,
} from './postgres.errors';

export function throwErrorBasedOnPostgresErrorCode(code: string, message?: string, options: FrameworkErrorOptions | Error = {}) {
  switch (code) {
    case PostgresErrorCode.UniqueViolation:
      return new UniqueViolationError(message, options);
    case PostgresErrorCode.ForeignKeyViolation:
      return new ForeignKeyViolationError(message, options);
    case PostgresErrorCode.NotNullViolation:
      return new NotNullViolationError(message, options);
    case PostgresErrorCode.CheckViolation:
      return new CheckViolationError(message, options);
    case PostgresErrorCode.InvalidTextRepresentation:
      return new InvalidTextRepresentationError(message, options);
    case PostgresErrorCode.NumericValueOutOfRange:
      return new NumericValueOutOfRangeError(message, options);
    case PostgresErrorCode.DivisionByZero:
      return new DivisionByZeroError(message, options);
    case PostgresErrorCode.DataException:
      return new DataExceptionError(message, options);
    case PostgresErrorCode.IntegrityConstraintViolation:
      return new IntegrityConstraintViolationError(message, options);
    case PostgresErrorCode.SyntaxErrorOrAccessRuleViolation:
      return new SyntaxErrorOrAccessRuleViolationError(message, options);
    case PostgresErrorCode.InsufficientResources:
      return new InsufficientResourcesError(message, options);
    case PostgresErrorCode.DiskFull:
      return new DiskFullError(message, options);
    case PostgresErrorCode.OutOfMemory:
      return new OutOfMemoryError(message, options);
    case PostgresErrorCode.TooManyConnections:
      return new TooManyConnectionsError(message, options);
    case PostgresErrorCode.ConfigurationLimitExceeded:
      return new ConfigurationLimitExceededError(message, options);
    case PostgresErrorCode.OperatorIntervention:
      return new OperatorInterventionError(message, options);
    case PostgresErrorCode.SystemError:
      return new SystemError(message, options);
    case PostgresErrorCode.IoError:
      return new IoError(message, options);
    case PostgresErrorCode.UndefinedTable:
      return new UndefinedTableError(message, options);
    case PostgresErrorCode.UndefinedColumn:
      return new UndefinedColumnError(message, options);
    default:
      return new FrameworkError(500, 'Unknown Error', options);
  }
}
