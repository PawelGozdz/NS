import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { IInferredQueryHandler } from '@libs/cqrs';

import { ICategoriesQueryRepository } from '../../domain';
import { GetManyCategoriesQuery, GetManyCategoriesResponseDto } from './get-many-categories.query';

@Injectable()
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

    return entities.map((e) => ({
      id: e.id,
      name: e.name,
      ctx: e.ctx,
      parentId: e.parentId,
      description: e.description,
    }));
  }
}
