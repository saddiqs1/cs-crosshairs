import chalk from 'chalk'
import { getDb, getEnv } from './utils'
import { Kysely } from 'kysely'
import { DB } from './database'
import { createInterface } from 'readline'

async function main(db: Kysely<DB>) {
	console.log(chalk.blue(`Started Seeding...\n`))

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	const askQuestion = (query: string): Promise<string> => {
		return new Promise((resolve) =>
			rl.question(chalk.magenta(`> ${query}`), resolve)
		)
	}

	const steamId64 = await askQuestion('Enter steamid64 value of user: ')
	const insertCrosshairs = await askQuestion(
		'Do you want to enter example crosshairs? (y/n): '
	)

	rl.close()

	await db.transaction().execute(async (trx) => {
		// Any seeding happens here.
		await db
			.insertInto('users')
			.values({ id: 1, steam_uid: steamId64 })
			.executeTakeFirstOrThrow()
		console.log(chalk.greenBright(`\nUser ${steamId64} added.`))

		if (insertCrosshairs.toLowerCase() === 'y') {
			const user = await db
				.selectFrom('users')
				.select('id')
				.where('steam_uid', '=', steamId64)
				.executeTakeFirstOrThrow()

			await db
				.insertInto('crosshairs')
				.values([
					{
						user_id: user.id,
						name: 'Blue Small',
						crosshair: 'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM',
					},
					{
						user_id: user.id,
						name: 'Yellow Thick',
						crosshair: 'CSGO-5fKKR-Eab4o-viAxH-Xvx38-T3SKF',
					},
				])
				.execute()

			console.log(chalk.greenBright(`Crosshairs added.\n`))
		}
	})

	console.log(chalk.greenBright(`Finished Seeding!`))
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
