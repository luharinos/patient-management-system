import { Router } from 'express'
import {
	createPatientRecord,
	getPatientRecord,
	updatePatientRecord,
	deletePatientRecord
} from '../controllers/patientRecord'
import { authenticate, authorize } from '../middlewares/auth'

const patientRecordRouter = Router()

const patientRecordAcl = {
	create: ['admin', 'doctor'],
	update: ['admin', 'patient'],
	delete: ['admin']
}

patientRecordRouter.post(
	'/create',
	authenticate,
	authorize(patientRecordAcl.create),
	createPatientRecord
)
patientRecordRouter.get('/get/:id', authenticate, getPatientRecord)
patientRecordRouter.put(
	'/update/:id',
	authenticate,
	authorize(patientRecordAcl.update),
	updatePatientRecord
)
patientRecordRouter.delete(
	'/delete/:id',
	authenticate,
	authorize(patientRecordAcl.delete),
	deletePatientRecord
)

export default patientRecordRouter
