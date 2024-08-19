import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AuthUser, GetUsersQuery, UpdateUserCommand } from '@app/contexts';
import { ApiJsendResponse, ApiResponseStatusJsendEnum, AppRoutes, GetCurrentAuthUser, IdDto } from '@app/core';
import { ActorType, ConflictErrorResponse, NotFoundErrorResponse, UnauthorizedErrorResponse } from '@libs/common';
import { CommandBus, QueryBus } from '@libs/cqrs';

import { UpdateUserDto, UpdateUserValidationErrorDto, UserQueryParamsDto, UserResponseDto } from './user-dtos';

@ApiTags('Users')
@Controller({
  version: '1',
})
export class UsersControllerV1 {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @ApiOperation({
    summary: 'Get users',
    description: 'Get multiple users',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    type: [UserResponseDto],
    path: AppRoutes.USERS.v1.getUsers,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedErrorResponse,
    path: AppRoutes.USERS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiQuery({
    type: UserQueryParamsDto,
    explode: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get(AppRoutes.USERS.v1.getUsers)
  async getMany(@Query() queryDto: UserQueryParamsDto, @GetCurrentAuthUser() user: AuthUser): Promise<UserResponseDto[]> {
    return this.queryBus.execute(
      new GetUsersQuery({
        queryParams: queryDto,
        actor: {
          id: user.userId,
          type: ActorType.USER,
          source: this.constructor.name,
        },
      }),
    );
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user with profile',
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.OK,
    path: AppRoutes.USERS.v1.update,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.BAD_REQUEST,
    type: UpdateUserValidationErrorDto,
    path: AppRoutes.USERS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.NOT_FOUND,
    type: NotFoundErrorResponse,
    path: AppRoutes.USERS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.CONFLICT,
    type: ConflictErrorResponse,
    path: AppRoutes.USERS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @ApiJsendResponse({
    statusCode: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedErrorResponse,
    path: AppRoutes.USERS.v1.update,
    status: ApiResponseStatusJsendEnum.FAIL,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(AppRoutes.USERS.v1.update)
  async update(@Param() idDto: IdDto, @Body() bodyDto: UpdateUserDto, @GetCurrentAuthUser() user: AuthUser): Promise<void> {
    return this.commandBus.execute(
      new UpdateUserCommand({
        id: idDto.id,
        email: bodyDto.email,
        profile: bodyDto.profile
          ? {
              firstName: bodyDto.profile.firstName,
              lastName: bodyDto.profile.lastName,
              username: bodyDto.profile.username,
              bio: bodyDto.profile.bio,
              gender: bodyDto.profile.gender,
              dateOfBirth: bodyDto.profile.dateOfBirth ? new Date(bodyDto.profile.dateOfBirth) : undefined,
              address: bodyDto.profile.address,
              hobbies: bodyDto.profile.hobbies,
              languages: bodyDto.profile.languages,
              phoneNumber: bodyDto.profile.phoneNumber,
              profilePicture: bodyDto.profile.profilePicture,
              rodoAcceptanceDate: bodyDto.profile.rodoAcceptanceDate ? new Date(bodyDto.profile.rodoAcceptanceDate) : undefined,
            }
          : undefined,
        actor: {
          id: user.userId,
          type: ActorType.USER,
          source: this.constructor.name,
        },
      }),
    );
  }
}
