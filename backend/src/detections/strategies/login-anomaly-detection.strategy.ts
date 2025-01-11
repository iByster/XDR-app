import { Injectable, Logger } from '@nestjs/common';
import {
  DetectionStrategy,
  DetectionResult,
} from './detection-strategy.interface';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';
import {
  CreateRecommendationDto,
  RecommendationSeverity,
} from 'src/recommendations/dto/create-recommandation.dto';

@Injectable()
export class LoginAnomalyDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(LoginAnomalyDetectionStrategy.name);

  // Sample baseline data for users
  private userLoginPatterns = {
    'user1@trusted-domain.com': {
      averageLoginTime: '09:00',
      typicalLocations: ['US', 'CA'],
    },
  };

  async detect(event: Event): Promise<DetectionResult | null> {
    // this.logger.log(`Running anomaly detection for event ID: ${event.id}`);

    // const loginEvent = event.data;
    // const userPattern = this.userLoginPatterns[loginEvent.email];
    // const recommendations: CreateRecommendationDto[] = [];

    // if (!userPattern) {
    //   return null; // No baseline for this user
    // }

    // // Check if login time is anomalous
    // if (
    //   this.isAnomalousTime(loginEvent.timestamp, userPattern.averageLoginTime)
    // ) {
    //   recommendations.push({
    //     title: 'Investigate Login Time Anomaly',
    //     description: `User ${loginEvent.email} logged in at an unusual time: ${loginEvent.timestamp}`,
    //     incidentId: null,
    //     severity: RecommendationSeverity.MEDIUM,
    //   });

    //   return {
    //     incident: {
    //       title: 'Anomalous Login Time Detected',
    //       description: `User ${loginEvent.email} logged in at an unusual time: ${loginEvent.timestamp}`,
    //       severity: IncidentSeverity.MEDIUM,
    //       relatedEventId: event.id,
    //     },
    //     recommendations,
    //   };
    // }

    // // Check if login location is anomalous
    // if (!userPattern.typicalLocations.includes(loginEvent.location)) {
    //   recommendations.push({
    //     title: 'Investigate Login Location Anomaly',
    //     description: `User ${loginEvent.email} logged in from an unusual location: ${loginEvent.location}`,
    //     incidentId: null,
    //     severity: RecommendationSeverity.HIGH,
    //   });

    //   return {
    //     incident: {
    //       title: 'Anomalous Login Location Detected',
    //       description: `User ${loginEvent.email} logged in from an unusual location: ${loginEvent.location}`,
    //       severity: IncidentSeverity.HIGH,
    //       relatedEventId: event.id,
    //     },
    //     recommendations,
    //   };
    // }

    // this.logger.log(`No anomalies detected for login event ID: ${event.id}`);
    return null;
  }

  private isAnomalousTime(timestamp: string, averageTime: string): boolean {
    // Logic to compare times and check if the login time is outside the normal range
    return true;
  }
}
