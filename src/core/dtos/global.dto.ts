import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { systemVariables } from '@libs/common';

import { CountryCode } from '../enums';

export const BasicTextRegexp = /^[a-zA-Z0-9]+(?:[ _-][a-zA-Z0-9]+)*$/;
export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class AddressDto {
  @ApiProperty({
    example: systemVariables.dtos.address.street.example1,
    nullable: false,
  })
  @IsDefined()
  @IsString()
  @Matches(BasicTextRegexp, { message: "$property Don't use special characters" })
  @Length(systemVariables.dtos.address.street.MIN_LENGTH, systemVariables.dtos.address.street.MAX_LENGTH)
  street: string;

  @ApiProperty({
    example: systemVariables.dtos.address.streetNumber.example1,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+(?:[ /][a-zA-Z0-9]+)*$/, { message: "$property Don't use special characters" })
  @Length(systemVariables.dtos.address.streetNumber.MIN_LENGTH, systemVariables.dtos.address.streetNumber.MAX_LENGTH)
  streetNumber?: string;

  @ApiProperty({
    example: systemVariables.dtos.address.city.example1,
    nullable: false,
  })
  @IsDefined()
  @IsString()
  @Matches(BasicTextRegexp, { message: "$property Don't use special characters" })
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

export class CertificateDto {
  @ApiProperty({
    example: systemVariables.dtos.certificate.name.example1,
    minLength: systemVariables.dtos.certificate.name.MIN_LENGTH,
    maxLength: systemVariables.dtos.certificate.name.MAX_LENGTH,
    required: true,
    nullable: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsDefined()
  @Matches(BasicTextRegexp, { message: 'Invalid certificate name' })
  @Length(systemVariables.dtos.certificate.name.MIN_LENGTH, systemVariables.dtos.certificate.name.MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: systemVariables.dtos.certificate.institution.example1,
    minLength: systemVariables.dtos.certificate.institution.MIN_LENGTH,
    maxLength: systemVariables.dtos.certificate.institution.MAX_LENGTH,
    required: true,
    nullable: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsDefined()
  @Matches(BasicTextRegexp, { message: 'Invalid certificate institution' })
  @Length(systemVariables.dtos.certificate.institution.MIN_LENGTH, systemVariables.dtos.certificate.institution.MAX_LENGTH)
  institution: string;

  @ApiProperty({
    example: systemVariables.dtos.certificate.completionUear.example1,
    maximum: systemVariables.dtos.certificate.completionUear.MAX_VALUE,
    minimum: systemVariables.dtos.certificate.completionUear.MIN_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Max(systemVariables.dtos.certificate.completionUear.MAX_VALUE)
  @Min(systemVariables.dtos.certificate.completionUear.MIN_VALUE)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  completionYear: number;
}

export class EducationDto {
  @ApiProperty({
    example: systemVariables.dtos.education.degree.example1,
    minLength: systemVariables.dtos.education.degree.MIN_LENGTH,
    maxLength: systemVariables.dtos.education.degree.MAX_LENGTH,
    required: true,
    nullable: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsDefined()
  @Matches(BasicTextRegexp, { message: 'Invalid degree name' })
  @Length(systemVariables.dtos.education.degree.MIN_LENGTH, systemVariables.dtos.education.degree.MAX_LENGTH)
  degree: string;

  @ApiProperty({
    example: systemVariables.dtos.education.institution.example1,
    minLength: systemVariables.dtos.education.institution.MIN_LENGTH,
    maxLength: systemVariables.dtos.education.institution.MAX_LENGTH,
    required: true,
    nullable: false,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : null))
  @IsDefined()
  @Matches(BasicTextRegexp, { message: 'Invalid education institution' })
  @Length(systemVariables.dtos.education.institution.MIN_LENGTH, systemVariables.dtos.education.institution.MAX_LENGTH)
  institution: string;

  @ApiProperty({
    example: systemVariables.dtos.education.graduateYear.example1,
    maximum: systemVariables.dtos.education.graduateYear.MAX_VALUE,
    minimum: systemVariables.dtos.education.graduateYear.MIN_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Max(systemVariables.dtos.education.graduateYear.MAX_VALUE)
  @Min(systemVariables.dtos.education.graduateYear.MIN_VALUE)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  graduateYear: number;
}

export class SkillIdDto {
  @ApiProperty({
    example: systemVariables.dtos.experience.skillId.example1,
    minLength: systemVariables.dtos.experience.skillId.MIN_VALUE,
    maxLength: systemVariables.dtos.experience.skillId.MAX_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  @Min(systemVariables.dtos.experience.skillId.MIN_VALUE)
  @Max(systemVariables.dtos.experience.skillId.MAX_VALUE)
  skillId: number;
}

export class CategoryIdDto {
  @ApiProperty({
    example: systemVariables.dtos.categories.id.example1,
    minLength: systemVariables.dtos.categories.id.MIN_VALUE,
    maxLength: systemVariables.dtos.categories.id.MAX_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  @Min(systemVariables.dtos.categories.id.MIN_VALUE)
  @Max(systemVariables.dtos.categories.id.MAX_VALUE)
  categoryId: number;
}

export class ExperienceDto extends SkillIdDto {
  @ApiProperty({
    example: systemVariables.dtos.experience.startDate.example1,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @IsISO8601()
  startDate: Date;

  @ApiProperty({
    example: systemVariables.dtos.experience.endDate.example1,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @IsISO8601()
  endDate: Date;

  @ApiProperty({
    example: systemVariables.dtos.experience.endDate.example1,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  @Min(systemVariables.dtos.experience.experienceInMonths.MIN_VALUE)
  @Max(systemVariables.dtos.experience.experienceInMonths.MAX_VALUE)
  experienceInMonths: number;
}

export class SalaryRangeDto {
  @ApiProperty({
    example: systemVariables.dtos.salaryRange.from.example1,
    minLength: systemVariables.dtos.salaryRange.from.MIN_VALUE,
    maxLength: systemVariables.dtos.salaryRange.from.MAX_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  @Min(systemVariables.dtos.salaryRange.from.MIN_VALUE)
  @Max(systemVariables.dtos.salaryRange.from.MAX_VALUE)
  from: number;

  @ApiProperty({
    example: systemVariables.dtos.salaryRange.to.example1,
    minLength: systemVariables.dtos.salaryRange.to.MIN_VALUE,
    maxLength: systemVariables.dtos.salaryRange.to.MAX_VALUE,
    required: true,
    nullable: false,
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  @Min(systemVariables.dtos.salaryRange.to.MIN_VALUE)
  @Max(systemVariables.dtos.salaryRange.to.MAX_VALUE)
  to: number;
}

export class GlobalDto extends IntersectionType(SkillIdDto, CategoryIdDto) {
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
  @IsNumberString()
  phoneNumber: string;

  @ApiProperty({
    example: CountryCode.England,
    nullable: true,
  })
  @IsDefined()
  @IsEnum(CountryCode)
  countryCode: CountryCode;

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
  bio: string | null;

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
  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;

  @ApiProperty({
    type: [CertificateDto],
  })
  @IsDefined()
  @Type(() => CertificateDto)
  @ValidateNested({ each: true })
  certificates: CertificateDto[];

  @ApiProperty({
    type: [EducationDto],
  })
  @IsDefined()
  @Type(() => EducationDto)
  @ValidateNested({ each: true })
  education: EducationDto[];

  @ApiProperty({
    type: [ExperienceDto],
  })
  @IsDefined()
  @Type(() => ExperienceDto)
  @ValidateNested({ each: true })
  experience: ExperienceDto[];

  @ApiProperty({
    type: SalaryRangeDto,
  })
  @IsDefined()
  @Type(() => SalaryRangeDto)
  @ValidateNested()
  salaryRange: SalaryRangeDto;

  @ApiProperty({
    example: systemVariables.dtos.slug.example1,
  })
  @IsDefined()
  @Matches(slugRegex, { message: 'Invalid slug' })
  slug: string;
}
