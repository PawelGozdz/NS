import { Address, CountryCode } from '@libs/common';

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
const defaultAddress = Address.create({
	city: 'Warsaw',
	countryCode: CountryCode.England,
	streetNumber: '1',
	postalCode: '00-000',
	street: 'Test',
});
const defaultBio = 'Test bio';
const defaultDateOfBirth = new Date('1990-01-01');
const defaultGender = 'male';
const defaultHobbies = ['test'];
const defaultLanguages = ['en'];
const defaultPhoneNumber = '123456789';
const defaultProfilePicture = 'test';
const defaultRodoAcceptanceDate = new Date('2024-01-01');

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
		// hobbies: defaultHobbies,
		// languages: defaultLanguages,
		phoneNumber: defaultPhoneNumber,
		profilePicture: defaultProfilePicture,
		rodoAcceptanceDate: defaultRodoAcceptanceDate,
	},
};
