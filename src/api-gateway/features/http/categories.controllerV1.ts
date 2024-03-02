import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import {
  CreateCategoryCommand,
  CreateCategoryHandler,
  CreateCategoryResponseDto,
  GetManyCategoriesHandler,
  GetManyCategoriesQuery,
  UpdateCategoryCommand,
  UpdateCategoryHandler,
} from '@app/contexts';
import { AppRoutes, CategoriesQueryParamsDto, ValidationErrorDto } from '@app/core';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, ConflictErrorResponse, NotFoundErrorResponse } from '@libs/common';

import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto, UpdateCategoryParamDto } from './category-dtos';

@ApiTags('Categories')
@Controller({
  version: '1',
})
export class CategoriesControllerV1 {
  constructor(
    private readonly createCategoryHandler: CreateCategoryHandler,
    private readonly updateCategoryHandler: UpdateCategoryHandler,
    private readonly getManyCategoriesHandler: GetManyCategoriesHandler,
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
    path: AppRoutes.CATEGORIES.v1.create,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.CATEGORIES.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.CATEGORIES.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(AppRoutes.CATEGORIES.v1.create)
  async create(@Body() dto: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
    return this.createCategoryHandler.execute(
      new CreateCategoryCommand({
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        ctx: dto.ctx,
      }),
    );
  }

  @ApiOperation({
    summary: 'Get categories',
    description: 'Get categories with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: [CategoryResponseDto],
    path: AppRoutes.CATEGORIES.v1.getCategories,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.CATEGORIES.v1.getCategories)
  async getMany(@Query() dto: CategoriesQueryParamsDto): Promise<CategoryResponseDto[]> {
    return this.getManyCategoriesHandler.execute(
      new GetManyCategoriesQuery({
        _filter: {
          id: dto?._filter?.id,
          name: dto?._filter?.name,
          ctx: dto?._filter?.ctx,
          parentId: dto?._filter?.parentId,
        },
      }),
    );
  }

  @ApiOperation({
    summary: 'Update category',
    description: 'Update category with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    path: AppRoutes.CATEGORIES.v1.update,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.CATEGORIES.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.NOT_FOUND,
    type: NotFoundErrorResponse,
    path: AppRoutes.CATEGORIES.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(AppRoutes.CATEGORIES.v1.update)
  async update(@Param() paramDto: UpdateCategoryParamDto, @Body() dto: UpdateCategoryDto): Promise<void> {
    return this.updateCategoryHandler.execute(
      new UpdateCategoryCommand({
        id: paramDto.id,
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        ctx: dto.ctx,
      }),
    );
  }
}
