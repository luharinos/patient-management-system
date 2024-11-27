import { Router } from 'express'
// import {
// 	createAppointment,
// 	getAppointment,
// 	updateAppointment,
// 	deleteAppointment
// } from '../controllers/appointment'
import { authenticate, authorize } from '../middlewares/auth'

const appointmentRouter = Router()

const appointmentAcl = {
	create: ['admin', 'patient'],
	delete: ['admin', 'patient']
}

// appointmentRouter.post(
// 	'/create',
// 	authenticate,
// 	authorize(appointmentAcl.create),
// 	createAppointment
// )
// appointmentRouter.get('/get/:id', authenticate, getAppointment)
// appointmentRouter.put('/update/:id', authenticate, updateAppointment)
// appointmentRouter.delete(
// 	'/delete/:id',
// 	authenticate,
// 	authorize(appointmentAcl.delete),
// 	deleteAppointment
// )

export default appointmentRouter
