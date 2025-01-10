import { Module } from '@nestjs/common';
import { SensorDbModule } from 'src/db/main-db.module';
import { ActorService } from './actor.service';

@Module({
  imports: [SensorDbModule],
  providers: [ActorService],
  exports: [ActorService],
})
export class ActorModule {}
