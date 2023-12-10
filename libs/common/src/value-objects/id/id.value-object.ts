import { InvalidParameterError, MissingValueError } from '@libs/common';
import { isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class EntityId {
	constructor(readonly value: string) {}

	static createRandom() {
		return new EntityId(uuidv4());
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
