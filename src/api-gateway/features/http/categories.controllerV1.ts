import { CreateCategoryCommand, CreateCategoryResponseDto } from '@app/contexts/features/categories/application/create/create-category.command';
import { AppRoutes } from '@app/core';
import { ValidationErrorDto } from '@app/core/dtos';
import { ConflictErrorResponse } from '@libs/common';
import { ApiJsendResponse, ApiResponseStatusJsendEnum } from '@libs/common/api';
import { CommandBus, QueryBus } from '@libs/cqrs';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { CreateCategoryDto } from './category-dtos';

@ApiTags('Categories')
@Controller({
	version: '1',
})
export class CategoriesControllerV1 {
	constructor(
		private queryBus: QueryBus,
		private commandBus: CommandBus,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	@ApiOperation({
		summary: 'Create category',
		description: 'Create category with given options',
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.CREATED,
		type: CreateCategoryResponseDto,
		path: AppRoutes.AUTH.v1.signup,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.BAD_REQUEST,
		type: ValidationErrorDto,
		path: AppRoutes.AUTH.v1.signup,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.CONFLICT,
		type: ConflictErrorResponse,
		path: AppRoutes.AUTH.v1.signup,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@HttpCode(HttpStatus.CREATED)
	@Post(AppRoutes.CATEGORIES.v1.create)
	async create(@Body() dto: CreateCategoryDto): Promise<CreateCategoryResponseDto[]> {
		return this.commandBus.execute(
			new CreateCategoryCommand({
				name: dto.name,
				description: dto.description,
				parentId: dto.parentId,
				context: dto.context,
			}),
		);
	}
}
