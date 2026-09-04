require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  console.log('Connecting to Neon database...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        name          VARCHAR(255),
        password_hash TEXT,
        firebase_uid  VARCHAR(255),
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL,
        amount      NUMERIC(14, 2) NOT NULL,
        type        VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
        category    VARCHAR(50) NOT NULL DEFAULT 'Other',
        description TEXT NOT NULL,
        date        DATE NOT NULL DEFAULT CURRENT_DATE,
        notes       TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    `);
    console.log('✓ transactions table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL,
        name           VARCHAR(255) NOT NULL,
        target_amount  NUMERIC(14, 2) NOT NULL,
        current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
        deadline       DATE,
        color          VARCHAR(50),
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
    `);
    console.log('✓ goals table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL,
        name           VARCHAR(255) NOT NULL,
        amount         NUMERIC(14, 2) NOT NULL,
        billing_cycle  VARCHAR(50) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly')),
        next_billing_date DATE NOT NULL,
        category       VARCHAR(50) DEFAULT 'Subscriptions',
        status         VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    `);
    console.log('✓ subscriptions table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL,
        category       VARCHAR(50) NOT NULL,
        limit_amount   NUMERIC(14, 2) NOT NULL,
        spent_amount   NUMERIC(14, 2) NOT NULL DEFAULT 0,
        month          VARCHAR(7) NOT NULL, -- Format: YYYY-MM
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
    `);
    console.log('✓ budgets table ready');

    console.log('\n✅ All migrations complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
