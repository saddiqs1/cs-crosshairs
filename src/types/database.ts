import type { Selectable } from 'kysely';
import { DB } from './generated/database';

export type DBTypes = {
	[K in keyof DB]: Selectable<DB[K]>;
};
