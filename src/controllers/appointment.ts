import { Request, Response, NextFunction } from 'express'

export async function createAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// code here
	} catch (err) {
		next(err)
	}
}

export async function getAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// code here
	} catch (err) {
		next(err)
	}
}

export async function updateAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// code here
	} catch (err) {
		next(err)
	}
}

export async function deleteAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// code here
	} catch (err) {
		next(err)
	}
}
