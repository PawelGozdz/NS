import { PinoLogger } from 'nestjs-pino';

import { Actor } from '@app/core';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';

import { IJobPositionQueryRepository } from '../../domain';
import { GetManyJobPositionsQuery, GetManyJobPositionsResponseDto } from './get-many-job-positions.query';

@QueryHandler(GetManyJobPositionsQuery)
export class GetManyJobPositionsHandler implements IInferredQueryHandler<GetManyJobPositionsQuery> {
  constructor(
    private readonly queryRepository: IJobPositionQueryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetManyJobPositionsQuery): Promise<GetManyJobPositionsResponseDto> {
    this.logger.info(query, 'Getting Job positions:');

    Actor.create(query.actor.type, this.constructor.name, query.actor.id);

    const entities = await this.queryRepository.getManyBy(query);

    return entities.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      categoryId: e.categoryId,
      skillIds: e.skillIds,
    }));
  }
}
