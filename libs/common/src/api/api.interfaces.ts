export enum ApiResponseStatusJsendEnum {
	SUCCESS = 'success',
	FAIL = 'fail',
	ERROR = 'error',
}

export class ApiResponseBase {
	constructor(
		public statusCode: number,
		public timestamp: string,
		public path: string,
	) {}
}

export class ApiResponseJsend<T = unknown> {
	constructor(
		public status: ApiResponseStatusJsendEnum,
		public data: T | null,
		public message?: string,
	) {}
}
