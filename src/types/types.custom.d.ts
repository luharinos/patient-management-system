import { User } from '../entities/User'

declare global {
	declare namespace Express {
		interface Request {
			user?: User
		}
	}
}

export {}
