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

export enum EventTypes {
  EmailContent = 'EmailContent',
  EmailAttachments = 'EmailAttachments',
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

  @Column({
    type: 'enum',
    enum: EventStatus,
  })
  type: any;

  @CreateDateColumn()
  timestamp: Date;
}
