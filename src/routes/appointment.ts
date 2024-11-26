import { Router } from 'express'
import {
	createAppointment,
	getAppointment,
	updateAppointment,
	deleteAppointment
} from '../controllers/appointment'

const appointmentRouter = Router()

appointmentRouter.post('/create', createAppointment)
appointmentRouter.get('/get/:id', getAppointment)
appointmentRouter.put('/update/:id', updateAppointment)
appointmentRouter.delete('/delete/:id', deleteAppointment)

export default appointmentRouter
