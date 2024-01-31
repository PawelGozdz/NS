const defaultSecret: string = 'secret';
const defaultRefreshSecret: string = 'refreshSecret';
const defaultUserId = 'a6185a9f-8873-4f1b-b630-3729318bc636';
const defaultEmail = 'test@test.com';
const defaultArgoHash = '$argon2id$v=19$m=65536,t=6,p=4$RmxoqYIZ22sKbn/GLB0gTA$0mUiaHMKEsA3OH2OoyndMkvQwyYAZ+Hqc+RUYq7IwJ0';
const defaultUserPassword = 'Test1234';

export const testingDefaults = {
	userId: defaultUserId,
	refreshSecret: defaultRefreshSecret,
	secret: defaultSecret,
	email: defaultEmail,
	hash: defaultArgoHash,
	userPassword: defaultUserPassword,
};
