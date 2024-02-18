export type CategorySnapshot = {
	id: number;
	name: string;
	description: string | null;
	parentId: number | null;
	context: string;
	version: number;
};
