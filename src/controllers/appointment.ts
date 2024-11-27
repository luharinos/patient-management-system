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
import { AppError } from '../middlewares/errorHandler'
import moment from 'moment'

export async function createAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const patientId = req.body.patientId || req.user?.id
		const { doctorId, date, time, description } = req.body

		if (!patientId || !doctorId || !date || !time) {
			throw new AppError(
				'Patient ID, Doctor ID, Date and Time are required',
				400
			)
		}

		const parsedDate = moment(date, 'DD-MM-YYYY').toDate()
		const appointment = await createAppointmentEntry(
			patientId as number,
			doctorId,
			parsedDate,
			time,
			description
		)
		res.json({ status: 'success', data: appointment })
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

		res.json({ success: true, data: appointments })
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
		if (Number.isNaN(appointmentId)) {
			throw new AppError('Invalid appointment ID', 400)
		}

		let appointment: Appointment = {} as Appointment
		if (req.user?.role === UserRole.ADMIN) {
			appointment = await updateAdminAppointmentEntry(appointmentId, req.body)
		} else if (req.user?.role === UserRole.DOCTOR) {
			appointment = await updateDoctorAppointmentEntry(
				req.user.id,
				appointmentId,
				req.body
			)
		} else if (req.user?.role === UserRole.PATIENT) {
			appointment = await updatePatientAppointmentEntry(
				req.user.id,
				appointmentId,
				req.body
			)
		}
		res.json({ status: 'success', data: appointment })
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
		if (Number.isNaN(appointmentId)) {
			throw new AppError('Invalid appointment ID', 400)
		}

		await deleteAdminAppointmentEntry(appointmentId)
		res.json({ status: 'success', message: 'Appointment deleted successfully' })
	} catch (err) {
		next(err)
	}
}
