-- Tabela de diário alimentar
CREATE TABLE IF NOT EXISTS food_diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_key TEXT NOT NULL,
  food_name TEXT NOT NULL,
  carbs NUMERIC DEFAULT 0,
  protein NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  calories NUMERIC DEFAULT 0,
  food_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de consumo de água
CREATE TABLE IF NOT EXISTS water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 0,
  water_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE food_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users manage their own food diary" ON food_diary
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own water intake" ON water_intake
  FOR ALL USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_food_diary_user_date ON food_diary(user_id, food_date);
CREATE INDEX idx_water_intake_user_date ON water_intake(user_id, water_date);