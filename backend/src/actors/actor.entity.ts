import { Incident } from 'src/incident/incident.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'json' })
  data: any;

  @Column()
  eventId: number;

  @JoinColumn({ name: 'incidentId' })
  @ManyToOne(() => Incident, (incident) => incident.actors)
  incident: Incident;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
