import { AppError } from '../middlewares/errorHandler'
import { Appointment } from '../entities/Appointment'
import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../entities/User'
import moment from 'moment'
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

/**
 * Creates a new appointment entry.
 *
 * @throws {AppError} If any of the required fields are missing.
 *
 */
export async function createAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	// Attempt to create a new appointment entry
	try {
		const { patientId, doctorId, date, time, description } = req.body

		// If any of the required fields are missing, throw a 400 error
		if (!patientId || !doctorId || !date || !time) {
			throw new AppError(
				'Patient ID, Doctor ID, Date and Time are required',
				400
			)
		}

		// Parse the date from the request body
		const parsedDate = moment(date, 'DD-MM-YYYY').toDate()

		// Create the appointment entry
		const appointment = await createAppointmentEntry(
			patientId as number,
			doctorId,
			parsedDate,
			time,
			description
		)

		// Send the new appointment in the response
		res.json({ status: 'success', data: appointment })
	} catch (err) {
		// If there was an error, pass it to the next middleware
		next(err)
	}
}

/**
 * Retrieves appointments based on the role of the user making the request.
 * The response will contain an array of appointments.
 *
 * @throws {AppError} If there is an error during the retrieval process.
 *
 */
export async function getAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Initialize an empty array to contain the retrieved appointments
		let appointments: Appointment[] = []

		// Check the role of the user making the request
		if (req.user?.role === UserRole.ADMIN) {
			// If the user is an admin, retrieve all appointments
			appointments = await getAllAppointmentEntries()
		} else if (req.user?.role === UserRole.DOCTOR) {
			// If the user is a doctor, retrieve their own appointments
			appointments = await getDoctorAppointmentEntries(req.user.id)
		} else if (req.user?.role === UserRole.PATIENT) {
			// If the user is a patient, retrieve their own appointments
			appointments = await getPatientAppointmentEntries(req.user.id)
		}

		// Send the retrieved appointments in the response
		res.json({ success: true, data: appointments })
	} catch (err) {
		// If there is an error, pass it to the next middleware
		next(err)
	}
}

/**
 * Updates an appointment entry based on the role of the user making the request.
 * The request body must contain the fields to be updated.
 *
 * @throws {AppError} If there is an error during the update process.
 *
 */
export async function updateAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Parse the appointment ID from the request parameters and convert it to a number
		const appointmentId = parseInt(req.params.id)

		// Check if the appointment ID is a valid number
		if (Number.isNaN(appointmentId)) {
			// If the ID is not valid, throw an error with a 400 status code
			throw new AppError('Invalid appointment ID', 400)
		}

		// Initialize an empty appointment object
		let appointment: Appointment = {} as Appointment

		// Determine the role of the user making the request
		if (req.user?.role === UserRole.ADMIN) {
			// If the user is an admin, update the appointment using the admin service function
			appointment = await updateAdminAppointmentEntry(appointmentId, req.body)
		} else if (req.user?.role === UserRole.DOCTOR) {
			// If the user is a doctor, update the appointment using the doctor service function
			// Pass the doctor's ID, the appointment ID, and the update fields from the request body
			appointment = await updateDoctorAppointmentEntry(
				req.user.id,
				appointmentId,
				req.body
			)
		} else if (req.user?.role === UserRole.PATIENT) {
			// If the user is a patient, update the appointment using the patient service function
			// Pass the patient's ID, the appointment ID, and the update fields from the request body
			appointment = await updatePatientAppointmentEntry(
				req.user.id,
				appointmentId,
				req.body
			)
		}

		// Send a JSON response with the status and the updated appointment data
		res.json({ status: 'success', data: appointment })
	} catch (err) {
		// If there is an error during any of the operations, pass it to the next middleware
		next(err)
	}
}

/**
 * Deletes an appointment entry from the database.
 *
 * @throws {AppError} - If the appointment ID is not provided or is not a valid number.
 * @throws {AppError} - If there is an error during the deletion process.
 *
 */
export async function deleteAppointment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Parse the appointment ID from the request parameters and convert it to a number
		const appointmentId = parseInt(req.params.id)

		// Check if the appointment ID is a valid number
		if (Number.isNaN(appointmentId)) {
			// If the ID is not valid, throw an error with a 400 status code
			throw new AppError('Invalid appointment ID', 400)
		}

		// Call the service function to delete the appointment
		await deleteAdminAppointmentEntry(appointmentId)

		// Send a JSON response with the status and a message indicating that the appointment was deleted successfully
		res.json({
			status: 'success',
			message: 'Appointment deleted successfully'
		})
	} catch (err) {
		// If there is an error during any of the operations, pass it to the next middleware
		next(err)
	}
}
