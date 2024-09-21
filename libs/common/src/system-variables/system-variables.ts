export const systemVariables = {
  dtos: {
    categories: {
      id: {
        example1: 12,
        MAX_VALUE: 10000000,
        MIN_VALUE: 1,
      },
      name: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 30,
        example1: 'Grocery',
      },
      context: {
        AVAILABLE_OPTIONS: ['categories', 'tags'],
        example1: 'categories',
      },
      parentId: {
        MIN_VALUE: 1,
        MAX_VALUE: 10000000000000000000,
        example1: 1,
      },
      description: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 60,
        example1: 'This is a grocery category',
      },
    },
    jobs: {
      jobs: {},
      jobPositions: {
        title: {
          MIN_LENGTH: 2,
          MAX_LENGTH: 50,
          example1: 'Software Developer',
        },
      },
    },
    slug: {
      example1: 'software-developer',
    },
    password: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 25,
      example: 'Password123',
    },
    email: {
      example: 'test@test.com',
    },
    certificate: {
      name: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
        example1: 'CCNA',
      },
      institution: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        example1: 'Evil Corp',
      },
      completionUear: {
        MIN_VALUE: 1900,
        MAX_VALUE: 2100,
        example1: 2021,
      },
    },
    education: {
      degree: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
        example1: 'Computer Science',
      },
      institution: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        example1: 'MIT',
      },
      graduateYear: {
        MIN_VALUE: 1900,
        MAX_VALUE: 2100,
        example1: 2021,
      },
    },
    experience: {
      skillId: {
        MIN_VALUE: 1,
        MAX_VALUE: 10000000000000000000,
        example1: 1,
      },
      startDate: {
        example1: '2021-01-01',
      },
      endDate: {
        example1: '2021-02-01',
      },
      experienceInMonths: {
        MIN_VALUE: 1,
        MAX_VALUE: 1000,
        example1: 12,
      },
    },
    salaryRange: {
      from: {
        MIN_VALUE: 1,
        MAX_VALUE: 1000000,
        example1: 1000,
      },
      to: {
        MIN_VALUE: 1,
        MAX_VALUE: 1000000,
        example1: 2000,
      },
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
