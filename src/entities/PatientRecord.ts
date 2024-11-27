import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './User'

/**
 * Represents a patient's medical record
 */
@Entity()
export class PatientRecord {
	/**
	 * Unique identifier for the patient record
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * The patient who the record belongs to
	 */
	@OneToOne(() => User, user => user.patientRecord) // One-to-one relationship with User
	@JoinColumn({ name: 'userId' })
	user: User

	/**
	 * The patient's medical history
	 */
	@Column({ type: 'text', nullable: true })
	medicalHistory: string

	/**
	 * The patient's allergies
	 */
	@Column({ type: 'text', nullable: true })
	allergies: string

	/**
	 * The patient's current medications
	 */
	@Column({ type: 'text', nullable: true })
	currentMedications: string

	/**
	 * The patient's chronic diseases
	 */
	@Column({ type: 'text', nullable: true })
	chronicDiseases: string

	/**
	 * The patient's blood group
	 */
	@Column({ nullable: true })
	bloodGroup: string

	/**
	 * Any additional notes about the patient
	 */
	@Column({ type: 'text', nullable: true })
	notes: string
}
