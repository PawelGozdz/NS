import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsNumber, IsPositive, Matches, Max, Min } from 'class-validator';

import { systemVariables } from '@libs/common';

import { BasicTextRegexp, GlobalDto } from './global.dto';

export class JobPositionGlobalDto extends PickType(GlobalDto, ['id', 'categoryId', 'slug']) {
  @ApiProperty({
    required: true,
    nullable: false,
    example: systemVariables.dtos.jobs.jobPositions.title.example1,
    minLength: systemVariables.dtos.jobs.jobPositions.title.MIN_LENGTH,
    maxLength: systemVariables.dtos.jobs.jobPositions.title.MAX_LENGTH,
  })
  @IsDefined()
  @Matches(BasicTextRegexp, { message: 'Invalid job position title' })
  title: string;

  @ApiProperty({
    type: [Number],
    example: [systemVariables.dtos.experience.skillId.example1],
    required: false,
    nullable: false,
  })
  @IsDefined()
  @IsArray()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 }, { each: true })
  @IsPositive({ each: true })
  @Min(systemVariables.dtos.experience.skillId.MIN_VALUE, { each: true })
  @Max(systemVariables.dtos.experience.skillId.MAX_VALUE, { each: true })
  skillIds: number[];
}
