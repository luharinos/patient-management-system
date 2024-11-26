import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'
import { User } from '../entities/User'

export function authenticate(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) throw new AppError('Access Denied', 401)

		try {
			const verifiedUser = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as User
			req.user = verifiedUser
			next()
		} catch (_err) {
			throw new AppError('Invalid Token', 400)
		}
	} catch (err) {
		next(err)
	}
}

export function authorize(allowedRoles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as User // Get the user from the request (after authentication)

			if (!user) {
				throw new AppError('User not authenticated', 401)
			}

			// Check if the user's role is in the allowedRoles array
			if (!allowedRoles.includes(user.role)) {
				throw new AppError(
					'You do not have permission to access this resource',
					403
				)
			}

			next() // User is authorized, move to the next middleware
		} catch (err) {
			next(err)
		}
	}
}
