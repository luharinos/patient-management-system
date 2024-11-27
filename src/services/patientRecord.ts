import { PatientRecord } from '../entities/PatientRecord'
import { Appointment } from '../entities/Appointment'
import { UserRole } from '../entities/User'
import { AppDataSource } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

export async function createPatientRecordEntry(
	userId: number,
	data: Partial<PatientRecord>
) {
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)
	const newRecord = patientRecordRepository.create({
		user: { id: userId },
		...data
	})
	return await patientRecordRepository.save(newRecord)
}

export async function getAllPatientRecordEntries() {
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	return await patientRecordRepository.find({
		relations: ['user']
	})
}

export async function getDoctorPatientRecordEntries(doctorId: number) {
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)
	const patientRecords = await patientRecordRepository.find({
		where: { user: { patientAppointments: { doctorId } } },
		relations: ['user']
	})

	return patientRecords
}

export async function getPatientRecordEntry(patientId: number) {
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)
	return await patientRecordRepository.findOne({
		where: { user: { id: patientId } },
		relations: ['user']
	})
}

export async function updatePatientRecordEntry(
	patientId: number,
	updates: Partial<PatientRecord>,
	role: UserRole,
	doctorId?: number
) {
	// Define the query criteria based on role
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let whereCondition: any = { user: { id: patientId } }

	if (role === UserRole.DOCTOR) {
		whereCondition = {
			user: {
				id: patientId,
				patientAppointments: {
					doctorId
				} // Ensure the doctor is assigned to the patient
			}
		}
	}

	// Find the patient record based on the role's conditions
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	const record = await patientRecordRepository.findOne({
		where: whereCondition,
		relations: ['user']
	})

	if (!record) {
		throw new AppError('Patient record not found or unauthorized', 404)
	}

	// Apply updates and save
	Object.assign(record, updates)
	return await patientRecordRepository.save(record)
}

export async function deletePatientRecordEntry(patientId: number) {
	const patientRecordRepository = AppDataSource.getRepository(PatientRecord)

	return await patientRecordRepository.delete({ user: { id: patientId } })
}
