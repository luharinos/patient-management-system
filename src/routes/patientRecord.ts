import { Router } from 'express'
import {
	createPatientRecord,
	getPatientRecord,
	updatePatientRecord,
	deletePatientRecord
} from '../controllers/patientRecord'

const patientRecordRouter = Router()

patientRecordRouter.post('/create', createPatientRecord)
patientRecordRouter.get('/get/:id', getPatientRecord)
patientRecordRouter.put('/update/:id', updatePatientRecord)
patientRecordRouter.delete('/delete/:id', deletePatientRecord)

export default patientRecordRouter
