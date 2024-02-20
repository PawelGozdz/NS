import { CategoryGlobalDto } from '@app/core';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PickType(CategoryGlobalDto, ['name', 'description', 'parentId', 'ctx']) {
	@ApiProperty({
		nullable: false,
		required: false,
	})
	@IsOptional()
	name: string;

	@ApiProperty({
		nullable: true,
		required: false,
	})
	@IsOptional()
	description: string | null;

	@ApiProperty({
		nullable: true,
		required: false,
	})
	@IsOptional()
	ctx: string;

	@ApiProperty({
		nullable: true,
		required: false,
	})
	@IsOptional()
	parentId: number | null;
}

export class UpdateCategoryParamDto extends PickType(CategoryGlobalDto, ['id']) {}
