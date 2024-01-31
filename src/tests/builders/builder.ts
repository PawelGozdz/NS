import { AuthUser, AuthUserDao, UserDao } from '@app/contexts/auth';
import { Kysely } from 'kysely';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { AuthUserFixtureFactory, UserFixtureFactory } from '../fixtures';

type IDatabaseDaos = any;

export class UserSeedBuilder {
	public dbConnection: Kysely<IDatabaseDaos>;
	public userDao: UserDao;
	public authUserDao: AuthUserDao;

	private constructor(dbConnection: Kysely<IDatabaseDaos>) {
		this.dbConnection = dbConnection;
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

	async insertUser(user?: Partial<UserDao>): Promise<this> {
		const userDaoObj = UserFixtureFactory.create({
			...user,
		});
		await this.dbConnection.insertInto(TableNames.USERS).values(userDaoObj).execute();
		this.userDao = (await this.dbConnection.selectFrom(TableNames.USERS).selectAll().where('id', '=', userDaoObj.id).executeTakeFirst()) as UserDao;

		return this;
	}

	async insertAuthUser(authUser?: Partial<AuthUser>): Promise<this> {
		const authUserDaoObj = AuthUserFixtureFactory.create({
			userId: this.userDao.id,
			...authUser,
		});

		await this.dbConnection.insertInto(TableNames.AUTH_USERS).values(authUserDaoObj).execute();
		this.authUserDao = (await this.dbConnection
			.selectFrom(TableNames.AUTH_USERS)
			.selectAll()
			.where('userId', '=', this.userDao.id)
			.executeTakeFirst()) as AuthUserDao;

		return this;
	}
}
