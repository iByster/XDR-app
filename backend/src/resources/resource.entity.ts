import { Incident } from 'src/incident/incident.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'json' })
  data: any;

  @Column()
  eventId: number;

  @JoinColumn({ name: 'incidentId' })
  @ManyToOne(() => Incident, (incident) => incident.resources)
  incident: Incident;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
