import { Actor } from 'src/actors/actor.entity';
import { Alert } from 'src/alerts/alert.entity';
import { Recommendation } from 'src/recommendations/recommendation.entity';
import { Resource } from 'src/resources/resource.entity';
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

  // @Column()
  // eventId: number;

  @Column({ unique: true })
  hash: string; // Unique hash to ensure incident uniqueness

  @OneToMany(() => Recommendation, (recommendation) => recommendation.incident)
  recommendations: Recommendation[];

  // Relationship with Alerts
  @OneToMany(() => Alert, (alert) => alert.incident, { cascade: true })
  alerts: Alert[];

  // Relationship with Actors
  @OneToMany(() => Actor, (actor) => actor.incident, { cascade: true })
  actors: Actor[];

  // Relationship with Resources
  @OneToMany(() => Resource, (resource) => resource.incident, { cascade: true })
  resources: Resource[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
