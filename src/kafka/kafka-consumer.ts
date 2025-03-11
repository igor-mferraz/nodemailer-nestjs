import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-kafka',
    brokers: ['kafka:29092'],
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'nestjs-group' });
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor( private readonly mailService: MailService) {}

async onModuleInit() {
   
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'user-registered', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const userData = JSON.parse(message.value.toString());
        console.log(`Received user registration event: ${JSON.stringify(userData)}`);
        await this.mailService.sendUserRegistration(userData);
      },
    });
  }
async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}