import { DB } from '@my-types/generated/database'
import { createKysely } from '@vercel/postgres-kysely'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

const getDb = () => {
	let db: Kysely<DB> | undefined = undefined
	const { DATABASE_URL, NODE_ENV } = process.env

	if (NODE_ENV === 'production') {
		db = createKysely<DB>({
			connectionString: DATABASE_URL,
			ssl: true,
		})
	} else {
		db = new Kysely<DB>({
			dialect: new PostgresDialect({
				pool: new Pool({
					connectionString: DATABASE_URL,
				}),
			}),
		})
	}

	return db
}

const db = getDb()

export default db
