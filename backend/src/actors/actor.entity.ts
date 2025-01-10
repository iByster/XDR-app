import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  value: string;

  @Column()
  eventId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
