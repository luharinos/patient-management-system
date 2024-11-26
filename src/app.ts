import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './config/database'

dotenv.config()

const app = express()

app.use(express.json())

AppDataSource.initialize()
	.then(() => {
		console.log('Database connected successfully!')
		app.listen(3000, () => {
			console.log('Server is running on port 3000')
		})
	})
	.catch(error => {
		console.log(error)
	})
