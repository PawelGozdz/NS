export class Category {
	id: number;

	name: string;

	description?: string | null;

	parentId?: number | null;

	ctx: string;

	constructor(props: Category) {
		this.id = props.id;
		this.name = props.name;
		this.description = props.description ?? null;
		this.parentId = props.parentId ?? null;
		this.ctx = props.ctx;
	}

	public static create({
		id,
		name,
		description,
		parentId,
		ctx,
	}: {
		id: number;
		name: string;
		description?: string | null;
		parentId?: number | null;
		ctx: string;
	}): Category {
		const category = new Category({
			id,
			name,
			description: description ?? null,
			parentId: parentId ?? null,
			ctx,
		});

		return category;
	}
}

export type ICategoryCreateData = {
	name: string;
	description?: string | null;
	parentId?: number | null;
	ctx: string;
};

export type ICategoryUpdateData = {
	id: number;
	name?: string;
	description?: string | null;
	ctx?: string;
	parentId?: number | null;
};
