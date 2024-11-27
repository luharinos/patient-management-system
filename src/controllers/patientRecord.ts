import { AppDataSource } from '../config/database'
import { AppError } from '../middlewares/errorHandler'
import { PatientRecord } from '../entities/PatientRecord'
import { Request, Response, NextFunction } from 'express'
import { User, UserRole } from '../entities/User'
import {
	createPatientRecordEntry,
	deletePatientRecordEntry,
	getAllPatientRecordEntries,
	getDoctorPatientRecordEntries,
	getPatientRecordEntry,
	updatePatientRecordEntry
} from '../services/patientRecord'

/**
 * Creates a new patient record entry for a given user ID.
 *
 * @throws {AppError} If the User ID is not provided or if the User ID refers to a user that doesn't exist in the system
 * @throws {AppError} If a patient record already exists for the given User ID
 *
 */
export async function createPatientRecord(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Extract patientId from the request body
		const { patientId } = req.body

		// Check if the patientId is provided in the request
		if (!patientId) {
			// If not, throw an error indicating that the User ID is required
			throw new AppError('User ID is required', 400)
		}

		// Get the repository for the User entity
		const userRepository = AppDataSource.getRepository(User)

		// Retrieve the user from the database using the provided patientId
		const user = await userRepository.findOne({ where: { id: patientId } })

		// Check if the user exists in the database
		if (!user) {
			// If not, throw an error indicating the patient doesn't exist in the system
			throw new AppError("Patient doesn't exist in system", 404)
		}

		// Get the repository for the PatientRecord entity
		const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

		// Check if a patient record already exists for this user
		const patient = await patientRecordRepository.findOne({
			where: { user: { id: patientId } },
			relations: ['user'] // Include related user information
		})

		// If a patient record already exists, throw an error
		if (patient) {
			throw new AppError('Patient record already exists', 409)
		}

		// Create a new patient record entry in the database
		const patientRecord = await createPatientRecordEntry(patientId, req.body)

		// Send a success response with the newly created patient record
		res.json({ status: 'success', data: patientRecord })
	} catch (err) {
		// Pass any errors to the next error handling middleware
		next(err)
	}
}

/**
 * Retrieves patient records based on the role of the user making the request.
 *
 * - Admin users can access all patient records.
 * - Doctors can access the records of their own patients.
 * - Patients can access their own medical record.
 *
 * @throws {AppError} - If there is an error during the retrieval process.
 *
 */
export async function getPatientRecord(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// User role based access control
		const { role } = req.user as User

		// Get all patient records if admin
		let patientRecords: PatientRecord[] = []
		if (role === UserRole.ADMIN) {
			patientRecords = await getAllPatientRecordEntries()
		}
		// Get doctor's patient records if doctor
		else if (role === UserRole.DOCTOR) {
			const doctorId = req.user?.id as number
			patientRecords = await getDoctorPatientRecordEntries(doctorId)
		}
		// Get the patient's own record if patient
		else if (role === UserRole.PATIENT) {
			const patientId = req.user?.id as number
			patientRecords = [
				(await getPatientRecordEntry(patientId)) as PatientRecord
			]
		}

		// Send the patient records in the response
		res.json({ status: 'success', data: patientRecords })
	} catch (err) {
		// Pass any errors to the next error handling middleware
		next(err)
	}
}

/**
 * Updates a patient record entry with the provided information.
 *
 * @throws {AppError} - If the patient ID is not provided or is not a valid number.
 * @throws {AppError} - If the user is not authorized to update the patient record.
 * @throws {AppError} - If there is an error during the update process.
 *
 */
export async function updatePatientRecord(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Get the patient ID from the request URL parameter
		const { id: patientId } = req.params

		// Call the service to update the patient record
		// Pass the patient ID, the updates, the user's role, and the doctor ID if applicable
		const patientRecord: PatientRecord = await updatePatientRecordEntry(
			parseInt(patientId),
			req.body,
			req.user?.role as UserRole,
			req.user?.id
		)

		// Send the updated patient record in the response
		res.json({ status: 'success', data: patientRecord })
	} catch (err) {
		// If there's an error, pass it to the next error handling middleware
		next(err)
	}
}

/**
 * Deletes a patient record entry from the database.
 *
 * @throws {AppError} - If the patient ID is not provided or is not a valid number.
 * @throws {AppError} - If there is an error during the deletion process.
 *
 */
export async function deletePatientRecord(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		// Get the patient ID from the request URL parameter
		const { id: patientId } = req.params

		// Call the service to delete the patient record
		await deletePatientRecordEntry(parseInt(patientId))

		// Send a success message in the response
		res.json({
			status: 'success',
			message: 'Patient record deleted successfully'
		})
	} catch (err) {
		// If there's an error, pass it to the next error handling middleware
		next(err)
	}
}
