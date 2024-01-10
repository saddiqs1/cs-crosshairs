import * as path from 'path';
import { promises as fs } from 'fs';
import { Kysely, Migrator, FileMigrationProvider, sql } from 'kysely';
import chalk from 'chalk';
import { Env, getDb, getEnv } from './utils';

function getMigrator(db: Kysely<any>) {
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, 'migrations'),
		}),
	});

	return migrator;
}

async function migrateFresh(env: Env) {
	const db = getDb(env);
	const migrator = getMigrator(db);

	// Deletes all tables from database.
	await sql`
		DO $$ 
		DECLARE 
			r RECORD; 
		BEGIN 
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP 
				EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
			END LOOP; 
		END $$;
	`.execute(db);

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(
				chalk.greenBright(
					`✔ Migration "${it.migrationName}" was executed successfully!`
				)
			);
		} else if (it.status === 'Error') {
			console.error(
				chalk.redBright(`❗ Failed to execute migration "${it.migrationName}"`)
			);
		}
	});

	if (error) {
		console.error(chalk.redBright(`❌ Migrations have failed`));
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

async function migrateToLatest(env: Env) {
	const db = getDb(env);
	const migrator = getMigrator(db);

	const { error, results } = await migrator.migrateToLatest();

	if (results?.length === 0 && !error) {
		console.log(chalk.blueBright(`No migrations were executed.`));
		await db.destroy();
		return;
	}

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(
				chalk.greenBright(
					`✔ Migration "${it.migrationName}" was executed successfully!`
				)
			);
		} else if (it.status === 'Error') {
			console.error(
				chalk.redBright(`❗ Failed to execute migration "${it.migrationName}"`)
			);
		}
	});

	if (error) {
		console.error(chalk.redBright(`❌ Migrations have failed`));
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

async function migrateUp(env: Env) {
	const db = getDb(env);
	const migrator = getMigrator(db);

	const { error, results } = await migrator.migrateUp();

	if (results?.length === 0 && !error) {
		console.log(chalk.blueBright(`No migrations were executed.`));
		await db.destroy();
		return;
	}

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(
				chalk.greenBright(
					`✔ Migration "${it.migrationName}" was executed successfully!`
				)
			);
		} else if (it.status === 'Error') {
			console.error(
				chalk.redBright(`❗ Failed to execute migration "${it.migrationName}"`)
			);
		}
	});

	if (error) {
		console.error(chalk.redBright(`❌ Migrations have failed`));
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

async function migrateDown(env: Env) {
	const db = getDb(env);
	const migrator = getMigrator(db);

	const { error, results } = await migrator.migrateDown();

	if (results?.length === 0 && !error) {
		console.log(chalk.blueBright(`No migrations were executed.`));
		await db.destroy();
		return;
	}

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(
				chalk.greenBright(
					`✔ Migration "${it.migrationName}" was reverted successfully!`
				)
			);
		} else if (it.status === 'Error') {
			console.error(
				chalk.redBright(`❗ Failed to revert migration "${it.migrationName}"`)
			);
		}
	});

	if (error) {
		console.error(chalk.redBright(`❌ Migrations have failed`));
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

const env = getEnv();

if (process.argv[2] === 'down') {
	console.log(chalk.blueBright('Migrating Down...'));
	migrateDown(env);
} else if (process.argv[2] === 'up') {
	console.log(chalk.blueBright('Migrating Up...'));
	migrateUp(env);
} else if (process.argv[2] === 'fresh') {
	console.log(chalk.blueBright('Migrating Fresh...'));
	migrateFresh(env);
} else if (process.argv[2] === 'latest') {
	console.log(chalk.blueBright('Migrating To Latest...'));
	migrateToLatest(env);
} else {
	console.log(chalk.grey('Unknown command'));
}
