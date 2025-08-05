-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create the files table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    mimetype VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    data BYTEA NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on uploaded_at
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at);