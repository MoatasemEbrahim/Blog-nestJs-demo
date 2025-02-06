import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { QueuesConstant } from "../../shared/constants/queues.constant";
import { ConfigService } from "@nestjs/config";
import { DeleteFileConsumer } from "./consumers/delete-file.consumer";
import { ReSizeFileConsumer } from "./consumers/reSize-file.consumer";
import { UploadModule } from "../upload/upload.module";

const importsAndExports = [
  BullModule.registerQueue(
    { name: QueuesConstant.DELETE_FILE },
    {
      name: QueuesConstant.RESIZE_FILE,
      defaultJobOptions: {
        priority: 2,
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }
  ),
];

const providerAndExports = [DeleteFileConsumer, ReSizeFileConsumer];
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>("REDIS_HOST"),
          port: Number(config.get<string>("REDIS_PORT")),
        },
      }),
      inject: [ConfigService],
    }),
    ...importsAndExports,
    UploadModule,
  ],
  providers: [...providerAndExports],
  exports: [...importsAndExports, ...providerAndExports],
})
export class QueuesModule {}
