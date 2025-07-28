-- Create the files table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mimetype VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    data BYTEA NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on uploaded_at for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at DESC);