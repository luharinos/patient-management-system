import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './config/database'
import userRouter from './routes/user'
import { errorHandler } from './middlewares/errorHandler'
import appointmentRouter from './routes/appointment'
import patientRecordRouter from './routes/patientRecord'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/appointment', appointmentRouter)
app.use('/api/patient-record', patientRecordRouter)
app.use('/api/user', userRouter)

app.use(errorHandler)

AppDataSource.initialize()
	.then(() => {
		console.log('Database connected successfully!')
		app.listen(process.env.PORT, () => {
			console.log('Server is running on port 3000')
		})
	})
	.catch(error => {
		console.log(error)
	})
