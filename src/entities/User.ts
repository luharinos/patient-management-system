import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	OneToMany
} from 'typeorm'

import { Appointment } from './Appointment'
import { PatientRecord } from './PatientRecord'

export enum UserRole {
	ADMIN = 'admin',
	DOCTOR = 'doctor',
	PATIENT = 'patient'
}

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ unique: true })
	email: string

	@Column()
	password: string

	@Column({ type: 'text' })
	role: UserRole

	@Column({ nullable: true })
	contactNumber: string

	@Column({ nullable: true })
	age: number

	@Column({ nullable: true })
	gender: string

	@OneToOne(() => PatientRecord, patientRecord => patientRecord.user, {
		cascade: true
	})
	patientRecord: PatientRecord

	@OneToMany(() => Appointment, appointment => appointment.patient)
	patientAppointments: Promise<Appointment[]>

	@OneToMany(() => Appointment, appointment => appointment.doctor)
	doctorAppointments: Promise<Appointment[]>
}

// export const userRepository: Repository<User> =
// 	AppDataSource.getRepository(User)
