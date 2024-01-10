import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Crosshairs {
  crosshair: string;
  id: Generated<number>;
  name: string;
  user_id: number | null;
}

export interface Users {
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  latest_login_at: Timestamp | null;
  steam_uid: string;
}

export interface DB {
  crosshairs: Crosshairs;
  users: Users;
}
