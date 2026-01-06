import { useSQLiteContext } from "expo-sqlite";

export interface TargetCreate {
  name: string;
  amount: number;
}

export interface TargetUpdate extends TargetCreate {
  id: number;
}

export interface TargetResponse {
  id: string;
  name: string;
  amount: number;
  current: number;
  percentage: number;
  created_at: Date;
  updated_at: Date;
}

const useTargetDatabase = () => {
  const database = useSQLiteContext();

  const create = async (data: TargetCreate) => {
    const statement = await database.prepareAsync(
      `INSERT INTO targets (name, amount) VALUES ($name, $amount)`
    );

    statement.executeAsync({
      $name: data.name,
      $amount: data.amount,
    });
  };

  const listByClosestTarget = () => {
    return database.getAllAsync<TargetResponse>(`
        SELECT 
            targets.id,
            targets.name,    
            targets.amount,
            COALESCE (SUM(transactions.amount), 0) AS current,
            COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
            targets.created_at,
            targets.updated_at
        FROM targets   
        LEFT JOIN transactions ON targets.id = transactions.target_id
        GROUP BY targets.id, targets.name, targets.amount
        ORDER BY percentage DESC
    `);
  };

  const show = (id: number) => {
    return database.getFirstAsync<TargetResponse>(`
        SELECT 
            targets.id,
            targets.name,    
            targets.amount,
            COALESCE (SUM(transactions.amount), 0) AS current,
            COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
            targets.created_at,
            targets.updated_at
        FROM targets   
        LEFT JOIN transactions ON targets.id = transactions.target_id
        WHERE targets.id = ${id}
    `);
  };

  const update = async (data: TargetUpdate) => {
    const statement = await database.prepareAsync(`
        UPDATE targets SET
          name = $name,
          amount = $amount,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $id
      `);

    statement.executeAsync({
      $id: data.id,
      $name: data.name,
      $amount: data.amount,
    });
  };

  const remove = async (id: number) => {
    await database.runAsync("DELETE FROM targets WHERE id = ?", id);
  };

  return { show, create, update, remove, listByClosestTarget };
};

export default useTargetDatabase;
