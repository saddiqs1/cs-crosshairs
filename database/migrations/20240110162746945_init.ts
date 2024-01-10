import { Kysely, sql } from 'kysely'
import { DB } from '../database'

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('users')
		.ifNotExists()
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('steam_uid', 'text', (col) => col.unique())
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('latest_login_at', 'timestamp')
		.execute()

	await db.schema
		.createTable('crosshairs')
		.ifNotExists()
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('user_id', 'integer', (col) => col.references('users.id'))
		.addColumn('crosshair', 'text', (col) => col.notNull())
		.execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('crosshairs').ifExists().execute()
	await db.schema.dropTable('users').ifExists().execute()
}
