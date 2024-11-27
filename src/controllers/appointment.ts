import { Request, Response, NextFunction } from 'express'
import {
	createAppointmentEntry,
	deleteAdminAppointmentEntry,
	getAllAppointmentEntries,
	getDoctorAppointmentEntries,
	getPatientAppointmentEntries,
	updateAdminAppointmentEntry,
	updateDoctorAppointmentEntry,
	updatePatientAppointmentEntry
} from '../services/appointment'
import { UserRole } from '../entities/User'
import { Appointment } from '../entities/Appointment'

export async function createAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const patientId = req.body.patientId || req.user?.id
		const { doctorId, date, time, description } = req.body

		createAppointmentEntry(
			patientId as number,
			doctorId,
			date,
			time,
			description
		)
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
		let appointments: Appointment[] = []
		if (req.user?.role === UserRole.ADMIN) {
			appointments = await getAllAppointmentEntries()
		} else if (req.user?.role === UserRole.DOCTOR) {
			appointments = await getDoctorAppointmentEntries(req.user.id)
		} else if (req.user?.role === UserRole.PATIENT) {
			appointments = await getPatientAppointmentEntries(req.user.id)
		}

		res.json(appointments)
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
		const appointmentId = parseInt(req.params.id)
		if (req.user?.role === UserRole.ADMIN) {
			updateAdminAppointmentEntry(appointmentId, req.body)
		} else if (req.user?.role === UserRole.DOCTOR) {
			await updateDoctorAppointmentEntry(req.user.id, appointmentId, req.body)
		} else if (req.user?.role === UserRole.PATIENT) {
			await updatePatientAppointmentEntry(req.user.id, appointmentId, req.body)
		}
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
		const appointmentId = parseInt(req.params.id)
		await deleteAdminAppointmentEntry(appointmentId)
		res.json({ message: 'Appointment deleted successfully' })
	} catch (err) {
		next(err)
	}
}
