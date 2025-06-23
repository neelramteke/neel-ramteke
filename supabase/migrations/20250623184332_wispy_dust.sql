-- Complete CMS Schema for Full Portfolio Management
-- Drop existing tables and recreate with comprehensive structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS animated_stats CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS case_studies CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS personal_info CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS hero_section CASCADE;
DROP TABLE IF EXISTS about_section CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

-- Site Settings (Global settings)
CREATE TABLE site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_title TEXT DEFAULT 'Portfolio',
    site_description TEXT DEFAULT 'Professional Portfolio',
    favicon_url TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#8B5CF6',
    background_color TEXT DEFAULT '#000000',
    text_color TEXT DEFAULT '#FFFFFF',
    font_family TEXT DEFAULT 'Inter',
    custom_css TEXT,
    google_analytics_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Section
CREATE TABLE hero_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    main_heading TEXT DEFAULT 'Your Name',
    sub_heading TEXT DEFAULT 'Your Title',
    description TEXT DEFAULT 'Your description here...',
    background_image_url TEXT,
    profile_image_url TEXT,
    cta_button_text TEXT DEFAULT 'Download Resume',
    cta_button_url TEXT,
    show_animated_text BOOLEAN DEFAULT true,
    animated_words TEXT[] DEFAULT ARRAY['Product Manager', 'Business Analyst', 'Data Scientist'],
    background_video_url TEXT,
    overlay_opacity INTEGER DEFAULT 80,
    text_alignment TEXT DEFAULT 'center',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Section
CREATE TABLE about_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_title TEXT DEFAULT 'About Me',
    main_content TEXT DEFAULT 'Write about yourself here...',
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    years_experience INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    clients_served INTEGER DEFAULT 0,
    awards_won INTEGER DEFAULT 0,
    show_stats BOOLEAN DEFAULT true,
    layout_type TEXT DEFAULT 'side-by-side',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal Info (Enhanced)
CREATE TABLE personal_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Your Name',
    title TEXT DEFAULT 'Your Professional Title',
    description TEXT DEFAULT 'Your professional description',
    email TEXT DEFAULT 'your@email.com',
    phone TEXT DEFAULT '+1234567890',
    location TEXT DEFAULT 'Your Location',
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    website_url TEXT,
    profile_image_url TEXT,
    resume_url TEXT,
    bio_long TEXT,
    tagline TEXT DEFAULT 'Your tagline',
    availability_status TEXT DEFAULT 'Available for work',
    hourly_rate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills (Enhanced)
CREATE TABLE skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_name TEXT NOT NULL,
    proficiency_level INTEGER DEFAULT 50 CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
    category TEXT DEFAULT 'technical',
    icon_name TEXT DEFAULT 'Code',
    color TEXT DEFAULT '#3B82F6',
    description TEXT,
    years_experience INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools (Enhanced)
CREATE TABLE tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'development',
    color TEXT DEFAULT 'bg-blue-500',
    text_color TEXT DEFAULT 'text-white',
    icon_url TEXT,
    proficiency_level INTEGER DEFAULT 50,
    description TEXT,
    website_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiences (Enhanced)
CREATE TABLE experiences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo_url TEXT,
    company_website TEXT,
    location TEXT,
    employment_type TEXT DEFAULT 'Full-time',
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    period TEXT,
    description TEXT,
    achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
    skills_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
    salary_range TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products (Enhanced)
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    status TEXT DEFAULT 'active',
    users TEXT,
    impact TEXT,
    icon TEXT DEFAULT 'Rocket',
    image_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
    launch_date DATE,
    website_url TEXT,
    demo_url TEXT,
    case_study_url TEXT,
    pricing TEXT,
    target_audience TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (Enhanced)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    tech TEXT[] DEFAULT ARRAY[]::TEXT[],
    duration TEXT,
    role TEXT,
    team_size INTEGER,
    image_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    project_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    status TEXT DEFAULT 'completed',
    start_date DATE,
    end_date DATE,
    client_name TEXT,
    budget_range TEXT,
    challenges TEXT[] DEFAULT ARRAY[]::TEXT[],
    solutions TEXT[] DEFAULT ARRAY[]::TEXT[],
    results TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Studies (Enhanced)
