// import { Recommendation } from 'src/recommendations/recommendation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: IncidentSeverity,
    default: IncidentSeverity.LOW,
  })
  severity: IncidentSeverity;

  @Column()
  relatedEventId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => Recommendation, (recommendation) => recommendation.incident)
  // recommendations: Recommendation[];
}
