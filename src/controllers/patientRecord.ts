// import { Request, Response, NextFunction } from 'express'
// import {
// 	PatientRecord,
// 	patientRecordRepository
// } from '../entities/PatientRecord'
// import { AppError } from '../middlewares/errorHandler'
// import { userRepository, User, UserRole } from '../entities/User'
// import {
// 	createPatientRecordEntry,
// 	deletePatientRecordEntry,
// 	getAllPatientRecordEntries,
// 	getDoctorPatientRecordEntries,
// 	getPatientRecordEntry,
// 	updatePatientRecordEntry
// } from '../services/patientRecord'

// export async function createPatientRecord(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ): Promise<void> {
// 	try {
// 		const { patientId } = req.body

// 		if (!patientId) {
// 			throw new AppError('User ID is required', 400)
// 		}
// 		const user = await userRepository.findOne({ where: { id: patientId } })
// 		if (!user) {
// 			throw new AppError("Patient doesn't exist in system", 404)
// 		}
// 		const patient = await patientRecordRepository.findOne({
// 			where: { user: patientId }
// 		})
// 		if (patient) {
// 			throw new AppError('Patient record already exists', 409)
// 		}

// 		await createPatientRecordEntry(patientId, req.body)
// 	} catch (err) {
// 		next(err)
// 	}
// }

// export async function getPatientRecord(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ): Promise<void> {
// 	try {
// 		const { role } = req.user as User

// 		let patientRecords: PatientRecord[] = []
// 		if (role == UserRole.ADMIN) {
// 			patientRecords = await getAllPatientRecordEntries()
// 		} else if (role == UserRole.DOCTOR) {
// 			const doctorId = req.user?.id as number
// 			patientRecords = await getDoctorPatientRecordEntries(doctorId)
// 		} else if (role == UserRole.PATIENT) {
// 			const patientId = req.user?.id as number
// 			patientRecords = [
// 				(await getPatientRecordEntry(patientId)) as PatientRecord
// 			]
// 		}

// 		res.json(patientRecords)
// 	} catch (err) {
// 		next(err)
// 	}
// }

// export async function updatePatientRecord(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ): Promise<void> {
// 	try {
// 		const { id: patientId } = req.params

// 		const patientRecord: PatientRecord = await updatePatientRecordEntry(
// 			parseInt(patientId),
// 			req.body,
// 			req.user?.role as UserRole
// 		)
// 		res.json(patientRecord)
// 	} catch (err) {
// 		next(err)
// 	}
// }

// export async function deletePatientRecord(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ): Promise<void> {
// 	try {
// 		const { id } = req.params
// 		await deletePatientRecordEntry(parseInt(id))
// 		res.json({ message: 'Deleted successfully' })
// 	} catch (err) {
// 		next(err)
// 	}
// }