CREATE TABLE case_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    company TEXT,
    industry TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    metrics TEXT[] DEFAULT ARRAY[]::TEXT[],
    tools_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    duration TEXT,
    team_size TEXT,
    role TEXT,
    image_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    document_url TEXT,
    external_url TEXT,
    status TEXT DEFAULT 'published',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education (Enhanced)
CREATE TABLE education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    degree TEXT NOT NULL,
    school TEXT NOT NULL,
    school_logo_url TEXT,
    location TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    period TEXT,
    focus TEXT,
    grade TEXT,
    description TEXT,
    activities TEXT[] DEFAULT ARRAY[]::TEXT[],
    achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
    relevant_courses TEXT[] DEFAULT ARRAY[]::TEXT[],
    thesis_title TEXT,
    thesis_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications (Enhanced)
CREATE TABLE certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    organization_logo_url TEXT,
    issue_date DATE,
    expiration_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    description TEXT,
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    badge_url TEXT,
    status TEXT DEFAULT 'active',
    verification_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Animated Stats (Enhanced)
CREATE TABLE animated_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    suffix TEXT DEFAULT '',
    prefix TEXT DEFAULT '',
    icon TEXT DEFAULT 'TrendingUp',
    color TEXT DEFAULT 'from-blue-500 to-purple-500',
    description TEXT,
    animation_duration INTEGER DEFAULT 2000,
    count_up_start INTEGER DEFAULT 0,
    is_percentage BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages (Enhanced)
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    budget_range TEXT,
    project_type TEXT,
    timeline TEXT,
    status TEXT DEFAULT 'unread',
    priority TEXT DEFAULT 'normal',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    reply_message TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Profiles
CREATE TABLE admin_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    avatar_url TEXT,
    permissions TEXT[] DEFAULT ARRAY['read', 'write', 'delete'],
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data
INSERT INTO site_settings (site_title, site_description) VALUES 
('Portfolio', 'Professional Portfolio Website');

INSERT INTO hero_section (main_heading, sub_heading, description) VALUES 
('Your Name', 'Product Manager & Analyst', 'Transforming data into insights, insights into strategy, and strategy into exceptional products.');

INSERT INTO about_section (section_title, main_content) VALUES 
('About Me', 'I am a passionate professional with expertise in product management and data analysis.');

INSERT INTO personal_info (name, title, description, email) VALUES 
('Your Name', 'Product Manager & Analyst', 'Professional description here', 'your@email.com');

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE animated_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_section FOR SELECT USING (true);
CREATE POLICY "Public read access" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON animated_stats FOR SELECT USING (true);

-- Admin policies (full access for all operations)
CREATE POLICY "Admin full access" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin full access" ON hero_section FOR ALL USING (true);
CREATE POLICY "Admin full access" ON about_section FOR ALL USING (true);
CREATE POLICY "Admin full access" ON personal_info FOR ALL USING (true);
CREATE POLICY "Admin full access" ON skills FOR ALL USING (true);
CREATE POLICY "Admin full access" ON tools FOR ALL USING (true);
CREATE POLICY "Admin full access" ON experiences FOR ALL USING (true);
CREATE POLICY "Admin full access" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access" ON projects FOR ALL USING (true);
CREATE POLICY "Admin full access" ON case_studies FOR ALL USING (true);
CREATE POLICY "Admin full access" ON education FOR ALL USING (true);
CREATE POLICY "Admin full access" ON certifications FOR ALL USING (true);
CREATE POLICY "Admin full access" ON animated_stats FOR ALL USING (true);
CREATE POLICY "Admin full access" ON contact_messages FOR ALL USING (true);
CREATE POLICY "Admin profiles access" ON admin_profiles FOR ALL USING (true);

-- Contact form submission policy (anyone can insert)
CREATE POLICY "Anyone can submit contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('portfolio-images', 'portfolio-images', true),
('portfolio-documents', 'portfolio-documents', true),
('portfolio-videos', 'portfolio-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio-images', 'portfolio-documents', 'portfolio-videos'));
CREATE POLICY "Admin upload access" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('portfolio-images', 'portfolio-documents', 'portfolio-videos'));
CREATE POLICY "Admin update access" ON storage.objects FOR UPDATE USING (bucket_id IN ('portfolio-images', 'portfolio-documents', 'portfolio-videos'));
CREATE POLICY "Admin delete access" ON storage.objects FOR DELETE USING (bucket_id IN ('portfolio-images', 'portfolio-documents', 'portfolio-videos'));