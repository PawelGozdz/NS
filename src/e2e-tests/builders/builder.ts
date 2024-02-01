import { AuthUserDao, UserDao } from '@app/contexts/auth';
import { Kysely } from 'kysely';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { AuthUserFixtureFactory, UserFixtureFactory } from '../fixtures';

type IDatabaseDaos = any;

export class UserSeedBuilder {
	public dbConnection: Kysely<IDatabaseDaos>;
	public userDao: UserDao;
	public authUserDao: AuthUserDao;

	daos: {
		userDaoObj: UserDao | undefined;
		authUserDaoObj: AuthUserDao | undefined;
	} = {
		userDaoObj: undefined,
		authUserDaoObj: undefined,
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
			.executeTakeFirst()) as UserDao;
	}

	withUser(user?: Partial<UserDao>): this {
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
			.where('userId', '=', this.daos.authUserDaoObj.id)
			.executeTakeFirst()) as AuthUserDao;

		return this;
	}

	withAuthUser(authUser?: Partial<AuthUserDao>): this {
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
}
