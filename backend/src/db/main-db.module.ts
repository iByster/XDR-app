import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../sensors/sensor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'sensorConnection',
      type: 'postgres',
      host: process.env.MAIN_DB_HOST,
      port: parseInt(process.env.MAIN_DB_PORT, 10),
      username: process.env.MAIN_DB_USERNAME,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB_NAME,
      entities: [Sensor],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Sensor], 'sensorConnection'),
  ],
  exports: [TypeOrmModule],
})
export class SensorDbModule {}
