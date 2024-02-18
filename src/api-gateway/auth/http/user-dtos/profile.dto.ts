import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

export class ProfileDto extends PickType(GlobalDto, [
	'id',
	'userId',
	'firstName',
	'lastName',
	'dateOfBirth',
	'username',
	'phoneNumber',
	'address',
	'gender',
	'bio',
	'hobbies',
	'languages',
	'profilePicture',
	'rodoAcceptanceDate',
]) {}
