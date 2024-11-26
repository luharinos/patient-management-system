import { Request, Response, NextFunction } from 'express'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler'

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
			throw new AppError('Invalid email or password', 401)
		}
		const token = jwt.sign(
			{ id: user?.id, role: user?.role },
			process.env.JWT_SECRET as string,
			{
				expiresIn: '1h'
			}
		)
		res.json({ token })
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
		const { name, email, password, role, contactNumber, age, gender } = req.body
		const user = await userRepository.findOne({ where: { email } })
		if (user) {
			throw new AppError('Email already exists', 409)
		} else {
			if (!name || !email || !password || !role) {
				throw new AppError('Name, Email, Password and Role are required', 400)
			}
			const hashedPassword = await bcrypt.hash(password, 10)
			const newUser = userRepository.create({
				name,
				email,
				password: hashedPassword,
				role,
				contactNumber,
				age,
				gender
			})
			await userRepository.save(newUser)
			res.status(201).json(newUser)
		}
	} catch (err) {
		next(err)
	}
}
