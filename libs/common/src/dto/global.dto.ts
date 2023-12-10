import { IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class GlobalDto {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@Length(8, 25)
	password: string;

	@IsDefined()
	@IsUUID()
	roleId: string;
}
