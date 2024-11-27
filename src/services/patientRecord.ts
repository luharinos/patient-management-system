// import {
// 	patientRecordRepository,
// 	PatientRecord
// } from '../entities/PatientRecord'
// import { appointmentRepository } from '../entities/Appointment'
// import { UserRole } from '../entities/User'
// import { AppError } from '../middlewares/errorHandler'

// export async function createPatientRecordEntry(
// 	userId: number,
// 	data: Partial<PatientRecord>
// ) {
// 	const newRecord = patientRecordRepository.create({
// 		user: { id: userId },
// 		...data
// 	})
// 	return await patientRecordRepository.save(newRecord)
// }

// export async function getAllPatientRecordEntries() {
// 	return await patientRecordRepository.find({ relations: ['user'] })
// }

// export async function getDoctorPatientRecordEntries(doctorId: number) {
// 	const appointments = await appointmentRepository.find({
// 		where: { doctor: { id: doctorId } },
// 		relations: ['patient', 'patient.patientRecord']
// 	})

// 	return appointments.map(appointment => appointment.patient.patientRecord)
// }

// export async function getPatientRecordEntry(patientId: number) {
// 	return await patientRecordRepository.findOne({
// 		where: { user: { id: patientId } },
// 		relations: ['user']
// 	})
// }

// export async function updatePatientRecordEntry(
// 	patientId: number,
// 	updates: Partial<PatientRecord>,
// 	role: UserRole,
// 	doctorId?: number
// ) {
// 	// Define the query criteria based on role
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	let whereCondition: any = { user: { id: patientId } }

// 	if (role === UserRole.DOCTOR) {
// 		whereCondition = {
// 			user: {
// 				id: patientId,
// 				appointments: {
// 					doctor: { id: doctorId } // Ensure the doctor is assigned to the patient
// 				}
// 			}
// 		}
// 	}

// 	// Find the patient record based on the role's conditions
// 	const record = await patientRecordRepository.findOne({
// 		where: whereCondition,
// 		relations: ['user', 'user.appointments', 'user.appointments.doctor']
// 	})

// 	if (!record) {
// 		throw new AppError('Patient record not found or unauthorized', 404)
// 	}

// 	// Apply updates and save
// 	Object.assign(record, updates)
// 	return await patientRecordRepository.save(record)
// }

// export async function deletePatientRecordEntry(patientId: number) {
// 	return await patientRecordRepository.delete({ user: { id: patientId } })
// }
