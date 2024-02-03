import { AppUtils, InvalidParameterError, MissingValueError } from '@libs/common';
import { isUUID } from 'class-validator';

export class EntityId {
	constructor(readonly value: string) {}

	static createRandom() {
		return new EntityId(AppUtils.getUUID());
	}

	static create(value: string): EntityId {
		if (!value) {
			throw MissingValueError.withValue('entity identifier');
		}

		if (!isUUID(value)) {
			throw InvalidParameterError.withParameter('entity identifier');
		}

		return new EntityId(value);
	}

	equals(entityId: EntityId) {
		return this.value === entityId.value;
	}

	toJSON() {
		return this.value;
	}
}
