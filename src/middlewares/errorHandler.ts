// errorHandler.ts

import { Request, Response, NextFunction } from 'express'

// Custom error class to distinguish between different error types
class AppError extends Error {
	statusCode: number
	isOperational: boolean

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
		this.isOperational = true // Mark as operational error (expected)
		Error.captureStackTrace(this, this.constructor)
	}
}

// Error handler middleware
const errorHandler = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	err: any, // Error object, could be of any type
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (!err.isOperational) console.error(err) // Log unexpected errors

	// Default error response for unexpected issues
	const statusCode = err?.statusCode || 500
	const message = err.message || 'Internal Server Error'

	// Send response
	res.status(statusCode).json({
		status: 'error',
		message: message
	})
}

// Export custom error class and error handler middleware
export { AppError, errorHandler }
