import { EntityId } from '@libs/common';
import { UserCreatedEvent } from './events';
import { User } from './user.aggregate-root';

const roleId = new EntityId('74497f9b-1d36-4747-b1f5-9f753a74f163');
const email = 'test@test.pl';

describe('User', () => {
	afterEach(() => {
		jest.resetModules();
		jest.restoreAllMocks();
	});

	describe('create', () => {
		describe('Success', () => {
			it('should apply UserCreatedEvent with property values', () => {
				// arrange

				// act
				const user = User.create({
					email,
				});

				// assert
				const events = user.getUncommittedEvents();

				expect(events.length).toEqual(1);
				expect(events[0]).toBeInstanceOf(UserCreatedEvent);

				expect(events[0]).toMatchSnapshot({
					id: expect.any(EntityId),
				});
			});
		});
	});
});
