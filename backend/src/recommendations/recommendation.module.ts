import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { SensorDbModule } from 'src/db/main-db.module';

@Module({
  imports: [SensorDbModule],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
