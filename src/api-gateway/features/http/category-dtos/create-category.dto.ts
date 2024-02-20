import { CategoryGlobalDto } from '@app/core';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateCategoryDto extends PickType(CategoryGlobalDto, ['name', 'description', 'parentId', 'ctx']) {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	parentId: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	description: string;
}
