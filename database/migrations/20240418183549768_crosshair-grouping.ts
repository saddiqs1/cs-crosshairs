import { Kysely } from 'kysely'
import { DB } from '../database'

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('crosshair_groups')
		.ifNotExists()
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('user_id', 'integer', (col) => col.references('users.id'))
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('order', 'integer', (col) => col.notNull())
		.execute()

	await db.schema
		.alterTable('crosshairs')
		.addColumn('crosshair_group_id', 'integer', (col) =>
			col.references('crosshair_groups.id')
		)
		.addColumn('order', 'integer', (col) => col.notNull().defaultTo(-1))
		.execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema
		.alterTable('crosshairs')
		.dropColumn('crosshair_group_id')
		.dropColumn('order')
		.execute()

	await db.schema.dropTable('crosshair_groups').ifExists().execute()
}
