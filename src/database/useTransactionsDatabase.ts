import { SummaryI } from "@/components/Summary";
import { useSQLiteContext } from "expo-sqlite";

export interface TransactionCreate {
  amount: number;
  target_id: number;
  observation?: string;
}

export interface TransactionUpdate extends TransactionCreate {
  id: number;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  target_id: number;
  observation: string;
  created_at: Date;
  updated_at: Date;
}

export interface Summary {
  input: number;
  output: number;
}

const useTransactionsDatabase = () => {
  const database = useSQLiteContext();

  const create = async (data: TransactionCreate) => {
    const statement = await database.prepareAsync(
      `INSERT INTO transactions (target_id, amount, observation) VALUES ($target_id, $amount, $observation)`
    );

    statement.executeAsync({
      $amount: data.amount,
      $target_id: data.target_id,
      $observation: data?.observation,
    });
  };

  const listByTargetId = (id: number) => {
    return database.getAllAsync<TransactionResponse>(`
        SELECT id, target_id, amount, observation, created_at, updated_at
        FROM transactions   
        WHERE target_id = ${id}
        ORDER BY created_at DESC
    `);
  };
  const summary = async () => {
    return database.getFirstAsync<Summary>(`
        SELECT 
          COALESCE (SUM(CASE WHEN amount > 0 THEN amount ELSE 0  END), 0) AS input,
          COALESCE (SUM(CASE WHEN amount < 0 THEN amount ELSE 0  END), 0) AS output
        FROM transactions 
      `);
  };

  const remove = async (id: number) => {
    await database.runAsync("DELETE FROM transactions WHERE id = ?", id);
  };

  return { create, summary, remove, listByTargetId };
};

export default useTransactionsDatabase;
