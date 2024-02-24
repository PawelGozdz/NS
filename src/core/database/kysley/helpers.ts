import { TableNames } from '../table-names';

export const onUpdateTrigger = (table: TableNames) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`;
