import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    redisClient: Redis.Redis;
    constructor(private url: string) {}

    onModuleInit(): any {
        if (!this.redisClient) {
            this.redisClient = new Redis(this.url, {
                keyPrefix: "bank_redis_",
                retryStrategy(times: number): number {
                    return Math.min(2000, times * 50);
                },
            });
        }
    }

    onModuleDestroy(): any {
        return this.redisClient.disconnect();
    }

    get instance(): Redis.Redis {
        return this.redisClient;
    }
}
