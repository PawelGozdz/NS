import { PinoLogger } from 'nestjs-pino';

import { Actor } from '@app/core';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';

import { ICategoriesQueryRepository } from '../../domain';
import { GetManyCategoriesQuery, GetManyCategoriesResponseDto } from './get-many-categories.query';

@QueryHandler(GetManyCategoriesQuery)
export class GetManyCategoriesHandler implements IInferredQueryHandler<GetManyCategoriesQuery> {
  constructor(
    private readonly categoryQueryRepository: ICategoriesQueryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetManyCategoriesQuery): Promise<GetManyCategoriesResponseDto> {
    this.logger.info(query, 'Getting categories:');

    const entities = await this.categoryQueryRepository.getManyBy(query);

    Actor.create(query.actor.type, this.constructor.name, query.actor.id);

    return entities.map((e) => ({
      id: e.id,
      name: e.name,
      parentId: e.parentId,
      description: e.description,
    }));
  }
}
