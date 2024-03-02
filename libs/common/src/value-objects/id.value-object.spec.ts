import { EntityId, InvalidParameterError, MissingValueError } from '@libs/common';
import { catchActError } from '@libs/testing';

describe('Id Value Object', () => {
  it('should create proper id', () => {
    const entityId = EntityId.create('00000000-0000-0000-0000-000000000000');

    expect(entityId.value).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('should throw assertion error if organization number is invalid', () => {
    const wrongId = 'wrong';
    const { error } = catchActError(() => EntityId.create(wrongId));

    expect(error).toBeDefined();
    expect(error).toEqual(InvalidParameterError.withParameter('entity identifier'));
  });

  it('should throw assertion error if organization number is empty', () => {
    const { error } = catchActError(() => EntityId.create(''));

    expect(error).toBeDefined();
    expect(error).toEqual(MissingValueError.withValue('entity identifier'));
  });
});
