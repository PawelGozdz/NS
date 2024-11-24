import { EntityId } from '@libs/common';

import { Company } from './company.aggregate-root';

export abstract class ICompanyCommandRepository {
  abstract save(user: Company): Promise<void>;

  abstract getOneById(id: EntityId): Promise<Company | undefined>;
}
