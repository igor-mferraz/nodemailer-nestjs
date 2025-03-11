// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaConsumerService } from './kafka/kafka-consumer';


@Module({
  imports: [
    
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule, UsersModule, MailModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService,KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class AppModule {}