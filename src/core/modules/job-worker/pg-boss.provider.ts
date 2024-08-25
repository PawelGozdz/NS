import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import PgBoss from 'pg-boss';

import { dbConfig } from '@app/config/database';

@Injectable()
export class PgBossProvider {
  boss: PgBoss;

  constructor(private readonly logger: PinoLogger) {
    const { user, password, host, port, database, schema } = dbConfig.connection;
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=${schema}`;
    this.boss = new PgBoss(connectionString);

    this.boss.on('error', (error) => this.logger.error(error, 'PgBoss error: '));
  }
}
