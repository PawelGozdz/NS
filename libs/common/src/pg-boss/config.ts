/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable new-cap */
import PgBoss from 'pg-boss';

interface Emittable {
  emit: (...args: any[]) => void;
}

export interface IJob<T extends object> {
  type: string;
  options: PgBoss.SendOptions;
  start: () => Promise<void>;
  work: (job: PgBoss.Job<T>) => Promise<void>;
  emit: (data: T) => Promise<void>;
}

export abstract class BaseJob<T extends object> implements IJob<T> {
  protected boss: PgBoss;

  abstract readonly type: string;

  readonly options: PgBoss.SendOptions = { retryLimit: 3, retryDelay: 1000 };

  constructor(boss: PgBoss) {
    this.boss = boss;
  }

  async start(): Promise<void> {
    await this.boss.work(this.type, this.work);
  }

  abstract work(job: PgBoss.Job<T>): Promise<void>;

  async emit(data: T): Promise<void> {
    await this.boss.send(this.type, data, this.options);
  }
}

export type JobTypeMapping = {
  [key: string]: typeof BaseJob;
};

type EmitParameter<T, K extends keyof T> = T[K] extends Emittable ? Parameters<T[K]['emit']>[0] : never;

export class JobManager<T extends JobTypeMapping> {
  private readonly boss: PgBoss;

  private readonly jobs: Map<keyof T, IJob<any>> = new Map();

  constructor(boss: PgBoss) {
    this.boss = boss;
  }

  register(job: BaseJob<any>): JobManager<T> {
    this.jobs.set(job.type, job);
    return this;
  }

  async start(): Promise<void> {
    await this.boss.start();
    for await (const job of this.jobs.values()) {
      await job.start();
    }
  }

  async stop(): Promise<void> {
    await this.boss.stop({ graceful: true, destroy: true });
  }

  async emit<K extends keyof T>(key: K, data: EmitParameter<T, K>[0]): Promise<void> {
    const job = this.jobs.get(key);
    if (job === undefined) {
      throw new Error(`No job registered with the name ${key?.toString()}`);
    }
    const emitFn: (...args: any[]) => Promise<void> = job.emit.bind(job) as any;
    await emitFn(data);
  }
}
