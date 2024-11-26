import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Appointment {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	date: Date

	@Column()
	time: string

	@Column()
	description: string

	@ManyToOne(() => User, user => user.id)
	patient: User

	@ManyToOne(() => User, user => user.id)
	doctor: User
}
