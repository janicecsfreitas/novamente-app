-- Adicionar coluna task_date se não existir
ALTER TABLE planner_tasks ADD COLUMN IF NOT EXISTS task_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Recriar índice
DROP INDEX IF EXISTS idx_planner_tasks_user_date;
CREATE INDEX idx_planner_tasks_user_date ON planner_tasks(user_id, task_date);