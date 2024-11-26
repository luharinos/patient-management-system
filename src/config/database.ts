import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true, // Automatically updates the schema. Set false in production.
	logging: true,
	entities: [__dirname + '/../entities/*.ts'],
	migrations: [__dirname + '/../migrations/*.ts'],
	subscribers: []
})
