import { AppDataSource } from '../config/database'
import { AppError } from '../middlewares/errorHandler'
import { Request, Response, NextFunction } from 'express'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Handles a login request.
 *
 * @throws {AppError} - If the email or password is invalid
 * @throws {AppError} - If the user is not found
 * @throws {AppError} - If there is an error with the database
 *
 */
export async function login(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Extract the email and password from the request body
		const { email, password } = req.body

		// Check if the email and password are provided. If not, throw an error
		if (!email || !password) {
			throw new AppError('Email and password are required', 400)
		}

		// Create a typeorm repository for the User entity
		const userRepository = AppDataSource.getRepository(User)

		// Find a user with the provided email
		const user = await userRepository.findOne({ where: { email } })

		// Check if the user is found and if the password matches. If not, throw an error
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new AppError('Invalid email or password', 401)
		}

		// Create a JSON web token with the user's id and role
		// The token is signed with the JWT secret from the environment variables
		// The token will expire in 1 hour
		const token = jwt.sign(
			{
				id: user?.id,
				role: user?.role
			},
			process.env.JWT_SECRET as string,
			{
				expiresIn: '1h'
			}
		)

		// Return the token in the response
		res.json({ token })
	} catch (err) {
		// Pass any caught error to the next error-handling middleware
		next(err)
	}
}

/**
 * Handles a registration request.
 *
 * @throws {AppError} - If the email is already used
 * @throws {AppError} - If the name, email, password, or role is not provided
 * @throws {AppError} - If there is an error with the database
 *
 */
export async function register(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Destructure the request body to get user details
		const { name, email, password, role, contactNumber, age, gender } = req.body

		// Get the repository for the User entity
		const userRepository = AppDataSource.getRepository(User)

		// Check if a user with the given email already exists
		const user = await userRepository.findOne({ where: { email } })
		if (user) {
			// If user exists, throw an error indicating the email is already used
			throw new AppError('Email already exists', 409)
		} else {
			// Check for required fields: name, email, password, and role
			if (!name || !email || !password || !role) {
				// If any required field is missing, throw an error
				throw new AppError('Name, Email, Password and Role are required', 400)
			}

			// Hash the user's password for security
			const hashedPassword = await bcrypt.hash(password, 10)

			// Create a new user object with the provided and hashed details
			const newUser = userRepository.create({
				name,
				email,
				password: hashedPassword,
				role,
				contactNumber,
				age,
				gender
			})

			// Save the new user to the database
			await userRepository.save(newUser)

			// Send a response with the newly created user and a 201 Created status
			res.status(201).json(newUser)
		}
	} catch (err) {
		// Pass any errors to the next middleware function for error handling
		next(err)
	}
}
