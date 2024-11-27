import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'
import { User } from '../entities/User'

/**
 * Middleware function to authenticate a user.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @throws {AppError} - If token is invalid or missing
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		// Extract the token from the Authorization header
		const token = req.headers.authorization?.split(' ')[1]

		// If no token is provided, throw an error indicating access is denied
		if (!token) throw new AppError('Access Denied', 401)

		try {
			// Verify the token using JWT_SECRET from environment variables
			// If token is valid, decoded user information will be returned
			const verifiedUser = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as User

			// Attach the verified user to the request object for later use
			req.user = verifiedUser

			// Call the next middleware function
			next()
		} catch (_err) {
			// If there's an error in token verification, throw an error indicating an invalid token
			throw new AppError('Invalid Token', 400)
		}
	} catch (err) {
		// Pass any caught error to the next error-handling middleware
		next(err)
	}
}

/**
 * A middleware function that checks if the user's role is in the allowedRoles array
 *
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the resource
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<void>} - Middleware function
 */
export function authorize(
	allowedRoles: string[]
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Get the user from the request (after authentication)
			// The user is attached to the request object by the authenticate middleware
			const user = req.user as User

			// If the user is not authenticated, throw an error
			if (!user) {
				throw new AppError('User not authenticated', 401)
			}

			// Check if the user's role is in the allowedRoles array
			// If the user's role is not in the array, throw an error
			if (!allowedRoles.includes(user.role)) {
				throw new AppError(
					'You do not have permission to access this resource',
					403
				)
			}

			// If the user is authorized, call the next middleware function
			next()
		} catch (err) {
			// If there's an error, pass it to the next error-handling middleware
			next(err)
		}
	}
}
