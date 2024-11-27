import { AppDataSource } from '../config/database'
import { AppError } from '../middlewares/errorHandler'
import { DeleteResult } from 'typeorm'
import { PatientRecord } from '../entities/PatientRecord'
import { UserRole } from '../entities/User'

/**
 * Creates a new patient record entry and saves it to the database.
 *
 * @param userId The ID of the user for which the patient record is being created.
 * @param data A partial PatientRecord object containing the fields to be saved.
 * @returns The newly created patient record with its associated user.
 */
export async function createPatientRecordEntry(
	userId: number,
	data: Partial<PatientRecord>
): Promise<PatientRecord> {
	// Get the PatientRecord repository from the database
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	// Create a new PatientRecord object with the provided data
	const newRecord = patientRecordRepository.create({
		// Associate the record with the user with the provided ID
		user: { id: userId },
		// Include any additional fields provided in the data parameter
		...data
	})

	// Save the new record to the database
	return await patientRecordRepository.save(newRecord)
}

/**
 * Retrieves all patient record entries from the database.
 *
 * @returns A promise that resolves to an array of PatientRecord objects with their associated users.
 */
export async function getAllPatientRecordEntries(): Promise<PatientRecord[]> {
	// Get the PatientRecord repository from the database
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	// Find all patient record entries in the repository
	// The 'relations' option is used to specify that the 'user' relation should be populated
	// This means that the 'user' property of each returned PatientRecord object will be populated
	// with the associated User object
	return await patientRecordRepository.find({
		relations: ['user']
	})
}

/**
 * Retrieves all patient record entries associated with a specific doctor from the database.
 *
 * @param doctorId The ID of the doctor whose patient records are being retrieved.
 * @returns A promise that resolves to an array of PatientRecord objects with their associated users.
 */
export async function getDoctorPatientRecordEntries(
	doctorId: number
): Promise<PatientRecord[]> {
	// Get the repository for the PatientRecord entity from the data source
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	// Query the repository to find all patient records that are associated with appointments
	// where the specified doctor is involved. The 'where' clause filters the patient records
	// based on the doctorId present in their appointments. The 'relations' option specifies
	// that the related user information should be included in the results.
	const patientRecords = await patientRecordRepository.find({
		where: { user: { patientAppointments: { doctorId } } },
		relations: ['user'] // Retrieves associated user details for each patient record
	})

	// Return the list of patient records found
	return patientRecords
}

/**
 * Retrieves a single patient record entry from the database based on the
 * provided patient ID.
 *
 * @param patientId The ID of the patient whose record is being retrieved.
 * @returns A promise that resolves to a PatientRecord object with its associated user.
 */
export async function getPatientRecordEntry(
	patientId: number
): Promise<PatientRecord | null> {
	// Obtain the repository for the PatientRecord entity from the data source
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	// Use the repository to find a single patient record that matches the provided patient ID
	// The 'where' clause filters patient records by the ID of the user associated with the record
	// The 'relations' option specifies that the related user information should be included in the result
	return await patientRecordRepository.findOne({
		where: { user: { id: patientId } }, // Filter patient records by user ID
		relations: ['user'] // Retrieve associated user details
	})
}

/**
 * Updates a patient record entry with the provided information.
 *
 * @param patientId The ID of the patient whose record is being updated.
 * @param updates A partial PatientRecord object containing the fields to be updated.
 * @param role The role of the user performing the update.
 * @param doctorId The ID of the doctor performing the update, if applicable.
 * @returns A promise that resolves to the updated patient record with its associated user.
 */
export async function updatePatientRecordEntry(
	patientId: number,
	updates: Partial<PatientRecord>,
	role: UserRole,
	doctorId?: number
): Promise<PatientRecord> {
	// Determine the query criteria based on the user's role
	// We need to ensure that the doctor is assigned to the patient if the role is DOCTOR
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let whereCondition: any = { user: { id: patientId } } // Default to query by patient ID

	if (role === UserRole.DOCTOR) {
		// If the role is DOCTOR, we need to ensure that the doctor is assigned to the patient
		// This is done by adding a filter to the query that ensures the doctor ID is present in the patient's appointments
		whereCondition = {
			user: {
				id: patientId,
				patientAppointments: {
					doctorId // Ensure the doctor is assigned to the patient
				}
			}
		}
	}

	// Find the patient record based on the query criteria
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	const record = await patientRecordRepository.findOne({
		where: whereCondition,
		relations: ['user'] // Retrieve associated user details
	})

	// If the record is not found, throw an error
	if (!record) {
		throw new AppError('Patient record not found or unauthorized', 404)
	}

	// Apply the updates to the patient record
	// We use Object.assign() to shallow-merge the updates into the record object
	// This does not modify the original record object, but instead creates a new object with the updated properties
	Object.assign(record, updates)

	// Save the updated record to the database
	// We use the save() method to update the record in the database
	// This method returns a promise that resolves to the updated record
	return await patientRecordRepository.save(record)
}

/**
 * Deletes a patient record entry from the database.
 *
 * @param patientId The ID of the patient whose record is being deleted.
 * @returns A promise that resolves to a DeleteResult object indicating the outcome of the operation.
 */
export async function deletePatientRecordEntry(
	patientId: number
): Promise<DeleteResult> {
	// Get the repository for the PatientRecord entity from the data source
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	// Use the repository to delete the patient record entry that belongs to the specified patient
	// The delete() method removes the record with the matching user ID
	// It returns a promise that resolves to a DeleteResult object which indicates the outcome of the operation
	return await patientRecordRepository.delete({ user: { id: patientId } })
}
