import { AuthUser } from '@app/authentication/models';
import { AuthService, CookiesService } from '@app/authentication/services';
import { AuthUsersService } from '@app/authentication/services/auth-users.service';
import { ITokens } from '@app/authentication/types';
import { GetRefreshToken, Public, RefreshTokenGuard, SignInDto, SignUpDto, UnauthorizedError } from '@libs/common';
import { GetCurrentAuthUser } from '@libs/common/decorators/current-auth-user.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Controller({
	path: 'auth',
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

	@Public()
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() bodyDto: SignUpDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.createUser(bodyDto);

		if (!user) {
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signup(user.userId);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}

	@Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() bodyDto: SignInDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.getAuthenticatedUserWithEmailAndPassword(bodyDto.email, bodyDto.password);

		if (!user) {
			this.logger.info(`Integration user not found with email: ${bodyDto.email}`);
			throw new UnauthorizedError();
		}
		const authUser = await this.usersService.getByUserId(user.id);

		if (!authUser) {
			this.logger.info(`Auth user not found for user id: ${user.id}`);
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signin(bodyDto, authUser);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}

	@Post('/logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentAuthUser() user: AuthUser, @Req() req: Request) {
		await this.authService.logout(user.userId);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookieForLogOut());

		return;
	}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	async refreshTokens(@GetCurrentAuthUser() user: AuthUser, @GetRefreshToken() token: string, @Req() req: Request) {
		const tokens = await this.authService.refreshTokens(user, token);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}
}
