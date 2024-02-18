import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsDefined,
	IsEmail,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsNotIn,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsPositive,
	IsString,
	IsUUID,
	IsUrl,
	Length,
	ValidateNested,
} from 'class-validator';

import { AppContext, CountryCode } from '../enums';
import { systemVariables } from '../system-variables';

class AddressDto {
	@ApiProperty({
		example: systemVariables.dtos.address.street.example1,
		nullable: false,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.address.street.MIN_LENGTH, systemVariables.dtos.address.street.MAX_LENGTH)
	street: string;

	@ApiProperty({
		example: systemVariables.dtos.address.streetNumber.example1,
		nullable: false,
		required: false,
	})
	@IsOptional()
	@IsString()
	@Length(systemVariables.dtos.address.streetNumber.MIN_LENGTH, systemVariables.dtos.address.streetNumber.MAX_LENGTH)
	streetNumber: string;

	@ApiProperty({
		example: systemVariables.dtos.address.city.example1,
		nullable: false,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.address.city.MIN_LENGTH, systemVariables.dtos.address.city.MAX_LENGTH)
	city: string;

	@ApiProperty({
		example: systemVariables.dtos.address.countryCode.example1,
		nullable: false,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.address.countryCode.MIN_LENGTH, systemVariables.dtos.address.countryCode.MAX_LENGTH)
	countryCode: CountryCode;

	@ApiProperty({
		example: systemVariables.dtos.address.postalCode.example1,
		nullable: false,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.address.postalCode.MIN_LENGTH, systemVariables.dtos.address.postalCode.MAX_LENGTH)
	postalCode: string;
}

export class GlobalDto {
	// GENERAL
	@ApiProperty({
		example: systemVariables.dtos.uuid.example1,
	})
	@IsDefined()
	@IsUUID()
	id: string;

	// AUTHENTICATION
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

	// AUTHORIZATION
	@ApiProperty({
		example: systemVariables.dtos.uuid.example3,
	})
	@IsDefined()
	@IsUUID()
	roleId: string;

	// USERS
	@ApiProperty({
		example: systemVariables.dtos.email.example,
	})
	@IsDefined()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: systemVariables.dtos.uuid.example2,
	})
	@IsDefined()
	@IsUUID()
	userId: string;

	@ApiProperty({
		example: systemVariables.dtos.firstName.example1,
		minLength: systemVariables.dtos.firstName.MIN_LENGTH,
		maxLength: systemVariables.dtos.firstName.MAX_LENGTH,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.firstName.MIN_LENGTH, systemVariables.dtos.firstName.MAX_LENGTH)
	firstName: string;

	@ApiProperty({
		example: systemVariables.dtos.lastName.example1,
		minLength: systemVariables.dtos.lastName.MIN_LENGTH,
		maxLength: systemVariables.dtos.lastName.MAX_LENGTH,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.lastName.MIN_LENGTH, systemVariables.dtos.lastName.MAX_LENGTH)
	lastName: string;

	@ApiProperty({
		example: systemVariables.dtos.dateOfBirth.example1,
		nullable: true,
	})
	@IsDefined()
	@IsDateString()
	dateOfBirth: string;

	@ApiProperty({
		example: systemVariables.dtos.username.example1,
		minLength: systemVariables.dtos.username.MIN_LENGTH,
		maxLength: systemVariables.dtos.username.MAX_LENGTH,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.username.MIN_LENGTH, systemVariables.dtos.username.MAX_LENGTH)
	username: string;

	@ApiProperty({
		example: systemVariables.dtos.phoneNumber.example1,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@IsPhoneNumber()
	phoneNumber: string;

	@ApiProperty({
		example: systemVariables.dtos.gender.example1,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@IsIn(systemVariables.dtos.gender.AVAILABLE_OPTIONS)
	gender: string;

	@ApiProperty({
		example: systemVariables.dtos.bio.example1,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@Length(systemVariables.dtos.bio.MIN_LENGTH, systemVariables.dtos.bio.MAX_LENGTH)
	bio: string;

	@ApiProperty({
		example: systemVariables.dtos.hobbies.example1,
		nullable: true,
	})
	@IsDefined()
	@IsString({ each: true })
	@Length(systemVariables.dtos.hobbies.MIN_LENGTH, systemVariables.dtos.hobbies.MAX_LENGTH, { each: true })
	hobbies: string[];

	@ApiProperty({
		example: systemVariables.dtos.languages.example1,
		nullable: true,
	})
	@IsDefined()
	@Length(systemVariables.dtos.languages.MIN_LENGTH, systemVariables.dtos.languages.MAX_LENGTH)
	@IsString({ each: true })
	languages: string[];

	@ApiProperty({
		example: systemVariables.dtos.profilePicture.example1,
		nullable: true,
	})
	@IsDefined()
	@IsString()
	@IsUrl()
	profilePicture: string;

	@ApiProperty({
		example: systemVariables.dtos.rodoAcceptanceDate.example1,
		nullable: true,
	})
	@IsDefined()
	@IsDateString()
	rodoAcceptanceDate: string;

	@ApiProperty({
		type: AddressDto,
	})
	@IsDefined()
	@ValidateNested()
	address: AddressDto;

	// CATEGORIES
	@ApiProperty({
		example: systemVariables.dtos.categories.name.example1,
		minLength: systemVariables.dtos.categories.name.MIN_LENGTH,
		maxLength: systemVariables.dtos.categories.name.MAX_LENGTH,
	})
	@IsNotIn([null])
	@IsDefined()
	@Length(systemVariables.dtos.categories.name.MIN_LENGTH, systemVariables.dtos.categories.name.MAX_LENGTH)
	name: string;

	@ApiProperty({
		example: systemVariables.dtos.categories.description.example1,
		minLength: systemVariables.dtos.categories.description.MIN_LENGTH,
		maxLength: systemVariables.dtos.categories.description.MAX_LENGTH,
		nullable: true,
	})
	@IsOptional()
	@Length(systemVariables.dtos.categories.description.MIN_LENGTH, systemVariables.dtos.categories.description.MAX_LENGTH)
	description: string;

	@ApiProperty({
		example: systemVariables.dtos.categories.context.example1,
		enum: systemVariables.dtos.categories.context.AVAILABLE_OPTIONS,
	})
	@IsNotIn([null])
	@IsDefined()
	@IsEnum(AppContext)
	context: AppContext;

	@ApiProperty({
		example: systemVariables.dtos.categories.parentId.example1,
		nullable: true,
	})
	@IsOptional()
	@IsPositive()
	@IsNotIn([null])
	@Length(0, 10000000)
	@IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
	parentId: number;
}
