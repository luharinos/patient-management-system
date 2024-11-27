import { Appointment } from '../entities/Appointment'
import { AppDataSource } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

// create appointments
export async function createAppointmentEntry(
	patientId: number,
	doctorId: number,
	date: Date,
	time: string,
	description: string
) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	const newAppointment = appointmentRepository.create({
		date,
		time,
		description,
		patient: { id: patientId },
		doctor: { id: doctorId }
	})
	return await appointmentRepository.save(newAppointment)
}

// read all appointments
export async function getAllAppointmentEntries() {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	return await appointmentRepository.find({
		relations: ['patient', 'doctor']
	})
}

export async function getDoctorAppointmentEntries(doctorId: number) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	return await appointmentRepository.find({
		where: { doctor: { id: doctorId } },
		relations: ['patient']
	})
}

export async function getPatientAppointmentEntries(patientId: number) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	return await appointmentRepository.find({
		where: { patient: { id: patientId } },
		relations: ['doctor']
	})
}

export async function updatePatientAppointmentEntry(
	patientId: number,
	appointmentId: number,
	updates: Partial<Appointment>
) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId, patient: { id: patientId } }
	})

	if (!appointment)
		throw new AppError('Appointment not found or unauthorized', 404)
	Object.assign(appointment, updates)
	return await appointmentRepository.save(appointment)
}

export async function updateDoctorAppointmentEntry(
	doctorId: number,
	appointmentId: number,
	updates: Partial<Appointment>
) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId, doctor: { id: doctorId } }
	})

	if (!appointment)
		throw new AppError('Appointment not found or unauthorized', 404)
	Object.assign(appointment, updates)
	return await appointmentRepository.save(appointment)
}

export async function updateAdminAppointmentEntry(
	appointmentId: number,
	updates: Partial<Appointment>
) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	const appointment = await appointmentRepository.findOne({
		where: { id: appointmentId }
	})
	if (!appointment) throw new AppError('Appointment not found', 404)
	Object.assign(appointment, updates)
	return await appointmentRepository.save(appointment)
}

export async function deleteAdminAppointmentEntry(appointmentId: number) {
	const appointmentRepository = AppDataSource.getRepository(Appointment)
	return await appointmentRepository.delete({ id: appointmentId })
}
