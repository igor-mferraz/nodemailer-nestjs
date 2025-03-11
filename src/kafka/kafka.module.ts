import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { KafkaProducerService } from './kafka-producer';
import { KafkaConsumerService } from './kafka-consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nestjs-kafka',
            brokers: ['kafka:29092'],
            retry: {
              retries: 10, // Number of retries
              initialRetryTime: 300, // Initial retry time in ms
              maxRetryTime: 10000, // Maximum total retry time in ms
              factor: 0.2, // Exponential factor for backoff
            },
          },
          consumer: {
            groupId: 'nestjs-group',
          },
        },
      },
    ]),
    PrismaModule,
   MailModule
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService],
})
export class KafkaModule { }