import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { CreateSkillCommand, CreateSkillHandler, CreateSkillResponseDto, GetManySkillsHandler, GetManySkillsQuery } from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, SkillsQueryParamsDto, ValidationErrorDto } from '@app/core';
import { ConflictErrorResponse } from '@libs/common';

import { CreateSkillDto, SkillResponseDto } from './skill-dtos';

@ApiTags('Skills')
@Controller({
  version: '1',
})
export class SkillsControllerV1 {
  constructor(
    private readonly createHandler: CreateSkillHandler,
    private readonly getManyHandler: GetManySkillsHandler,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @ApiOperation({
    summary: 'Create skill',
    description: 'Create skill with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CREATED,
    type: CreateSkillResponseDto,
    path: AppRoutes.SKILLS.v1.create,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: ValidationErrorDto,
    path: AppRoutes.SKILLS.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.SKILLS.v1.create,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(AppRoutes.SKILLS.v1.create)
  async create(@Body() dto: CreateSkillDto): Promise<CreateSkillResponseDto> {
    return this.createHandler.execute(
      new CreateSkillCommand({
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        context: dto.context,
      }),
    );
  }

  @ApiOperation({
    summary: 'Get skills',
    description: 'Get skills with given options',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: [SkillResponseDto],
    path: AppRoutes.SKILLS.v1.getMany,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.SKILLS.v1.getMany)
  async getMany(@Query() dto: SkillsQueryParamsDto): Promise<SkillResponseDto[]> {
    return this.getManyHandler.execute(
      new GetManySkillsQuery({
        _filter: {
          id: dto?._filter?.id,
          name: dto?._filter?.name,
          context: dto?._filter?.context,
          parentId: dto?._filter?.parentId,
        },
      }),
    );
  }
}
