export enum DomainErrorCode {
  Default = 'D_ERROR',
  UnknownError = 'D_UNKNOWN_ERROR',
  NotFound = 'D_NOT_FOUND',
  Unauthorized = 'D_UNAUTHORIZED',
  Forbidden = 'D_FORBIDDEN',
  ValidationFailed = 'D_VALIDATION_FAILED',
  DuplicateEntry = 'D_DUPLICATE_ENTRY',
  InvalidFormat = 'D_INVALID_FORMAT',
  InvalidParameter = 'D_INVALID_PARAMETER',
  DatabaseError = 'D_DATABASE_ERROR',
  ExternalServiceError = 'D_EXTERNAL_SERVICE_ERROR',
  TimeoutError = 'D_TIMEOUT_ERROR',
  FileReadError = 'D_FILE_READ_ERROR',
  FileWriteError = 'D_FILE_WRITE_ERROR',
  InvalidCredentials = 'D_INVALID_CREDENTIALS',
  MissingValue = 'D_MISSING_VALUE',
}

export enum ApplicationErrorCode {
  Default = 'A_ERROR_OCCURED',
  UnknownError = 'A_UNKNOWN_ERROR',
  NotFound = 'A_NOT_FOUND',
  Unauthorized = 'A_UNAUTHORIZED',
  Forbidden = 'A_FORBIDDEN',
  ValidationFailed = 'A_VALIDATION_FAILED',
  CannotCreateEntity = 'A_CANNOT_CREATE_ENTITY',
  DuplicateEntry = 'A_DUPLICATE_ENTRY',
  InvalidFormat = 'A_INVALID_FORMAT',
  InvalidParameter = 'A_INVALID_PARAMETER',
  DatabaseError = 'A_DATABASE_ERROR',
  ExternalServiceError = 'A_EXTERNAL_SERVICE_ERROR',
  TimeoutError = 'A_TIMEOUT_ERROR',
  ConnectionError = 'A_CONNECTION_ERROR',
  FileReadError = 'A_FILE_READ_ERROR',
  FileWriteError = 'A_FILE_WRITE_ERROR',
  InvalidCredentials = 'A_INVALID_CREDENTIALS',
  InsufficientPermissions = 'A_INSUFFICIENT_PERMISSIONS',
  PaymentRequired = 'A_PAYMENT_REQUIRED',
  LimitExceeded = 'A_LIMIT_EXCEEDED',
  Unavailable = 'A_UNAVAILABLE',
}

export enum FrameworkErrorCode {
  Default = 'F_SERVER_ERROR',
  UnknownError = 'F_UNKNOWN_ERROR',
  NotFound = 'F_NOT_FOUND',
  Unauthorized = 'F_UNAUTHORIZED',
  Forbidden = 'F_FORBIDDEN',
  ValidationFailed = 'F_VALIDATION_FAILED',
  DuplicateEntry = 'F_DUPLICATE_ENTRY',
  InvalidFormat = 'F_INVALID_FORMAT',
  InvalidParameter = 'F_INVALID_PARAMETER',
  DatabaseError = 'F_DATABASE_ERROR',
  ExternalServiceError = 'F_EXTERNAL_SERVICE_ERROR',
  TimeoutError = 'F_TIMEOUT_ERROR',
  ConnectionError = 'F_CONNECTION_ERROR',
  FileReadError = 'F_FILE_READ_ERROR',
  FileWriteError = 'F_FILE_WRITE_ERROR',
  InvalidCredentials = 'F_INVALID_CREDENTIALS',
  InsufficientPermissions = 'F_INSUFFICIENT_PERMISSIONS',
  PaymentRequired = 'F_PAYMENT_REQUIRED',
  LimitExceeded = 'F_LIMIT_EXCEEDED',
  Unavailable = 'F_UNAVAILABLE',
  ConfigurationError = 'F_CONFIGURATION_ERROR',
  DependencyError = 'F_DEPENDENCY_ERROR',
  SecurityError = 'F_SECURITY_ERROR',
  RateLimitExceeded = 'F_RATE_LIMIT_EXCEEDED',
  ServiceUnavailable = 'F_SERVICE_UNAVAILABLE',
}

export enum DomainErrorType {
  IDENTITY = 'identity',
}

export enum UserErrorCode {
  CannotCreate = 'U_CANNOT_CREATE',
}
