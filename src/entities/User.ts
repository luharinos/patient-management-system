import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { Appointment } from './Appointment'
import { PatientRecord } from './PatientRecord'

export enum UserRole {
	ADMIN = 'admin',
	DOCTOR = 'doctor',
	PATIENT = 'patient'
}

/**
 * Represents a user in the system. This can be a patient, doctor or administrator.
 * Each user has a unique email and password. Additionally, a user can have a
 * patient record, appointments as a patient and appointments as a doctor.
 */
@Entity()
export class User {
	/**
	 * The unique identifier for the user.
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * The full name of the user.
	 */
	@Column()
	name: string

	/**
	 * The email address of the user. This is unique.
	 */
	@Column({ unique: true })
	email: string

	/**
	 * The password of the user.
	 */
	@Column()
	password: string

	/**
	 * The role of the user. One of: 'admin', 'doctor', 'patient'.
	 */
	@Column({ type: 'text' })
	role: UserRole

	/**
	 * The contact phone number of the user.
	 */
	@Column({ nullable: true })
	contactNumber: string

	/**
	 * The age of the user.
	 */
	@Column({ nullable: true })
	age: number

	/**
	 * The gender of the user.
	 */
	@Column({ nullable: true })
	gender: string

	/**
	 * The patient record for the user.
	 */
	@OneToOne(() => PatientRecord, patientRecord => patientRecord.user, {
		cascade: true
	})
	patientRecord: PatientRecord

	/**
	 * The appointments for the user as a patient.
	 */
	@OneToMany(() => Appointment, appointment => appointment.patient)
	patientAppointments: Promise<Appointment[]>

	/**
	 * The appointments for the user as a doctor.
	 */
	@OneToMany(() => Appointment, appointment => appointment.doctor)
	doctorAppointments: Promise<Appointment[]>
}
