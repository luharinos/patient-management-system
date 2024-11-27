import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: (process.env.database as string) || 'database.sqlite',
	synchronize: true, // Automatically updates the schema. Set false in production.
	logging: false,
	entities: [__dirname + '/../entities/*.{js,ts}'],
	migrations: [__dirname + '/../migrations/*.{js,ts}'],
	subscribers: []
})
