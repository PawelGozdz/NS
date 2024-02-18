export class CategoryResponseDto {
	id: number;
	name: string;
	description: string | null;
	context: string;
	parentId: number | null;
}
