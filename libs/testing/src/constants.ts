const defaultSecret: string = 'secret';
const defaultRefreshSecret: string = 'refreshSecret';
const defaultUserId = 'a6185a9f-8873-4f1b-b630-3729318bc636';
const defaultEmail = 'test@test.com';
const defaultArgoHash = '$argon2id$v=19$m=65536,t=6,p=4$RmxoqYIZ22sKbn/GLB0gTA$0mUiaHMKEsA3OH2OoyndMkvQwyYAZ+Hqc+RUYq7IwJ0';
const defaultArgoRefreshedRt = '$argon2id$v=19$m=65536,t=6,p=4$wj5QB9gumhpE2v7Fd81lig$9W9Max8KnC1JIVo8w6c+AIZapZ5MO38Pgd4Q4bOaQU4';
const defaultUserPassword = 'Test1234';
const defaultUserFirstName = 'John';
const defaultUserLastName = 'Doe';
const defaultUsername = 'JohnDoe';
const defaultAddress = {
  city: 'Warsaw',
  countryCode: 'PL',
  streetNumber: '1',
  postalCode: '00-000',
  street: 'Test',
};
const defaultBio = 'Test bio';
const defaultDateOfBirth = new Date('1990-01-01');
const defaultGender = 'male';
const defaultHobbies = ['test'];
const defaultLanguages = ['en'];
const defaultPhoneNumber = '123456789';
const defaultProfilePicture = 'test';
const defaultRodoAcceptanceDate = new Date('2024-01-01');

// Category
const defaultCategoryName = 'Test category';
const defaultCategoryDescription = 'Test description';

// Skill
const defaultSkillName = 'Test skill';
const defaultSkillDescription = 'Test description';

// Job
const defaultJobTitle = 'Test job';
const defaultJobIsActive = false;
const defaultJobDescription = 'Test description';
const defaultJobOrganizationId = 'a6185a9f-8873-4f1b-b630-3729318bc111';
const defaultJobPositionId = 'a6185a9f-8873-4f1b-b630-3729318bc636';
const defaultJobLocation = 'Test location';
const defaultJobCategoryIds = [1];
const defaultJobSalaryRange = {
  from: 1000,
  to: 2000,
};
const defaultJobRequiredSkills = [
  {
    skillId: 1,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-11-01'),
    experienceInMonths: 6,
  },
];
const defaulNiceToHaveSkills = [
  {
    skillId: 1,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-11-01'),
    experienceInMonths: 6,
  },
];
const defaultJobRequirements = ['Test requirements'];
const defaultJobLanguages = ['en'];
const defaultJobBenefits = ['Test benefits'];
const defaultJobStartDate = new Date('2025-01-01');
const defaultJobEndDate = new Date('2025-11-01');
const defaultJobPublicationDate = new Date('2025-01-01');
const defaultJobExpireDate = new Date('2025-11-01');
const defaultJobContact = '999 999 999';

// JobUserProfile
const defaultJobUserProfileUserId = 'a6185a9f-8873-4f1b-b630-3729318bc622';
const defaultJobUserProfileBio = 'Test bio';
const defaultJobUserProfileCertificates = [
  {
    name: 'Test certificate',
    institution: 'Test institution',
    completionYear: 2025,
  },
];
const defaultJobUserProfileEducation = [
  {
    degree: 'Test degree',
    institution: 'Test institution',
    graduateYear: 2025,
  },
];
const defaultJobUserProfileExperience = [
  {
    id: 'a6185a9f-8873-4f1b-b630-3729318bc622',
    experienceInMonths: 6,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-11-01'),
  },
];
const defaultJobUserProfileJobPositions = ['a6185a9f-8873-4f1b-b630-3729318bc611'];
const defaultJobUserProfileJobs = ['a6185a9f-8873-4f1b-b630-3729318bc611'];
const defaultJobUserProfileSalaryRange = {
  from: 1000,
  to: 2000,
};

// JobPosition
const defaultJobPositionTitle = 'Test job position';
const defaultJobPositionCategoryId = 1;
const defaultJobPositionSkillIds = [1];

// Context
const defaultCtx = 'categories';

export const testingDefaults = {
  userId: defaultUserId,
  refreshSecret: defaultRefreshSecret,
  secret: defaultSecret,
  email: defaultEmail,
  hash: defaultArgoHash,
  userPassword: defaultUserPassword,
  hashedRt: defaultArgoRefreshedRt,
  profile: {
    firstName: defaultUserFirstName,
    lastName: defaultUserLastName,
    username: defaultUsername,
    address: defaultAddress,
    bio: defaultBio,
    dateOfBirth: defaultDateOfBirth,
    gender: defaultGender,
    hobbies: defaultHobbies,
    languages: defaultLanguages,
    phoneNumber: defaultPhoneNumber,
    profilePicture: defaultProfilePicture,
    rodoAcceptanceDate: defaultRodoAcceptanceDate,
  },
  category: {
    name: defaultCategoryName,
    description: defaultCategoryDescription,
    context: defaultCtx,
  },
  skill: {
    name: defaultSkillName,
    description: defaultSkillDescription,
    context: 'skills',
    categoryId: 1,
  },
  job: {
    title: defaultJobTitle,
    isActive: defaultJobIsActive,
    description: defaultJobDescription,
    organizationId: defaultJobOrganizationId,
    jobPositionId: defaultJobPositionId,
    positionId: defaultJobPositionId,
    location: defaultJobLocation,
    categoryIds: defaultJobCategoryIds,
    salaryRange: defaultJobSalaryRange,
    requiredSkills: defaultJobRequiredSkills,
    niceToHaveSkills: defaulNiceToHaveSkills,
    requirements: defaultJobRequirements,
    languages: defaultJobLanguages,
    benefits: defaultJobBenefits,
    startDate: defaultJobStartDate,
    endDate: defaultJobEndDate,
    publicationDate: defaultJobPublicationDate,
    expireDate: defaultJobExpireDate,
    contact: defaultJobContact,
  },
  jobUserProfile: {
    userId: defaultJobUserProfileUserId,
    bio: defaultJobUserProfileBio,
    certificates: defaultJobUserProfileCertificates,
    education: defaultJobUserProfileEducation,
    experience: defaultJobUserProfileExperience,
    jobPositionIds: defaultJobUserProfileJobPositions,
    jobIds: defaultJobUserProfileJobs,
    salaryRange: defaultJobUserProfileSalaryRange,
  },
  jobPosition: {
    title: defaultJobPositionTitle,
    categoryId: defaultJobPositionCategoryId,
    skillIds: defaultJobPositionSkillIds,
  },
};
