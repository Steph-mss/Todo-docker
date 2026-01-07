-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Insert sample data (optional)
INSERT INTO tasks (title, completed) VALUES
    ('Faire mes courses', true),
    ('Aller au cinéma', true),
    ('Aider mes amis', false),
    ('Faire mes devoirs', false);
