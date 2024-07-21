import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

const providers = [];
const queries = [];
const commands = [];
@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [...providers, ...queries, ...commands],
  exports: [...providers],
})
export class JobUserProfilesModule {}

// @workspace ok, now prepare me a class JobUserProfile that extends from AggregateRoot.

// Make sure, that contains those properties:
// - id
// - userId
// - language (value-object) array
// - certification (value-object) array
// - education (value-object) array
// - salary-range (value-object)
// - experience (value-object) array
// - professionalTitle
// - desiredJobType
// - desiredSalaryRange
// - locationPreferences
// - createdAt
// - updatedAt

// Perhaps you might propose another if needed
