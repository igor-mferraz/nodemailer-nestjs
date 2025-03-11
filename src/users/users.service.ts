import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer';

@Injectable()
export class UsersService {

  constructor(
    private prismaService: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService
  )
    {}

  async create(createUserDto: CreateUserDto) {
    let user = this.prismaService.user.create({
      data: {
        ...createUserDto 
      }
    });
    await this.kafkaProducerService.emitUserRegisteredEvent(createUserDto);
    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
