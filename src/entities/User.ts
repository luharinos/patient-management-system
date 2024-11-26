import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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

	@Column()
	role: 'admin' | 'doctor' | 'patient'

	@Column({ nullable: true })
	contactNumber: string

	@Column({ nullable: true })
	age: number

	@Column({ nullable: true })
	gender: string
}
