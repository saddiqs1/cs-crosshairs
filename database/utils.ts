import { Pool } from 'pg'
import dotenv from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely'
import chalk from 'chalk'
import { DB } from './database'
import { createKysely } from '@vercel/postgres-kysely'

export type Env = {
	databaseUrl: string
	appEnv?: string
}

export function getEnv(): Env {
	dotenv.config({ path: '.env.local' })

	const { DATABASE_URL, NODE_ENV } = process.env

	if (typeof DATABASE_URL !== 'string')
		throw Error(
			`databaseUrl is set to an incorrect value of ${DATABASE_URL}`
		)

	if (NODE_ENV !== 'production' && !DATABASE_URL.includes('localhost')) {
		const error = `CANNOT INTERACT WITH DB ${DATABASE_URL} IN ENVIRONMENT ${NODE_ENV} LOCALLY`
		console.error(chalk.redBright(error))
		throw new Error(error)
	}

	return {
		databaseUrl: DATABASE_URL,
		appEnv: NODE_ENV,
	}
}

export function getDb(env: Env) {
	console.log(chalk.blueBright(`Connecting to ${env.databaseUrl}...`))
	let db: Kysely<DB> | undefined = undefined

	if (env.appEnv === 'production') {
		db = createKysely<DB>({
			connectionString: env.databaseUrl,
		})
		Object.defineProperty(
			db.getExecutor().adapter,
			'supportsTransactionalDdl',
			() => false
		)
	} else {
		db = new Kysely<DB>({
			dialect: new PostgresDialect({
				pool: new Pool({
					connectionString: env.databaseUrl,
				}),
			}),
		})
	}

	return db
}
