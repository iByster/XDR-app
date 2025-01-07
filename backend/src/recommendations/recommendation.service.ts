import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { CreateRecommendationDto } from './dto/create-recommandation.dto';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Recommendation, 'mainConnection')
    private readonly recommendationRepository: Repository<Recommendation>,
  ) {}

  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<Recommendation> {
    const recommendation = this.recommendationRepository.create(
      createRecommendationDto,
    );
    return this.recommendationRepository.save(recommendation);
  }
}
