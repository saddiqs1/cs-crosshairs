const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const timestamp = new Date().toISOString().replace(/\D/g, '') // e.g. 2023-06-08T20:31:08.111Z --> 20230608203108111
const migrationName = process.argv[2]
const migrationFileName = `${timestamp}_${migrationName}.ts`
const migrationContent = `import { Kysely } from 'kysely';
import { DB } from "../database";

export async function up(db: Kysely<DB>): Promise<void> {
	// Migration Code
}

export async function down(db: Kysely<DB>): Promise<void> {
	// Migration Code
}
`

const migrationsDir = path.join(__dirname, '..', 'database', 'migrations')
const migrationFilePath = path.join(migrationsDir, migrationFileName)

if (!fs.existsSync(migrationsDir)) {
	fs.mkdirSync(migrationsDir, { recursive: true })
}

fs.writeFileSync(migrationFilePath, migrationContent)

console.log(chalk.green(`✓ Created migration file: ${migrationFilePath}`))
