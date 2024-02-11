import { AuthService, CookiesService, ITokens } from '@app/contexts/auth';
import { AuthUser, AuthUsersService } from '@app/contexts/auth/';
import { AppRoutes } from '@app/core';
import {
	ApiJsendResponse,
	ApiResponseStatusJsendEnum,
	ConflictErrorResponse,
	GetCurrentAuthUser,
	GetRefreshToken,
	Public,
	RefreshTokenGuard,
	UnauthorizedError,
	UnauthorizedErrorResponse,
} from '@libs/common';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';

import {
	RefreshTokensResponseDto,
	SignInDto,
	SignInResponseDto,
	SignInValidationErrorDto,
	SignUpDto,
	SignUpResponseDto,
	SignUpValidationErrorDto,
} from './auth-dtos';

@ApiTags('Auth')
@Controller({
	version: '1',
})
export class AuthJwtControllerV1 {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: AuthUsersService,
		private readonly cookieService: CookiesService,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	@ApiOperation({
		summary: 'Sign up',
		description: 'Create a new user',
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.CREATED,
		type: SignUpResponseDto,
		path: AppRoutes.AUTH.v1.signup,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.BAD_REQUEST,
		type: SignUpValidationErrorDto,
		path: AppRoutes.AUTH.v1.signup,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.CONFLICT,
		type: ConflictErrorResponse,
		path: AppRoutes.AUTH.v1.signup,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post(AppRoutes.AUTH.v1.signup)
	async signup(@Body() bodyDto: SignUpDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.createUser(bodyDto);

		if (!user) {
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signup(user.userId);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}

	@ApiOperation({
		summary: 'Sign in',
		description: 'Login with email and password',
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.OK,
		type: SignInResponseDto,
		path: AppRoutes.AUTH.v1.signin,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.BAD_REQUEST,
		type: SignInValidationErrorDto,
		path: AppRoutes.AUTH.v1.signin,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.UNAUTHORIZED,
		type: UnauthorizedErrorResponse,
		path: AppRoutes.AUTH.v1.signin,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post(AppRoutes.AUTH.v1.signin)
	async signin(@Body() bodyDto: SignInDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.getAuthenticatedUserWithEmailAndPassword(bodyDto.email, bodyDto.password);

		if (!user) {
			this.logger.info(`Integration user not found with email: ${bodyDto.email}`);
			throw new UnauthorizedError();
		}
		const authUser = await this.usersService.getByUserId(user.userId);

		if (!authUser) {
			this.logger.info(`Auth user not found for user id: ${user.id}`);
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signin(bodyDto, authUser);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}

	@ApiOperation({
		summary: 'Logout',
		description: 'Logging user out',
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.NO_CONTENT,
		path: AppRoutes.AUTH.v1.logout,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.UNAUTHORIZED,
		type: UnauthorizedErrorResponse,
		path: AppRoutes.AUTH.v1.logout,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@ApiBearerAuth()
	@Post(AppRoutes.AUTH.v1.logout)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentAuthUser() user: AuthUser, @Req() req: Request) {
		await this.authService.logout(user.userId);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookieForLogOut());

		return;
	}

	@ApiOperation({
		summary: 'Refresh tokens',
		description: 'Refreshing tokens',
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.OK,
		type: RefreshTokensResponseDto,
		path: AppRoutes.AUTH.v1.refresh,
	})
	@ApiJsendResponse({
		statusCode: HttpStatus.UNAUTHORIZED,
		type: UnauthorizedErrorResponse,
		path: AppRoutes.AUTH.v1.refresh,
		status: ApiResponseStatusJsendEnum.FAIL,
	})
	@ApiBearerAuth()
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	@Post(AppRoutes.AUTH.v1.refresh)
	async refreshTokens(@GetCurrentAuthUser() user: AuthUser, @GetRefreshToken() token: string, @Req() req: Request) {
		const tokens = await this.authService.refreshTokens(user, token);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}
}
