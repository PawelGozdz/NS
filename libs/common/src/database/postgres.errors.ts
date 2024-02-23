import { FrameworkError, FrameworkErrorOptions } from '../errors/framework.errors';
import { PostgresErrorCode } from './postgres-error.enum';

export class UniqueViolationError extends FrameworkError {
	static statusCode: number = 409;
	static message: string = 'Unique Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(UniqueViolationError.statusCode, message || UniqueViolationError.message, {
			code: PostgresErrorCode.UniqueViolation,
			...options,
		});
	}
}

export class ForeignKeyViolationError extends FrameworkError {
	static statusCode: number = 409;
	static message: string = 'Foreign Key Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(ForeignKeyViolationError.statusCode, message || ForeignKeyViolationError.message, {
			code: PostgresErrorCode.ForeignKeyViolation,
			...options,
		});
	}
}

export class NotNullViolationError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Not Null Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(NotNullViolationError.statusCode, message || NotNullViolationError.message, {
			code: PostgresErrorCode.NotNullViolation,
			...options,
		});
	}
}

export class CheckViolationError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Check Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(CheckViolationError.statusCode, message || CheckViolationError.message, {
			code: PostgresErrorCode.CheckViolation,
			...options,
		});
	}
}

export class InvalidTextRepresentationError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Invalid Text Representation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(InvalidTextRepresentationError.statusCode, message || InvalidTextRepresentationError.message, {
			code: PostgresErrorCode.InvalidTextRepresentation,
			...options,
		});
	}
}

export class NumericValueOutOfRangeError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Numeric Value Out Of Range';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(NumericValueOutOfRangeError.statusCode, message || NumericValueOutOfRangeError.message, {
			code: PostgresErrorCode.NumericValueOutOfRange,
			...options,
		});
	}
}

export class DivisionByZeroError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Division By Zero';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(DivisionByZeroError.statusCode, message || DivisionByZeroError.message, {
			code: PostgresErrorCode.DivisionByZero,
			...options,
		});
	}
}

export class DataExceptionError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Data Exception';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(DataExceptionError.statusCode, message || DataExceptionError.message, {
			code: PostgresErrorCode.DataException,
			...options,
		});
	}
}

export class IntegrityConstraintViolationError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Integrity Constraint Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(IntegrityConstraintViolationError.statusCode, message || IntegrityConstraintViolationError.message, {
			code: PostgresErrorCode.IntegrityConstraintViolation,
			...options,
		});
	}
}

export class SyntaxErrorOrAccessRuleViolationError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Syntax Error Or Access Rule Violation';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(SyntaxErrorOrAccessRuleViolationError.statusCode, message || SyntaxErrorOrAccessRuleViolationError.message, {
			code: PostgresErrorCode.SyntaxErrorOrAccessRuleViolation,
			...options,
		});
	}
}

export class InsufficientResourcesError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Insufficient Resources';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(InsufficientResourcesError.statusCode, message || InsufficientResourcesError.message, {
			code: PostgresErrorCode.InsufficientResources,
			...options,
		});
	}
}

export class DiskFullError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Disk Full';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(DiskFullError.statusCode, message || DiskFullError.message, {
			code: PostgresErrorCode.DiskFull,
			...options,
		});
	}
}

export class OutOfMemoryError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Out Of Memory';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(OutOfMemoryError.statusCode, message || OutOfMemoryError.message, {
			code: PostgresErrorCode.OutOfMemory,
			...options,
		});
	}
}

export class TooManyConnectionsError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Too Many Connections';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(TooManyConnectionsError.statusCode, message || TooManyConnectionsError.message, {
			code: PostgresErrorCode.TooManyConnections,
			...options,
		});
	}
}

export class ConfigurationLimitExceededError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Configuration Limit Exceeded';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(ConfigurationLimitExceededError.statusCode, message || ConfigurationLimitExceededError.message, {
			code: PostgresErrorCode.ConfigurationLimitExceeded,
			...options,
		});
	}
}

export class OperatorInterventionError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'Operator Intervention';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(OperatorInterventionError.statusCode, message || OperatorInterventionError.message, {
			code: PostgresErrorCode.OperatorIntervention,
			...options,
		});
	}
}

export class SystemError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'System Error';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(SystemError.statusCode, message || SystemError.message, {
			code: PostgresErrorCode.SystemError,
			...options,
		});
	}
}

export class IoError extends FrameworkError {
	static statusCode: number = 500;
	static message: string = 'IO Error';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(IoError.statusCode, message || IoError.message, {
			code: PostgresErrorCode.IoError,
			...options,
		});
	}
}

export class UndefinedTableError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Undefined Table';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(UndefinedTableError.statusCode, message || UndefinedTableError.message, {
			code: PostgresErrorCode.UndefinedTable,
			...options,
		});
	}
}

export class UndefinedColumnError extends FrameworkError {
	static statusCode: number = 400;
	static message: string = 'Undefined Column';

	constructor(message?: string, options: FrameworkErrorOptions | Error = {}) {
		super(UndefinedColumnError.statusCode, message || UndefinedColumnError.message, {
			code: PostgresErrorCode.UndefinedColumn,
			...options,
		});
	}
}
