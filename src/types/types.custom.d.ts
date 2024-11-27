/**
 * This file is used to declare types that are visible to the TypeScript type
 * checker across all of the code in this project. This is useful for declaring
 * types that are part of the Express.js framework, but which are not well
 * represented in the Express.js type definitions.
 *
 * This file is not intended to be imported by any other file. Instead, it is
 * intended to be used by the TypeScript type checker to inform type checking
 * across the entire project.
 *
 * @packageDocumentation
 */

import { User } from '../entities/User'

declare global {
	declare namespace Express {
		/**
		 * The Express.js Request object.
		 */
		interface Request {
			/**
			 * The user who made the request, if any.
			 */
			user?: User
		}
	}
}

export {}
