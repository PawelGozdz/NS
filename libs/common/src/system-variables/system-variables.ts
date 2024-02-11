export const systemVariables = {
	dtos: {
		password: {
			MIN_LENGTH: 8,
			MAX_LENGTH: 25,
			example: 'Password123',
		},
		email: {
			example: 'test@test.com',
		},
		uuid: {
			example1: 'a6185a9f-8873-4f1b-b630-3729318bc600',
			example2: 'a6185a9f-8873-4f1b-b630-3729318bc111',
			example3: 'a6185a9f-8873-4f1b-b630-3729318bc999',
		},
		firstName: {
			MIN_LENGTH: 2,
			MAX_LENGTH: 15,
			example1: 'John',
		},
		lastName: {
			MIN_LENGTH: 2,
			MAX_LENGTH: 15,
			example1: 'Doe',
		},
		dateOfBirth: {
			example1: '1990-01-01',
		},
		username: {
			MIN_LENGTH: 2,
			MAX_LENGTH: 15,
			example1: 'john_doe',
		},
		phoneNumber: {
			example1: '+48500500500',
		},
		gender: {
			AVAILABLE_OPTIONS: ['male', 'female'],
			example1: 'male',
			example2: 'female',
		},
		bio: {
			MIN_LENGTH: 2,
			MAX_LENGTH: 300,
			example1: 'I am a software developer',
		},
		hobbies: {
			MIN_LENGTH: 2,
			MAX_LENGTH: 50,
			example1: ['football', 'mma'],
		},
		languages: {
			MIN_LENGTH: 1,
			MAX_LENGTH: 3,
			example1: ['en', 'pl'],
		},
		profilePicture: {
			example1: 'https://www.google.com/my-profile-picture.jpg',
		},
		rodoAcceptanceDate: {
			example1: '2021-01-01',
		},
		address: {
			street: {
				MIN_LENGTH: 2,
				MAX_LENGTH: 60,
				example1: 'Main Street',
			},
			streetNumber: {
				MIN_LENGTH: 0,
				MAX_LENGTH: 60,
				example1: '123',
			},
			city: {
				MIN_LENGTH: 2,
				MAX_LENGTH: 60,
				example1: 'New York',
			},
			countryCode: {
				MIN_LENGTH: 2,
				MAX_LENGTH: 3,
				example1: 'US',
			},
			postalCode: {
				MIN_LENGTH: 2,
				MAX_LENGTH: 60,
				example1: '10001',
			},
		},
	},
};
