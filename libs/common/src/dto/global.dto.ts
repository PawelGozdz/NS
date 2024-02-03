import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

import { systemVariables } from '../system-variables';

export class GlobalDto {
	@ApiProperty({
		example: systemVariables.dtos.email.example,
	})
	@IsDefined()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: systemVariables.dtos.password.example,
		minLength: systemVariables.dtos.password.MIN_LENGTH,
		maxLength: systemVariables.dtos.password.MAX_LENGTH,
	})
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@Length(systemVariables.dtos.password.MIN_LENGTH, systemVariables.dtos.password.MAX_LENGTH)
	password: string;

	@IsDefined()
	@IsUUID()
	roleId: string;
}
