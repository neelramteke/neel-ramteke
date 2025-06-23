-- Add missing columns to existing tables
ALTER TABLE education ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS period TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS focus TEXT;

-- Create contact_messages table for form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_messages (admin only access)
CREATE POLICY "Admin read access" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update access" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Admin delete access" ON contact_messages FOR DELETE USING (true);

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can read own data" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Admin users can update own data" ON admin_users FOR UPDATE USING (true);

-- Insert default admin user (password: admin123)
-- Note: In production, use a proper password hashing library
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@portfolio.com', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'Portfolio Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;
