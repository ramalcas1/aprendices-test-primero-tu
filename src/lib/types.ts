// Tipos de los datos de la app, generados por Cosmos a partir del plan.
export interface Row {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz_lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  diagnosed_station: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}
export type Quiz_leadInput = Omit<Quiz_lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
