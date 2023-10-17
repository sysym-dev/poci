export type EntityId = number;

export interface Entity {
  id: EntityId;
  created_at: Date;
  updated_at: Date;
}

export type EntityAttributes<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
