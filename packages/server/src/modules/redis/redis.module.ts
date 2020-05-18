import { DynamicModule, Global, Module } from "@nestjs/common";
import { RedisService } from "@src/modules/redis/redis.service";

export interface RedisModuleOptions {
    url: string;
}

@Global()
@Module({})
export class RedisModule {
    static register(options: RedisModuleOptions): DynamicModule {
        return {
            providers: [
                {
                    provide: RedisService,
                    useFactory: () => new RedisService(options.url),
                },
            ],
            exports: [RedisService],
            module: RedisModule,
        };
    }
}
