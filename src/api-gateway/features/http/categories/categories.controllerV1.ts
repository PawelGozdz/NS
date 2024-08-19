import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AuthUser, CreateCategoryCommand, CreateCategoryResponseDto, GetManyCategoriesQuery, UpdateCategoryCommand } from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, CategoriesQueryParamsDto, GetCurrentAuthUser, ValidationErrorDto } from '@app/core';
import { ActorType, ConflictErrorResponse, NotFoundErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto, UpdateCategoryParamDto } from './category-dtos';

@ApiTags('Categories')
@Controller({
  version: '1',
})
export class CategoriesControllerV1 {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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
  async create(@Body() dto: CreateCategoryDto, @GetCurrentAuthUser() user: AuthUser): Promise<CreateCategoryResponseDto> {
    return this.commandBus.execute(
      new CreateCategoryCommand({
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        actor: {
          id: user.userId,
          type: ActorType.USER,
          source: this.constructor.name,
        },
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
    path: AppRoutes.CATEGORIES.v1.getMany,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.CATEGORIES.v1.getMany)
  async getMany(@Query() dto: CategoriesQueryParamsDto, @GetCurrentAuthUser() user: AuthUser): Promise<CategoryResponseDto[]> {
    return this.queryBus.execute(
      new GetManyCategoriesQuery({
        _filter: {
          id: dto?._filter?.id,
          name: dto?._filter?.name,
          parentId: dto?._filter?.parentId,
        },
        actor: {
          id: user.userId,
          type: ActorType.USER,
          source: this.constructor.name,
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
  async update(@Param() paramDto: UpdateCategoryParamDto, @Body() dto: UpdateCategoryDto, @GetCurrentAuthUser() user: AuthUser): Promise<void> {
    return this.commandBus.execute(
      new UpdateCategoryCommand({
        id: paramDto.id,
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        actor: {
          id: user.userId,
          type: ActorType.USER,
          source: this.constructor.name,
        },
      }),
    );
  }
}
