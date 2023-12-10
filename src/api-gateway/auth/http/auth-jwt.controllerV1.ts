import { AuthService, CookiesService } from '@app/authentication/services';
import { ITokens } from '@app/authentication/types';
import { Public, SignInDto, SignUpDto, UnauthorizedError } from '@libs/common';
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthJwtControllerV1 {
	constructor(
		private readonly authService: AuthService,
		private readonly cookieService: CookiesService,
	) {}

	@Public()
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() bodyDto: SignUpDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.createUser(bodyDto);

		if (!user) {
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signup(user.id);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}

	@Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() bodyDto: SignInDto, @Req() req: Request): Promise<ITokens> {
		const user = await this.authService.getUserByEmail(bodyDto.email);

		if (!user) {
			throw new UnauthorizedError();
		}

		const tokens: ITokens = await this.authService.signin(bodyDto, user);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}
}
