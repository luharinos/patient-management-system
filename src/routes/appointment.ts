import { authenticate, authorize } from '../middlewares/auth'
import { Router } from 'express'
import {
	createAppointment,
	deleteAppointment,
	getAppointment,
	updateAppointment
} from '../controllers/appointment'

const appointmentRouter = Router()

const appointmentAcl = {
	create: ['admin', 'patient'],
	delete: ['admin', 'patient']
}
appointmentRouter.post(
	'/',
	authenticate,
	authorize(appointmentAcl.create),
	createAppointment
)
appointmentRouter.get('/', authenticate, getAppointment)
appointmentRouter.put('/:id', authenticate, updateAppointment)
appointmentRouter.delete(
	'/:id',
	authenticate,
	authorize(appointmentAcl.delete),
	deleteAppointment
)

export default appointmentRouter
