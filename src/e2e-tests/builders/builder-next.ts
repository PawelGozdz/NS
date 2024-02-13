import { Database } from '@app/database';
import { IDatabaseModels } from '@libs/common';
import { Transaction, sql } from 'kysely';

interface RelationConfig {
	foreignKey: string;
	primaryKey: string;
	parentEntity: string;
}

interface SeederConfig {
	table: string;
	data: (parent: any, index: number) => Record<string, any>;
	quantity?: number;
	return?: string[] | ((parent: any) => string[]);
	order?: number;
	relations?: { config: SeederConfig; relation: RelationConfig }[];
}

export class DataSeeder {
	constructor(private db: Database) {}

	async seed(configs: SeederConfig[]): Promise<void> {
		configs.sort((a, b) => (a.order || 0) - (b.order || 0));
		for (const config of configs) {
			await this.db.transaction().execute(async (transaction) => {
				await this.seedRecursive(config, transaction);
			});
		}
	}

	private async seedRecursive(config: SeederConfig, transaction: Transaction<IDatabaseModels>, parent?: any, index?: number) {
		console.log('PAREMT', await parent, config);
		const data = Array(config.quantity || 1)
			.fill(0)
			.map((_, i) => (config.data as (parent: any, index: number) => Record<string, any>)(parent, i));

		const returnFields = typeof config.return === 'function' ? config.return(parent) : config.return;

		if (parent) {
			// w childernie data jes toromisem i nie filtruje indeined
			console.log('DATA', data);
		}

		const filteredData = await Promise.all(this.filterUndefinedProperties(data));
		console.log('FILTERED DATA', filteredData);

		const inserted = await transaction
			.insertInto(config.table as keyof IDatabaseModels)
			.values(filteredData as any)
			.returning(returnFields as any)
			.execute();

		console.log('INSERT', inserted);
		console.log('CONFIG RLEATIOSN____________________________', config.relations);
		if (config.relations) {
			for (const { config: relationConfig, relation } of config.relations) {
				if (relation.parentEntity !== config.table) {
					throw new Error(`Invalid relation: ${relation.parentEntity} is not the parent of ${relationConfig.table}`);
				}
				if ((relationConfig.order || 0) <= (config.order || 0)) {
					throw new Error(
						`Invalid order: The order of ${relationConfig.table} cannot be less than or equal to the order of its parent ${config.table}`,
					);
				}
				for (let i = 0; i < inserted.length; i++) {
					// { id: 'a6185a9f-8873-4f1b-b630-3729318bc636', email: 'abc@co' }
					const buildParent = inserted[i];
					// AuthUser dao
					let relationData = relationConfig.data(buildParent, i);
					// console.log('RELATIOAN DATA', relationData);

					relationData[relation.foreignKey] = buildParent[relation.primaryKey];
					// console.log('REL DATA', relationData);
					// relationConfig.data = relationData;
					if (parent) {
						console.log(relationConfig, buildParent, i);
					}
					await this.seedRecursive(relationConfig, transaction, buildParent, i);
				}
			}
		}
		// console.log('INESRE', inserted);

		return inserted;
	}

	async rollback(configs: SeederConfig[]): Promise<void> {
		configs.sort((a, b) => (b.order || 0) - (a.order || 0));
		for (const config of configs) {
			await this.db.transaction().execute(async (transaction) => {
				await this.rollbackRecursive(config, transaction);
			});
		}
	}

	private async rollbackRecursive(config: SeederConfig, transaction: Transaction<IDatabaseModels>): Promise<void> {
		if (config.relations) {
			for (const { config: relationConfig } of config.relations) {
				await this.rollbackRecursive(relationConfig, transaction);
			}
		}

		await sql`DELETE FRIM ${config.table}`.execute(transaction);
	}

	private filterUndefinedProperties(array: Record<string, any>[]) {
		return array.map((obj) => {
			const filteredObj = {};
			Object.entries(obj).forEach(([key, value]) => {
				if (value !== undefined) {
					filteredObj[key] = value;
				}
			});
			return filteredObj;
		});
	}
}
