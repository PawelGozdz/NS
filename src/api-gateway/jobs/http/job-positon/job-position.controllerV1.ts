import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AuthUser,
  CreateJobPositionCommand,
  CreateJobPositionResponseDto,
  GetManyJobPositionsQuery,
  GetManyJobPositionsResponseDto,
  UpdateJobPositionCommand,
} from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, GetCurrentAuthUser, IdDto, ValidationErrorDto } from '@app/core';
import { JobPositionsQueryParamsDto } from '@app/core/dtos/job-position-query-params.dto';
import { ActorType, ConflictErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { CreateJobPositionDto, JobPositionResponseDto, UpdateJobPositionDto } from './job-position-dtos';

@ApiTags('Job-positions')
@Controller({
  version: '1',
})
export class JobPositionsControllerV1 {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: 'Create job position',
    description: 'Create job position with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CREATED,
    type: CreateJobPositionDto,
    path: AppRoutes.JOB_POSITIONS.v1.create,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.JOB_POSITIONS.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.JOB_POSITIONS.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(AppRoutes.JOB_POSITIONS.v1.create)
  async create(@Body() dto: CreateJobPositionDto, @GetCurrentAuthUser() user: AuthUser): Promise<CreateJobPositionResponseDto> {
    return this.commandBus.execute(
      new CreateJobPositionCommand({
        title: dto.title,
        categoryId: dto.categoryId,
        skillIds: dto.skillIds,
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
      }),
    );
  }

  @ApiOperation({
    summary: 'Update job profile',
    description: 'Update user job profile with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: CreateJobPositionDto,
    path: AppRoutes.JOB_POSITIONS.v1.update,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.JOB_POSITIONS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.JOB_POSITIONS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(AppRoutes.JOB_POSITIONS.v1.update)
  async update(@Param() paramDto: IdDto, @Body() dto: UpdateJobPositionDto, @GetCurrentAuthUser() user: AuthUser): Promise<void> {
    return this.commandBus.execute(
      new UpdateJobPositionCommand({
        id: paramDto.id,
        categoryId: dto.categoryId,
        skillIds: dto.skillIds,
        title: dto.title,
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
      }),
    );
  }

  @ApiOperation({
    summary: 'Get job positions',
    description: 'Get job positions',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: [JobPositionResponseDto],
    path: AppRoutes.JOB_POSITIONS.v1.getMany,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.JOB_POSITIONS.v1.getMany)
  async getMany(@Query() dto: JobPositionsQueryParamsDto, @GetCurrentAuthUser() user: AuthUser): Promise<GetManyJobPositionsResponseDto> {
    return this.queryBus.execute(
      new GetManyJobPositionsQuery({
        _filter: {
          id: dto?._filter?.id,
          title: dto?._filter?.title,
          categoryId: dto?._filter?.categoryId,
          skillIds: dto?._filter?.skillIds,
        },
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
      }),
    );
  }
}
