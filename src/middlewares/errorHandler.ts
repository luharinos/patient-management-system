import { Request, Response, NextFunction } from 'express'

/**
 * Custom error class for operational errors.
 */
class AppError extends Error {
	/**
	 * HTTP status code for the error.
	 */
	statusCode: number

	/**
	 * Whether or not the error is operational (expected).
	 */
	isOperational: boolean

	/**
	 * Constructor for the AppError class.
	 *
	 * @param {string} message - The error message.
	 * @param {number} statusCode - The HTTP status code for the error.
	 */
	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
		this.isOperational = true // Mark as operational error (expected)
		Error.captureStackTrace(this, this.constructor)
	}
}

/**
 * Error handler middleware.
 *
 * This middleware catches any errors that are not operational errors and logs
 * them to the console. It then sends a default error response to the client.
 *
 * @param {Error} err - The error object. If the error is not an instance of
 *   AppError, it is logged to the console as an unexpected error.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} _next - The next middleware function in the stack.
 *   This parameter is not used in this middleware.
 */
const errorHandler = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	err: any, // Error object, could be of any type
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	// Check if the error is an operational error. If it is not, log it to the
	// console. Non-operational errors are unexpected errors that should be fixed
	// in the code.
	if (!err.isOperational) {
		console.error(err)
	}

	// Set the HTTP status code for the response based on the error. If the error
	// does not have a statusCode property, default to 500 (Internal Server
	// Error).
	const statusCode = err?.statusCode || 500

	// Set the error message for the response. If the error does not have a
	// message property, default to 'Internal Server Error'.
	const message = err.message || 'Internal Server Error'

	// Send the response to the client.
	res.status(statusCode).json({
		// Set the status of the response to 'error'.
		status: 'error',
		// Set the message of the response to the error message.
		message: message
	})
}

export { AppError, errorHandler }
