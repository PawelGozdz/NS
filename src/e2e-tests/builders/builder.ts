import { AuthUserModel, ProfileModel, UserModel } from '@app/contexts/auth';
import { Kysely } from 'kysely';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { AuthUserFixtureFactory, ProfileFixtureFactory, UserFixtureFactory } from '../fixtures';

type IDatabaseDaos = any;

export class UserSeedBuilder {
	public dbConnection: Kysely<IDatabaseDaos>;
	public userDao: UserModel;
	public authUserDao: AuthUserModel;
	public profileDao: ProfileModel;

	daos: {
		userDaoObj: UserModel | undefined;
		authUserDaoObj: AuthUserModel | undefined;
		profileDaoObj: ProfileModel | undefined;
	} = {
		userDaoObj: undefined,
		authUserDaoObj: undefined,
		profileDaoObj: undefined,
	};

	actions: { method: string }[] = [];
	cookies: string[] = [];

	private constructor(dbConnection: Kysely<IDatabaseDaos>) {
		this.dbConnection = dbConnection;
	}

	async build() {
		for await (const action of this.actions) {
			await this[action.method]();
		}

		return this;
	}

	static async create(db?: Kysely<IDatabaseDaos>): Promise<UserSeedBuilder> {
		const builder = new UserSeedBuilder(
			db ||
				new Kysely<IDatabaseDaos>({
					dialect,
					plugins: kyselyPlugins,
				}),
		);

		return builder;
	}

	private async insertUser() {
		if (!this.daos.userDaoObj) {
			throw new Error('UserDao is not defined');
		}

		await this.dbConnection.insertInto(TableNames.USERS).values(this.daos.userDaoObj).execute();
		this.userDao = (await this.dbConnection
			.selectFrom(TableNames.USERS)
			.selectAll()
			.where('id', '=', this.daos.userDaoObj.id)
			.executeTakeFirst()) as UserModel;
	}

	withUser(user?: Partial<UserModel>): this {
		this.daos.userDaoObj = UserFixtureFactory.create({
			...user,
		});

		this.actions.push({ method: 'insertUser' });

		return this;
	}

	private async insertAuthUser(): Promise<this> {
		if (!this.daos.authUserDaoObj) {
			throw new Error('AuthUserDao is not defined');
		}

		await this.dbConnection.insertInto(TableNames.AUTH_USERS).values(this.daos.authUserDaoObj).execute();
		this.authUserDao = (await this.dbConnection
			.selectFrom(TableNames.AUTH_USERS)
			.selectAll()
			.where('userId', '=', this.daos.authUserDaoObj.userId)
			.executeTakeFirst()) as AuthUserModel;

		return this;
	}

	withAuthUser(authUser?: Partial<AuthUserModel>): this {
		if (!this.daos.userDaoObj) {
			throw new Error('UserDao is not defined');
		}

		this.daos.authUserDaoObj = AuthUserFixtureFactory.create({
			userId: this.daos.userDaoObj.id,
			...authUser,
		});

		this.actions.push({ method: 'insertAuthUser' });

		return this;
	}

	private async insertProfile() {
		if (!this.daos.profileDaoObj || !this.daos.userDaoObj) {
			throw new Error('UserDao is not defined');
		}

		await this.dbConnection.insertInto(TableNames.PROFILES).values(this.daos.profileDaoObj).execute();
		this.profileDao = (await this.dbConnection
			.selectFrom(TableNames.PROFILES)
			.selectAll()
			.where('id', '=', this.daos.profileDaoObj.id)
			.executeTakeFirst()) as ProfileModel;
	}

	withProfile(profile?: Partial<ProfileModel>): this {
		this.daos.profileDaoObj = ProfileFixtureFactory.create({
			userId: this.daos.userDaoObj?.id,
			...profile,
		});

		this.actions.push({ method: 'insertProfile' });

		return this;
	}
}
