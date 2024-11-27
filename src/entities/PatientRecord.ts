import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity()
export class PatientRecord {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => User, user => user.patientRecord) // One-to-one relationship with User
	@JoinColumn({ name: 'userId' })
	user: User

	@Column({ type: 'text', nullable: true })
	medicalHistory: string

	@Column({ type: 'text', nullable: true })
	allergies: string

	@Column({ type: 'text', nullable: true })
	currentMedications: string

	@Column({ type: 'text', nullable: true })
	chronicDiseases: string

	@Column({ nullable: true })
	bloodGroup: string

	@Column({ type: 'text', nullable: true })
	notes: string
}
