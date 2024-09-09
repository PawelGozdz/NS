import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CertificateDto, EducationDto, ExperienceDto, JobUserProfileGlobalDto, SalaryRangeDto } from '@app/core';

export class UpdateJobProfileDto extends PickType(JobUserProfileGlobalDto, [
  'bio',
  'certificates',
  'education',
  'experience',
  'jobIds',
  'jobPositionIds',
  'salaryRange',
]) {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  bio: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  certificates: CertificateDto[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  education: EducationDto[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  experience: ExperienceDto[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  jobIds: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  jobPositionIds: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  salaryRange: SalaryRangeDto;
}
