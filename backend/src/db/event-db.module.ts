import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'eventConnection',
      type: 'postgres',
      host: process.env.EVENT_DB_HOST,
      port: parseInt(process.env.EVENT_DB_PORT, 10),
      username: process.env.EVENT_DB_USERNAME,
      password: process.env.EVENT_DB_PASSWORD,
      database: process.env.EVENT_DB_NAME,
      entities: [Event],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event], 'eventConnection'),
  ],
  exports: [TypeOrmModule],
})
export class EventDbModule {}
