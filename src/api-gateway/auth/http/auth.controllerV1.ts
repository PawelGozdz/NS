import { AuthService, CookiesService } from '@app/authentication/services';
import { GetCurrentUser, GetRefreshToken, IUser, Public, RefreshTokenGuard } from '@libs/common';
import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

@Controller({
	path: 'auth',
	version: '1',
})
export class AuthControllerV1 {
	constructor(
		private readonly authService: AuthService,
		private readonly cookieService: CookiesService,
	) {}

	@Post('/logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentUser() user: IUser, @Req() req: Request) {
		await this.authService.logout(user.id);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookieForLogOut());

		return;
	}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	async refreshTokens(@GetCurrentUser() user: IUser, @GetRefreshToken() token: string, @Req() req: Request) {
		const tokens = await this.authService.refreshTokens(user, token);

		req.res!.setHeader('Set-Cookie', this.cookieService.getCookies(tokens));

		return tokens;
	}
}
