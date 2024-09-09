import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AuthUser,
  CreateJobUserProfileCommand,
  CreateJobUserProfileResponseDto,
  GetJobUserProfileByIdQuery,
  GetJobUserProfileByIdQueryResult,
  GetJobUserProfileByUserIdQuery,
  GetJobUserProfileByUserIdQueryResult,
  UpdateJobUserProfileCommand,
} from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, GetCurrentAuthUser, IdDto, ValidationErrorDto } from '@app/core';
import { ActorType, ConflictErrorResponse, NotFoundErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { CreateJobProfileDto, GetJobUserProfileByIdDto, JobUserProfileResponseDto, UpdateJobProfileDto } from './job-profile-dtos';

@ApiTags('Job-profiles')
@Controller({
  version: '1',
})
export class JobUserProfilesControllerV1 {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: 'Create job profile',
    description: 'Create user job profile with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CREATED,
    type: CreateJobProfileDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.create,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.JOB_USER_PROFILES.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(AppRoutes.JOB_USER_PROFILES.v1.create)
  async create(@Body() dto: CreateJobProfileDto, @GetCurrentAuthUser() user: AuthUser): Promise<CreateJobUserProfileResponseDto> {
    return this.commandBus.execute(
      new CreateJobUserProfileCommand({
        bio: dto.bio,
        userId: user.userId,
        certificates: dto.certificates,
        education: dto.education,
        experience: dto.experience,
        jobPositionIds: dto.jobPositionIds,
        salaryRange: dto.salaryRange,
        jobIds: dto.jobIds,
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
    type: CreateJobProfileDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.update,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.JOB_USER_PROFILES.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(AppRoutes.JOB_USER_PROFILES.v1.update)
  async update(@Param() paramDto: IdDto, @Body() dto: UpdateJobProfileDto, @GetCurrentAuthUser() user: AuthUser): Promise<void> {
    return this.commandBus.execute(
      new UpdateJobUserProfileCommand({
        id: paramDto.id,
        bio: dto.bio,
        certificates: dto.certificates,
        education: dto.education,
        experience: dto.experience,
        jobPositionIds: dto.jobPositionIds,
        salaryRange: dto.salaryRange,
        jobIds: dto.jobIds,
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
      }),
    );
  }

  @ApiOperation({
    summary: 'Get user job profile',
    description: 'Get user job profile by user id',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: JobUserProfileResponseDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.getOneByUserId,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.NOT_FOUND,
    type: NotFoundErrorResponse,
    path: AppRoutes.JOB_USER_PROFILES.v1.getOneByUserId,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.JOB_USER_PROFILES.v1.getOneByUserId)
  async getOneByUserId(@Param() dto: GetJobUserProfileByIdDto, @GetCurrentAuthUser() user: AuthUser): Promise<GetJobUserProfileByUserIdQueryResult> {
    return this.queryBus.execute(
      new GetJobUserProfileByUserIdQuery({
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
        userId: dto.id,
      }),
    );
  }

  @ApiOperation({
    summary: 'Get user job profile',
    description: 'Get user job profile by id',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: JobUserProfileResponseDto,
    path: AppRoutes.JOB_USER_PROFILES.v1.getOneById,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.NOT_FOUND,
    type: NotFoundErrorResponse,
    path: AppRoutes.JOB_USER_PROFILES.v1.getOneById,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.JOB_USER_PROFILES.v1.getOneById)
  async getOneById(@Param() dto: GetJobUserProfileByIdDto, @GetCurrentAuthUser() user: AuthUser): Promise<GetJobUserProfileByIdQueryResult> {
    return this.queryBus.execute(
      new GetJobUserProfileByIdQuery({
        actor: {
          id: user.userId,
          type: ActorType.USER,
        },
        id: dto.id,
      }),
    );
  }
}
