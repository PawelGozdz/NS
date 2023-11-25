// eslint-disable-next-line no-restricted-imports
import { Model } from 'objection';

const SORTING_COLUMN = 'id';

export class BaseModel extends Model {
	// static query<M extends Model>(
	//   this: Constructor<M> & { tableName: string },
	//   trxOrKnex?: TransactionOrKnex,
	// ): QueryBuilderType<M> {
	//   const metadata = super.tableMetadata({ table: this.tableName });
	//   if (metadata && metadata.columns.includes(SORTING_COLUMN)) {
	//     const orderByQuery = `${this.tableName}.${SORTING_COLUMN}`;
	//     return super.query(trxOrKnex).orderBy(orderByQuery, 'ASC') as QueryBuilderType<M>;
	//   }
	//   return super.query(trxOrKnex) as QueryBuilderType<M>;
	// }
}
