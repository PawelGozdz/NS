import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsUUID, ValidateNested } from 'class-validator';

import { systemVariables } from '@libs/common';

import { CertificateDto, GlobalDto } from './global.dto';

export class JobUserProfileGlobalDto extends PickType(GlobalDto, ['id', 'bio', 'userId', 'education', 'experience', 'salaryRange']) {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  bio: string | null;

  @ApiProperty({
    type: [CertificateDto],
  })
  @IsDefined()
  @ValidateNested({ each: true })
  certificates: CertificateDto[];

  @ApiProperty({
    example: [systemVariables.dtos.uuid.example3],
    nullable: false,
    required: true,
  })
  @IsUUID('all', { each: true })
  @IsDefined()
  jobPositionIds: string[];

  @ApiProperty({
    example: [systemVariables.dtos.uuid.example2],
    nullable: false,
    required: true,
  })
  @IsUUID('all', { each: true })
  @IsDefined()
  jobIds: string[];
}
