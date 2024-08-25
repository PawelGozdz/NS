/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';

import { BaseJob, JobManager, JobTypeMapping } from '@libs/common';

import { IsJobEnum } from './is-job.decorator';
import { PgBossProvider } from './pg-boss.provider';

@Injectable()
export class JobManagerService implements OnModuleInit {
  private readonly jobManager: JobManager<JobTypeMapping>;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly pgBoss: PgBossProvider,
    private readonly logger: PinoLogger,
  ) {
    this.jobManager = new JobManager(this.pgBoss.boss);
  }

  async onModuleInit(): Promise<void> {
    const providers = this.discoveryService
      .getProviders()
      .map((provider) => provider?.metatype)
      .filter((provider) => provider)
      .filter((provider) => this.reflector.get(IsJobEnum.IS_JOB, provider))
      .filter((provider) => {
        const isActive = this.reflector.get(IsJobEnum.IS_ACTIVE_JOB, provider) as boolean;

        if (isActive) {
          this.logger.info(`*** Registering job: ${provider.name}`);
        } else {
          this.logger.warn(`*** Skipping job: ${provider.name}`);
        }

        return isActive;
      }) as (new (...args: any[]) => BaseJob<any>)[];

    if (providers.length) {
      this.logger.info(`Registering #${providers.length} job(s)`);

      for (const Provider of providers) {
        const jobInstance = new Provider(this.pgBoss.boss);

        this.jobManager.register(jobInstance);
      }
    } else {
      this.logger.warn('*** No jobs to be registered ***');
    }
    await this.jobManager.start();
    this.logger.info('*** Job manager started ***');
  }

  async stopJobs(): Promise<void> {
    await this.jobManager.stop();
  }
}
