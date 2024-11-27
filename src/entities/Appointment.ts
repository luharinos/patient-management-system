import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	ManyToOne
} from 'typeorm'
import { User } from './User'

@Entity()
export class Appointment {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	date: Date

	@Column()
	time: string

	@Column({ type: 'text', nullable: true })
	description: string

	@Column()
	patientId: number // Foreign Key for patient

	@Column()
	doctorId: number // Foreign Key for doctor

	@ManyToOne(() => User) // Reference to User table
	@JoinColumn({ name: 'patientId' }) // Maps to patientId column
	patient: User

	@ManyToOne(() => User) // Reference to User table
	@JoinColumn({ name: 'doctorId' }) // Maps to doctorId column
	doctor: User

	// @ManyToOne(() => User, user => user.patientAppointments)
	// patient: User

	// @ManyToOne(() => User, user => user.doctorAppointments)
	// doctor: User
}
