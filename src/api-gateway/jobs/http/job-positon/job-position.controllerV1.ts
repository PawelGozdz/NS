import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser, CreateJobPositionCommand, CreateJobPositionResponseDto } from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, GetCurrentAuthUser, ValidationErrorDto } from '@app/core';
import { ActorType, ConflictErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { CreateJobPositionDto } from './job-position-dtos';

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

  // @ApiOperation({
  //   summary: 'Update job profile',
  //   description: 'Update user job profile with given options',
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.OK,
  //   type: CreateJobPositionDto,
  //   path: AppRoutes.JOB_POSITIONS.v1.update,
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.BAD_REQUEST,
  //   type: ValidationErrorDto,
  //   path: AppRoutes.JOB_POSITIONS.v1.update,
  //   status: ApiResponseStatusJsendEnum.FAIL,
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.CONFLICT,
  //   type: ConflictErrorResponse,
  //   path: AppRoutes.JOB_POSITIONS.v1.update,
  //   status: ApiResponseStatusJsendEnum.FAIL,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Patch(AppRoutes.JOB_POSITIONS.v1.update)
  // async update(@Param() paramDto: IdDto, @Body() dto: UpdateJobPositionDto, @GetCurrentAuthUser() user: AuthUser): Promise<void> {
  //   return this.commandBus.execute(
  //     new UpdateJobPositionCommand({
  //       id: paramDto.id,
  //       bio: dto.bio,
  //       certificates: dto.certificates,
  //       education: dto.education,
  //       experience: dto.experience,
  //       jobPositionIds: dto.jobPositionIds,
  //       salaryRange: dto.salaryRange,
  //       jobIds: dto.jobIds,
  //       actor: {
  //         id: user.userId,
  //         type: ActorType.USER,
  //       },
  //     }),
  //   );
  // }

  // @ApiOperation({
  //   summary: 'Get user job profile',
  //   description: 'Get user job profile by id',
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.OK,
  //   type: JobPositionResponseDto,
  //   path: AppRoutes.JOB_POSITIONS.v1.getOneById,
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.NOT_FOUND,
  //   type: NotFoundErrorResponse,
  //   path: AppRoutes.JOB_POSITIONS.v1.getOneById,
  //   status: ApiResponseStatusJsendEnum.FAIL,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Get(AppRoutes.JOB_POSITIONS.v1.getOneById)
  // async getOneById(@Param() dto: GetJobPositionByIdDto, @GetCurrentAuthUser() user: AuthUser): Promise<GetJobPositionByIdQueryResult> {
  //   return this.queryBus.execute(
  //     new GetJobPositionByIdQuery({
  //       actor: {
  //         id: user.userId,
  //         type: ActorType.USER,
  //       },
  //       id: dto.id,
  //     }),
  //   );
  // }
}
