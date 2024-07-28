import { PinoLogger } from 'nestjs-pino';

import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';

import { ISkillsQueryRepository } from '../../domain';
import { GetManySkillsQuery, GetManySkillsResponseDto } from './get-many-skills.query';

@QueryHandler(GetManySkillsQuery)
export class GetManySkillsHandler implements IInferredQueryHandler<GetManySkillsQuery> {
  constructor(
    private readonly skillQueryRepository: ISkillsQueryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetManySkillsQuery): Promise<GetManySkillsResponseDto> {
    this.logger.info(query, 'Getting Skills:');

    const entities = await this.skillQueryRepository.getManyBy(query);

    return entities.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      categoryId: e.categoryId,
    }));
  }
}
