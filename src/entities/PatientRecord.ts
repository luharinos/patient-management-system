// import {
// 	Entity,
// 	PrimaryGeneratedColumn,
// 	Column,
// 	OneToOne,
// 	JoinColumn,
// 	Repository
// } from 'typeorm'
// import { User } from './User'
// import { AppDataSource } from '../config/database'

// @Entity()
// export class PatientRecord {
// 	@PrimaryGeneratedColumn()
// 	id: number

// 	@OneToOne(() => User, user => user.patientRecord) // One-to-one relationship with User
// 	@JoinColumn({ name: 'userId' })
// 	user: User

// 	@Column({ type: 'text', nullable: true })
// 	medicalHistory: string

// 	@Column({ type: 'text', nullable: true })
// 	allergies: string

// 	@Column({ type: 'text', nullable: true })
// 	currentMedications: string

// 	@Column({ type: 'text', nullable: true })
// 	chronicDiseases: string

// 	@Column({ nullable: true })
// 	bloodGroup: string

// 	@Column({ type: 'text', nullable: true })
// 	notes: string
// }

// export const patientRecordRepository: Repository<PatientRecord> =
// 	AppDataSource.getRepository(PatientRecord)
