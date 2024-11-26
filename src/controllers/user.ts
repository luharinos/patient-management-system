import { Request, Response, NextFunction } from 'express'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userRepository: Repository<User> = AppDataSource.getRepository(User)

export async function login(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const { email, password } = req.body
		const user = await userRepository.findOne({ where: { email } })

		if (!user || !(await bcrypt.compare(password, user.password))) {
			res.status(401).send('Invalid credentials')
			// return
		}
		const token = jwt.sign(
			{ id: user?.id, role: user?.role },
			'your_jwt_secret',
			{
				expiresIn: '1h'
			}
		)
		res.json({ token })
		// return
	} catch (err) {
		next(err)
	}
}

export async function register(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const { name, email, password, role } = req.body
		const user = await userRepository.findOne({ where: { email } })
		if (user) {
			res.status(409).json({ message: 'Email already exists' })
			// return
		} else {
			if (!name || !email || !password || !role) {
				throw new Error('All fields are required')
			}
			const hashedPassword = await bcrypt.hash(password, 10)
			const newUser = userRepository.create({
				name,
				email,
				password: hashedPassword,
				role
			})
			await userRepository.save(newUser)
			res.status(201).json(newUser)
			// return
		}
	} catch (err) {
		next(err)
	}
}
