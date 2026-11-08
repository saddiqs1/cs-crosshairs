import { DB } from '@my-types/generated/database'
import { createPool } from '@vercel/postgres'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

const getDb = () => {
	let db: Kysely<DB> | undefined = undefined
	const { DATABASE_URL, NODE_ENV } = process.env

	if (NODE_ENV === 'production') {
		db = new Kysely<DB>({
			dialect: new PostgresDialect({
				pool: async () => {
					const options = {
						connectionString: DATABASE_URL,
						ssl: true,
					}
					const pool = createPool(options)
					return {
						options,
						connect: () => pool.connect(),
						end: () => pool.end(),
					}
				},
			}),
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
