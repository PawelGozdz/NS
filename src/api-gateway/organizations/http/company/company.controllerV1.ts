/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser, CreateSkillResponseDto } from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, GetCurrentAuthUser, ValidationErrorDto } from '@app/core';
import { ConflictErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { CreateCompanyDto, CreateCompanyResponseDto } from './dtos';

@ApiTags('Companies')
@Controller({
  version: '1',
})
export class CompaniesControllerV1 {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: 'Create a company',
    description: 'Create a company with given options',
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
  @Post(AppRoutes.COMPANIES.v1.create)
  async create(@Body() _dto: CreateCompanyDto, @GetCurrentAuthUser() _user: AuthUser): Promise<CreateCompanyResponseDto> {
    // return this.commandBus.execute(
    //   new CreateCompanyCommand({
    //     name: dto.name,
    //     address: {
    //       city: dto.address.city,
    //       street: dto.address.street,
    //       streetNumber: dto.address.streetNumber,
    //       postalCode: dto.address.postalCode,
    //       countryCode: dto.address.countryCode,
    //     },
    //     phoneNumber: dto.phoneNumber,
    //     email: dto.email,
    //     countryCode: dto.countryCode,
    //     actor: {
    //       id: user.userId,
    //       type: ActorType.USER,
    //     },
    //   }),
    // );
    return {
      id: 'a',
    };
  }

  // @ApiOperation({
  //   summary: 'Get skills',
  //   description: 'Get skills with given options',
  // })
  // @ApiJsendResponse({
  //   statusCode: HttpStatus.OK,
  //   type: [SkillResponseDto],
  //   path: AppRoutes.SKILLS.v1.getMany,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Get(AppRoutes.SKILLS.v1.getMany)
  // async getMany(@Query() dto: SkillsQueryParamsDto, @GetCurrentAuthUser() user: AuthUser): Promise<SkillResponseDto[]> {
  //   return this.queryBus.execute(
  //     new GetManySkillsQuery({
  //       _filter: {
  //         id: dto?._filter?.id,
  //         name: dto?._filter?.name,
  //       },
  //       actor: {
  //         id: user.userId,
  //         type: ActorType.USER,
  //       },
  //     }),
  //   );
  // }
}
