import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';
import { SensorsController } from './sensor.controller';
import { SensorsService } from './sensor.service';
import { SensorContext } from './sensor-context';
import { Office365MailStrategy } from './strategies/office365-mail.strategy';
import { MicrosoftAuthService } from '../auth/microsoft-auth.service';
import { HttpModule } from '@nestjs/axios';
import { SensorOrchestratorService } from './orchestrator/sensor-orchestrator.service';
import { OrchestratorScheduler } from './cron/OrchestratorScheduler';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventsModule } from '../events/event.module';
import { SensorDbModule } from 'src/db/main-db.module';
import { MeOffice365MeMailStrategy } from './strategies/me-office365-mail.strategy';
import { MockOffice365MailStrategy } from './strategies/mock-office365-mail.strategy';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Sensor]),
    SensorDbModule,
    HttpModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [{ name: 'events-exchange', type: 'topic' }],
      uri: 'amqp://localhost',
    }),
    EventsModule,
  ],
  controllers: [SensorsController],
  providers: [
    SensorsService,
    SensorContext,
    Office365MailStrategy,
    MeOffice365MeMailStrategy,
    MicrosoftAuthService,
    MockOffice365MailStrategy,
    SensorOrchestratorService,
    OrchestratorScheduler,
  ],
  exports: [SensorsService],
})
export class SensorsModule {}
