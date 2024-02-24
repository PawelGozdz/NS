import { ApiProperty } from '@nestjs/swagger';

import { TokensResponseDto } from './tokens-response.dto';

export class SignInResponseDto extends TokensResponseDto {}

export class SignInValidationErrorDto {
	@ApiProperty({
		description: 'A list of validation errors',
		example: ['email must be an email', 'password must be longer than or equal to 8 characters', 'password should not be empty'],
		nullable: false,
	})
	subErrors: string[];

	@ApiProperty({
		description: 'Input validation error',
		example: 'Bad Request Exception',
		nullable: false,
	})
	error: string;
}
