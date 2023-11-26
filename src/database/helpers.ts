import { snakeCase } from 'objection/lib/utils/identifierMapping';

type KnexHelpers = { onUpdateTrigger: (table: string) => string };

export const helpers: KnexHelpers = {
	onUpdateTrigger: (table) => `
    CREATE TRIGGER ${snakeCase(table)}_updated_at
    BEFORE UPDATE ON ${snakeCase(table)}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `,
};
