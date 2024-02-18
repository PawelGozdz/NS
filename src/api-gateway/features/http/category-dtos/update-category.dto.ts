import { AppContext, GlobalDto } from '@libs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PickType(GlobalDto, ['name', 'description', 'parentId', 'context']) {
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
	description: string;

	@ApiProperty({
		nullable: true,
		required: false,
	})
	@IsOptional()
	context: AppContext;

	@ApiProperty({
		nullable: true,
		required: false,
	})
	@IsOptional()
	parentId: number;
}
