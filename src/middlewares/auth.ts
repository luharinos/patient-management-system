import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) throw new AppError('Access Denied', 401)

		try {
			const _verified = jwt.verify(token, process.env.JWT_SECRET as string)
			next()
		} catch (_err) {
			throw new AppError('Invalid Token', 400)
		}
	} catch (err) {
		next(err)
	}
}
