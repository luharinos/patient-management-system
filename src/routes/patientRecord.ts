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
	update: ['admin', 'doctor'],
	delete: ['admin']
}

patientRecordRouter.post(
	'/',
	authenticate,
	authorize(patientRecordAcl.create),
	createPatientRecord
)
patientRecordRouter.get('/', authenticate, getPatientRecord)
patientRecordRouter.put(
	'/:id',
	authenticate,
	authorize(patientRecordAcl.update),
	updatePatientRecord
)
patientRecordRouter.delete(
	'/:id',
	authenticate,
	authorize(patientRecordAcl.delete),
	deletePatientRecord
)

export default patientRecordRouter
