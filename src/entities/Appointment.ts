import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './User'

/**
 * Represents an appointment between a patient and a doctor.
 */
@Entity()
export class Appointment {
	/**
	 * A unique identifier for the appointment.
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * The date of the appointment.
	 */
	@Column()
	date: Date

	/**
	 * The time of the appointment.
	 */
	@Column()
	time: string

	/**
	 * A text-based description of the appointment.
	 */
	@Column({ type: 'text', nullable: true })
	description: string

	/**
	 * The ID of the patient the appointment is for.
	 */
	@Column()
	patientId: number

	/**
	 * The ID of the doctor the appointment is with.
	 */
	@Column()
	doctorId: number

	/**
	 * A reference to the User entity representing the patient.
	 */
	@ManyToOne(() => User)
	@JoinColumn({ name: 'patientId' })
	patient: User

	/**
	 * A reference to the User entity representing the doctor.
	 */
	@ManyToOne(() => User)
	@JoinColumn({ name: 'doctorId' })
	doctor: User
}
