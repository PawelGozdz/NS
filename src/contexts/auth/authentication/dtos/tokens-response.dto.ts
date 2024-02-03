import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
	@ApiProperty({
		description: 'The access token',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkOWUzY2YwLTEyZDEtNDZmMC1iZGI3LTAxNmUxNDkzNzFlNCIsImlhdCI6MTcwNjk2NjExNywiZXhwIjoxNzA2OTY2MjM3fQ.BeC0isQFBuXxLVzdoxx6n98aQ4o_ch23gBsT3yu1XUE',
	})
	access_token: string;

	@ApiProperty({
		description: 'The access token',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkOWUzY2YwLTEyZDEtNDZmMC1iZGI3LTAxNmUxNDkzNzFlNCIsImlhdCI6MTcwNjk2NjExNywiZXhwIjoxNzA2OTY3MDE3fQ.E36bApJKM6ppIsBq4zhsltT6HbJiCtsLMWFjgpIGXwY',
	})
	refresh_token: string;
}
