import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum SensorType {
  OFFICE_365_MAILS = 'Office 365 Mails',
  ME_OFFICE_365_MAILS = 'ME Office 365 Mails - Test',
  MOCK_OFFICE_365_MAILS = 'Mock Office 365 Mails',
}

// export enum SensorStatus {
//   UNALLOCATED = 'unallocated',
//   ALLOCATED = 'allocated',
//   RUNNING = 'running',
//   COMPLETED = 'completed',
// }

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SensorType,
  })
  sensorType: SensorType;

  @Column({
    type: 'json',
  })
  config: Record<string, any>;

  @Column({
    type: 'boolean',
    default: true,
  })
  enabled: boolean;

  // @Column({
  //   type: 'enum',
  //   enum: SensorStatus,
  //   default: SensorStatus.UNALLOCATED,
  // })
  // status: SensorStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRunning: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastExecutionTime: Date;

  @Column({ type: 'int', default: 10 }) // Default to 10 minutes
  runtimeLimit: number;
}
