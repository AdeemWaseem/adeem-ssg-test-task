-- init.sql
-- This script will be executed automatically when the PostgreSQL container is first created.
-- Use this file to initialize your database schema, create tables, insert initial data, etc.
-- Create a sample table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) UNIQUE NOT NULL,
  isLogin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks_users (
  task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- Insert some sample data
INSERT INTO
  users (username, email, password)
VALUES
  ('John Doe','john_doe', 'john@example.com', 'john@123'),
  ('Jane Smith','jane_smith', 'jane@example.com', 'jane@123')
ON CONFLICT (username) DO NOTHING;

-- Create another sample table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  title VARCHAR(100) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample posts
INSERT INTO
  posts (user_id, title, content)
VALUES
  (
    1,
    'First Post',
    'This is the content of the first post.'
  ),
  (
    2,
    'Introduction',
    'Hello, this is my first post on the platform!'
  )
ON CONFLICT DO NOTHING;

-- Add any other initialization SQL statements here
-- For example: creating more tables, inserting initial data, setting up functions or triggers, etc.
-- Remember to replace these placeholder examples with your actual schema and initial data as needed.
