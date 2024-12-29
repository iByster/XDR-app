import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../sensors/events/event.entity'; // Path to your Event entity

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'eventConnection', // Unique name for this connection
      type: 'postgres', // Or your DB type
      host: process.env.EVENT_DB_HOST,
      port: parseInt(process.env.EVENT_DB_PORT, 10),
      username: process.env.EVENT_DB_USERNAME,
      password: process.env.EVENT_DB_PASSWORD,
      database: process.env.EVENT_DB_NAME,
      entities: [Event], // Specify entities for this DB
      synchronize: true, // Use migrations in production
    }),
    TypeOrmModule.forFeature([Event], 'eventConnection'), // Register the entity
  ],
  exports: [TypeOrmModule], // Export for usage in other modules
})
export class EventDbModule {}
