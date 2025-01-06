// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Recommendation } from './recommendation.entity';

// @Injectable()
// export class RecommendationService {
//   constructor(
//     @InjectRepository(Recommendation)
//     private readonly recommendationRepository: Repository<Recommendation>,
//   ) {}

//   async createRecommendation(
//     incidentId: number,
//     title: string,
//     description: string,
//     severity: string,
//   ): Promise<Recommendation> {
//     const recommendation = this.recommendationRepository.create({
//       incidentId,
//       title,
//       description,
//       severity,
//     });

//     return this.recommendationRepository.save(recommendation);
//   }
// }
