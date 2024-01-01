import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseStatusJsendEnum } from './api.interfaces';

export class SuccessResponse<T extends unknown> {
	@ApiProperty({ enum: ApiResponseStatusJsendEnum, example: ApiResponseStatusJsendEnum.SUCCESS })
	status = ApiResponseStatusJsendEnum.SUCCESS;

	@ApiProperty({
		nullable: true,
		required: false,
		example: { post: { id: 1 } },
	})
	readonly data: T | null;

	constructor(data: T) {
		this.data = data || null;
	}
}

export class FailResponse<T> {
	@ApiProperty({ enum: ApiResponseStatusJsendEnum, example: ApiResponseStatusJsendEnum.FAIL })
	status = ApiResponseStatusJsendEnum.FAIL;

	@ApiProperty({
		nullable: true,
		required: false,
		example: { subErrors: [{ message: 'incorrect email' }] },
	})
	readonly data: T;

	constructor(data: T) {
		this.data = data;
	}
}

export class ErrorResponse {
	@ApiProperty({ enum: ApiResponseStatusJsendEnum, example: ApiResponseStatusJsendEnum.ERROR })
	status = ApiResponseStatusJsendEnum.ERROR;

	@ApiProperty({ type: String })
	message: string;

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
