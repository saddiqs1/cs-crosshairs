import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface CrosshairGroups {
  id: Generated<number>;
  name: string;
  order: number;
  user_id: number | null;
}

export interface Crosshairs {
  created_at: Generated<Timestamp>;
  crosshair: string;
  crosshair_group_id: number | null;
  id: Generated<number>;
  name: string;
  order: Generated<number>;
  user_id: number | null;
}

export interface Users {
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  latest_login_at: Timestamp | null;
  steam_uid: string;
}

export interface DB {
  crosshair_groups: CrosshairGroups;
  crosshairs: Crosshairs;
  users: Users;
}
