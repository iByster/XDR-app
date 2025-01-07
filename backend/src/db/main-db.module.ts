import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../sensors/sensor.entity';
import { Incident } from 'src/incident/incident.entity';
import { Recommendation } from 'src/recommendations/recommendation.entity';

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
      entities: [Sensor, Incident, Recommendation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(
      [Sensor, Incident, Recommendation],
      'mainConnection',
    ),
  ],
  exports: [TypeOrmModule],
})
export class SensorDbModule {}
