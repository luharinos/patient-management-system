import { AppDataSource } from '../config/database'
import { Appointment } from '../entities/Appointment'
import { AppError } from '../middlewares/errorHandler'
import { DeleteResult } from 'typeorm'

/**
 * Creates a new appointment entry.
 *
 * @param patientId The ID of the patient for which the appointment is being made.
 * @param doctorId The ID of the doctor with whom the appointment is being made.
 * @param date The date of the appointment.
 * @param time The time of the appointment.
 * @param description A description of the appointment (eg. "checkup").
 * @returns The newly created appointment.
 * @throws AppError If the patient or doctor IDs are invalid.
 */
export async function createAppointmentEntry(
	patientId: number,
	doctorId: number,
	date: Date,
	time: string,
	description: string
): Promise<Appointment> {
	// Get the Appointment repository
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Try to create a new appointment entry
	try {
		// Create a new Appointment object
		const newAppointment = appointmentRepository.create({
			// Set the date
			date,
			// Set the time
			time,
			// Set the description
			description,
			// Set the patient
			patient: { id: patientId },
			// Set the doctor
			doctor: { id: doctorId }
		})

		// Save the new appointment to the database
		return await appointmentRepository.save(newAppointment)
	} catch (_err) {
		// If there was an error, throw an AppError with a message that the patient or doctor ID is invalid
		throw new AppError('Invalid patient or doctor', 400)
	}
}

/**
 * Retrieves all appointment entries from the database.
 *
 * @returns A promise that resolves to an array of all appointments with their associated patient and doctor relations.
 */
export async function getAllAppointmentEntries(): Promise<Appointment[]> {
	// Get the Appointment repository from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Find all appointment entries in the repository, including related patient and doctor entities
	return await appointmentRepository.find({
		relations: ['patient', 'doctor'] // Specify relations to retrieve patient and doctor details
	})
}

/**
 * Retrieves all appointment entries for a specific doctor from the database.
 *
 * @param doctorId The ID of the doctor whose appointments are being retrieved.
 * @returns A promise that resolves to an array of appointments with their associated patient relations.
 */
export async function getDoctorAppointmentEntries(
	doctorId: number
): Promise<Appointment[]> {
	// Obtain the repository for the Appointment entity from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Use the repository to find all appointments that belong to the specified doctor
	// The 'where' clause filters appointments by the doctor's ID
	// The 'relations' option specifies that the related patient information should be included in the results
	return await appointmentRepository.find({
		where: { doctor: { id: doctorId } },
		relations: ['patient'] // Retrieves associated patient details for each appointment
	})
}

/**
 * Retrieves all appointment entries for a specific patient from the database.
 *
 * @param patientId The ID of the patient whose appointments are being retrieved.
 * @returns A promise that resolves to an array of appointments with their associated doctor relations.
 */
export async function getPatientAppointmentEntries(
	patientId: number
): Promise<Appointment[]> {
	// Get the Appointment repository from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Use the repository to find all appointments that belong to the specified patient
	// The 'where' clause filters appointments by the patient's ID
	// The 'relations' option specifies that the related doctor information should be included in the results
	return await appointmentRepository.find({
		where: { patient: { id: patientId } }, // Filter appointments by the patient's ID
		relations: ['doctor'] // Retrieves associated doctor details for each appointment
	})
}

/**
 * Updates an appointment entry that belongs to a specific patient.
 *
 * @param patientId The ID of the patient who owns the appointment.
 * @param appointmentId The ID of the appointment to be updated.
 * @param updates A partial Appointment object containing the fields to be updated.
 * @returns The updated appointment.
 * @throws AppError If the appointment does not exist or if the patient is not authorized to update it.
 */
export async function updatePatientAppointmentEntry(
	patientId: number,
	appointmentId: number,
	updates: Partial<Appointment>
): Promise<Appointment> {
	// Get the Appointment repository from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Find the appointment that belongs to the specified patient
	// The 'where' clause filters appointments by the patient's ID and the appointment ID
	// If the appointment is not found, throw an AppError with a 404 status code
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId, patient: { id: patientId } }
	})

	if (!appointment)
		throw new AppError('Appointment not found or unauthorized', 404)

	// Update the appointment with the provided updates
	// The Object.assign() method is used to shallow-merge the updates into the appointment object
	Object.assign(appointment, updates)

	// Save the updated appointment to the database
	// The save() method is used to update the appointment in the database
	return await appointmentRepository.save(appointment)
}

/**
 * Updates an appointment entry that belongs to a specific doctor.
 *
 * @param doctorId The ID of the doctor who owns the appointment.
 * @param appointmentId The ID of the appointment to be updated.
 * @param updates A partial Appointment object containing the fields to be updated.
 * @returns The updated appointment.
 * @throws AppError If the appointment does not exist or if the doctor is not authorized to update it.
 */
export async function updateDoctorAppointmentEntry(
	doctorId: number,
	appointmentId: number,
	updates: Partial<Appointment>
): Promise<Appointment> {
	// Get the Appointment repository from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Find the appointment that belongs to the specified doctor
	// The 'where' clause filters appointments by the doctor's ID and the appointment ID
	// If the appointment is not found, throw an AppError with a 404 status code
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId, doctor: { id: doctorId } }
	})

	// If the appointment does not exist or is not authorized, throw an error
	if (!appointment)
		throw new AppError('Appointment not found or unauthorized', 404)

	// Update the appointment with the provided updates
	// The Object.assign() method is used to shallow-merge the updates into the appointment object
	Object.assign(appointment, updates)

	// Save the updated appointment to the database
	// The save() method is used to update the appointment in the database
	return await appointmentRepository.save(appointment)
}

/**
 * Updates an appointment entry as an administrator.
 *
 * @param appointmentId The ID of the appointment to be updated.
 * @param updates A partial Appointment object containing the fields to be updated.
 * @returns The updated appointment.
 * @throws AppError If the appointment does not exist.
 */
export async function updateAdminAppointmentEntry(
	appointmentId: number,
	updates: Partial<Appointment>
): Promise<Appointment> {
	// Get the Appointment repository from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Find the appointment that matches the specified ID
	// If the appointment is not found, throw an AppError with a 404 status code
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId }
	})

	// If the appointment does not exist, throw an error
	if (!appointment) throw new AppError('Appointment not found', 404)

	// Update the appointment with the provided updates
	// The Object.assign() method is used to shallow-merge the updates into the appointment object
	// This does not modify the original appointment object, but instead creates a new object with the updated properties
	Object.assign(appointment, updates)

	// Save the updated appointment to the database
	// The save() method is used to update the appointment in the database
	// This method returns a promise that resolves to the updated appointment
	return await appointmentRepository.save(appointment)
}

/**
 * Deletes an appointment entry as an administrator.
 *
 * @param appointmentId The ID of the appointment to be deleted.
 * @returns A DeleteResult object indicating the outcome of the operation.
 */
export async function deleteAdminAppointmentEntry(
	appointmentId: number
): Promise<DeleteResult> {
	// Obtain the repository for the Appointment entity from the data source
	const appointmentRepository = AppDataSource.getRepository(Appointment)

	// Attempt to delete the appointment with the specified ID from the database
	// The delete() method removes the record with the matching ID
	// It returns a DeleteResult object which indicates the outcome of the operation
	return await appointmentRepository.delete({ id: appointmentId })
}
