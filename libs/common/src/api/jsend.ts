import { ApiResponseStatusJsendEnum } from './api.interfaces';

export class SuccessResponse {
	readonly status = ApiResponseStatusJsendEnum.SUCCESS;

	readonly data: any | null;

	constructor(data: any | null) {
		this.data = data || null;
	}
}

export class FailResponse {
	readonly status = ApiResponseStatusJsendEnum.FAIL;

	readonly data: any;

	constructor(data: any) {
		this.data = data;
	}
}

export class ErrorResponse {
	readonly status = ApiResponseStatusJsendEnum.ERROR;

	readonly message: string;

	constructor(message: string) {
		this.message = message;
	}
}

export function createJsendResponse<T>(status: ApiResponseStatusJsendEnum, dataOrMessage: T) {
	switch (status) {
		case ApiResponseStatusJsendEnum.SUCCESS:
			return new SuccessResponse(dataOrMessage);
		case ApiResponseStatusJsendEnum.FAIL:
			return new FailResponse(dataOrMessage);
		case ApiResponseStatusJsendEnum.ERROR:
			return new ErrorResponse(dataOrMessage as string);
		default:
			throw new Error(`Invalid status: ${status}`);
	}
}
