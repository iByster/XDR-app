import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensorId: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
  })
  status: EventStatus;

  @Column({ type: 'json' })
  data: any; // Can store either the sensor output or the error message

  @CreateDateColumn()
  timestamp: Date;
}
