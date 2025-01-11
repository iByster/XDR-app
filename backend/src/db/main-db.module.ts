import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../sensors/sensor.entity';
import { Incident } from 'src/incident/incident.entity';
import { Recommendation } from 'src/recommendations/recommendation.entity';
import { Alert } from 'src/alerts/alert.entity';
import { Actor } from 'src/actors/actor.entity';
import { Resource } from 'src/resources/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'mainConnection',
      type: 'postgres',
      host: process.env.MAIN_DB_HOST,
      port: parseInt(process.env.MAIN_DB_PORT, 10),
      username: process.env.MAIN_DB_USERNAME,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB_NAME,
      entities: [Sensor, Incident, Recommendation, Alert, Actor, Resource],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(
      [Sensor, Incident, Recommendation, Alert, Actor, Resource],
      'mainConnection',
    ),
  ],
  exports: [TypeOrmModule],
})
export class SensorDbModule {}
