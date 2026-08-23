import chalk from 'chalk'
import { getDb, getEnv } from './utils'
import { Kysely, sql } from 'kysely'
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
		await sql`
			TRUNCATE TABLE crosshairs, crosshair_groups, users
			RESTART IDENTITY CASCADE
		`.execute(trx)
		console.log(chalk.greenBright(`\nExisting application data cleared.`))

		const user = await trx
			.insertInto('users')
			.values({ steam_uid: steamId64 })
			.returning('id')
			.executeTakeFirstOrThrow()
		console.log(chalk.greenBright(`User ${steamId64} added.`))

		if (insertCrosshairs.toLowerCase() === 'y') {
			const groups = await trx
				.insertInto('crosshair_groups')
				.values([
					{ user_id: user.id, name: 'Favourites', order: 0 },
					{ user_id: user.id, name: 'Experimental', order: 1 },
				])
				.returning(['id', 'name'])
				.execute()

			const favourites = groups.find(
				(group) => group.name === 'Favourites'
			)
			const experimental = groups.find(
				(group) => group.name === 'Experimental'
			)

			if (!favourites || !experimental) {
				throw new Error('Failed to create crosshair groups')
			}

			await trx
				.insertInto('crosshairs')
				.values([
					{
						user_id: user.id,
						name: 'ropz',
						crosshair: 'CSGO-Yyrjv-BnAsU-L3hrr-SfmLf-6G3tJ',
						crosshair_group_id: favourites.id,
						order: 0,
					},
					{
						user_id: user.id,
						name: 'XANTARES',
						crosshair: 'CSGO-xbpe2-E24RJ-YXNuO-pQvt8-ppNAK',
						crosshair_group_id: favourites.id,
						order: 1,
					},
					{
						user_id: user.id,
						name: 's1mple',
						crosshair: 'CSGO-EiXND-5jUGt-Ru2cm-LwVKc-u6GSQ',
						crosshair_group_id: favourites.id,
						order: 2,
					},
					{
						user_id: user.id,
						name: 'Blue Small',
						crosshair: 'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM',
						crosshair_group_id: experimental.id,
						order: 0,
					},
					{
						user_id: user.id,
						name: 'Yellow Thick',
						crosshair: 'CSGO-5fKKR-Eab4o-viAxH-Xvx38-T3SKF',
						crosshair_group_id: experimental.id,
						order: 1,
					},
					{
						user_id: user.id,
						name: 'Volt',
						crosshair: 'CSGO-7kpMK-6tkqO-PM6xU-FMUvK-htuWK',
						crosshair_group_id: experimental.id,
						order: 2,
					},
					{
						user_id: user.id,
						name: 'Heap',
						crosshair: 'CSGO-RoxEW-xZqYv-nzUQZ-UVtvi-cV6uC',
						crosshair_group_id: null,
						order: 0,
					},
					{
						user_id: user.id,
						name: 'Yellow Dot',
						crosshair: 'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A',
						crosshair_group_id: null,
						order: 1,
					},
					{
						user_id: user.id,
						name: 'Classic Green',
						crosshair: 'CSGO-78PT7-mHExG-UGt7C-HAhdB-GxuWK',
						crosshair_group_id: null,
						order: 2,
					},
				])
				.execute()

			console.log(chalk.greenBright(`2 groups and 9 crosshairs added.\n`))
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
