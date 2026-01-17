DROP TABLE IF EXISTS scheduled_transfer_executions CASCADE;
DROP TABLE IF EXISTS scheduled_transfers CASCADE;
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    from_account_id INTEGER NOT NULL REFERENCES accounts(id),
    to_account_id INTEGER NOT NULL REFERENCES accounts(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    transaction_type VARCHAR(20) DEFAULT 'instant',
    scheduled_transfer_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_account_id != to_account_id)
);

CREATE TABLE scheduled_transfers (
    id SERIAL PRIMARY KEY,
    from_account_id INTEGER NOT NULL REFERENCES accounts(id),
    to_account_id INTEGER NOT NULL REFERENCES accounts(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    frequency VARCHAR(20) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    next_execution_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_account_id != to_account_id),
    CHECK (frequency IN ('daily', 'weekly', 'monthly', 'once')),
    CHECK (status IN ('active', 'paused', 'cancelled', 'completed'))
);

CREATE TABLE scheduled_transfer_executions (
    id SERIAL PRIMARY KEY,
    scheduled_transfer_id INTEGER NOT NULL REFERENCES scheduled_transfers(id) ON DELETE CASCADE,
    transfer_id INTEGER REFERENCES transfers(id),
    execution_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('success', 'failed'))
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transfers_from_account ON transfers(from_account_id);
CREATE INDEX idx_transfers_to_account ON transfers(to_account_id);
CREATE INDEX idx_scheduled_transfers_next_execution ON scheduled_transfers(next_execution_date);
CREATE INDEX idx_scheduled_transfers_status ON scheduled_transfers(status);