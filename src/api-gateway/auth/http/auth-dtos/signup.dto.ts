import { GlobalDto } from '@libs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { TokensResponseDto } from './tokens-response.dto';

export class SignUpDto extends PickType(GlobalDto, ['email', 'password']) {}

export class SignUpResponseDto extends TokensResponseDto {}

export class SignUpValidationErrorDto {
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
