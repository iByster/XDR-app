// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Incident } from 'src/incident/incident.entity';

// @Entity('recommendations')
// export class Recommendation {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @Column('text')
//   description: string;

//   @Column()
//   severity: string;

//   @ManyToOne(() => Incident, (incident) => incident.recommendations, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'incident_id' })
//   incident: Incident;

//   @Column()
//   incidentId: number;
// }
