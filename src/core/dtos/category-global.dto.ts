import { systemVariables } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAlphanumeric, IsDefined, IsNotIn, IsNumber, IsOptional, IsPositive, Length, Max, Min } from 'class-validator';

export class CategoryGlobalDto {
	@ApiProperty({
		example: systemVariables.dtos.categories.parentId.example1,
	})
	@Type(() => Number)
	@Min(1)
	@Max(10000)
	@IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
	id: number;

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
	description: string | null;

	@ApiProperty({
		example: systemVariables.dtos.categories.context.example1,
		examples: systemVariables.dtos.categories.context.AVAILABLE_OPTIONS,
	})
	@IsNotIn([null])
	@IsDefined()
	@IsAlphanumeric()
	ctx: string;

	@ApiProperty({
		example: systemVariables.dtos.categories.parentId.example1,
		nullable: true,
	})
	@IsPositive()
	@Type(() => Number)
	@Min(systemVariables.dtos.categories.parentId.MIN_VALUE)
	@Max(systemVariables.dtos.categories.parentId.MAX_VALUE)
	@IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
	parentId: number | null;
}
