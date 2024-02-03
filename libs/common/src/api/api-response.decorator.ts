import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ValidationErrorResponse } from '../dto';
import { ApiResponseStatusJsendEnum } from './api.interfaces';

type SwaggerSchemaObj = SchemaObject | ReferenceObject;
type DataType = Type<unknown> | [Type<unknown>] | null;

type ApiDecoratorOptions = {
	type?: DataType;
	status: ApiResponseStatusJsendEnum;
	statusCode?: number;
	path?: string;
};

const getSuccessData = <TModel extends DataType>(model?: TModel): SwaggerSchemaObj => {
	if (Array.isArray(model)) {
		return {
			type: 'array',
			items: {
				$ref: getSchemaPath(model[0]),
			},
		};
	} else if (model) {
		return {
			type: 'object',
			$ref: getSchemaPath(model),
		};
	} else {
		return {
			type: 'object',
			example: null,
			nullable: true,
		};
	}
};

const getFailData = <TModel extends DataType>(model?: TModel): SwaggerSchemaObj => {
	if (model) {
		return {
			type: 'object',
			$ref: getSchemaPath(model as Type<unknown>),
		};
	} else {
		return {
			type: 'object',
			$ref: getSchemaPath(ValidationErrorResponse),
		};
	}
};

const getMessage = (): SwaggerSchemaObj => ({
	type: 'string',
	example: 'Error message',
});

const defaultStatusCode = 200;

function getDescription(status: ApiResponseStatusJsendEnum) {
	switch (status) {
		case ApiResponseStatusJsendEnum.SUCCESS:
			return 'Successful operation';
		case ApiResponseStatusJsendEnum.FAIL:
			return 'Failed operation';
		case ApiResponseStatusJsendEnum.ERROR:
			return 'Error operation';
	}
}

const ApiJsendBuild = (props: Partial<ApiDecoratorOptions>): SwaggerSchemaObj => {
	return {
		properties: {
			...(props.status === ApiResponseStatusJsendEnum.SUCCESS
				? { data: getSuccessData(props.type) }
				: props.status === ApiResponseStatusJsendEnum.FAIL
				? { data: getFailData(props?.type) }
				: { message: getMessage() }),
		},
	};
};

const ApiDefaultBuild = (props: Partial<ApiDecoratorOptions>): SwaggerSchemaObj => {
	return {
		properties: {
			statusCode: {
				type: 'number',
				example: props.statusCode,
				nullable: false,
			},
			status: {
				type: 'string',
				enum: Object.values(ApiResponseStatusJsendEnum),
				example: props.status,
				nullable: false,
			},
			timestamp: {
				type: 'string',
				example: '2024-01-02T14:51:00.000Z',
				nullable: false,
			},
			path: {
				type: 'string',
				example: props?.path || '/api/v1/some-path',
				nullable: false,
			},
		},
		type: 'object',
	};
};

export const ApiJsendResponse = (props?: Partial<ApiDecoratorOptions>) => {
	const status = props?.status || ApiResponseStatusJsendEnum.SUCCESS;
	const statusCode = props?.statusCode || defaultStatusCode;
	const type = props?.type ? props.type : null;
	const path = props?.path;

	const description = getDescription(status);

	const isNoContent = statusCode === 204;

	const schema = isNoContent
		? {}
		: {
				schema: {
					allOf: [ApiDefaultBuild({ statusCode, status, path }), ApiJsendBuild({ type, status })],
				},
		  };

	const decorators: any = [];

	if (type) {
		const inArr = Array.isArray(type) ? type : [type];
		decorators.push(ApiExtraModels(...inArr, ValidationErrorResponse));
	}

	return applyDecorators(
		...decorators,
		ApiResponse({
			status: statusCode,
			description,
			...schema,
		}),
	);
};
