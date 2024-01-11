import chalk from 'chalk'
import { getDb, getEnv } from './utils'
import { Kysely } from 'kysely'
import { DB } from './database'

async function main(db: Kysely<DB>) {
	console.log(chalk.gray(`Seeding currently unimplemented...`))

	/*
	TODO: Implement below. Take developer prompt to create a user, with either preset crosshair options or allow them to enter in some.

	console.log(chalk.blue(`Starting Seed...`))

	await db.transaction().execute(async (trx) => {
		// Any seeding happens here.
	})

	console.log(chalk.greenBright(`Finished Seeding!`))
	*/
}

const env = getEnv()
const db = getDb(env)
main(db)
	.then(async () => await db.destroy())
	.catch(async (e) => {
		console.error(e)
		await db.destroy()
		process.exit(1)
	})
