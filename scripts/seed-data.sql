-- Insert sample personal info
INSERT INTO personal_info (
    name, title, description, email, phone, linkedin_url, github_url
) VALUES (
    'Neel Ramteke',
    'Product Manager & Analyst',
    'Transforming data into insights, insights into strategy, and strategy into exceptional products that drive business growth and user satisfaction.',
    'neel.ramteke@email.com',
    '+1 (234) 567-8900',
    'https://linkedin.com/in/neelramteke',
    'https://github.com/neelramteke'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, level, icon, order_index) VALUES
('Product Strategy', 95, 'Target', 1),
('Data Analysis', 90, 'BarChart3', 2),
('User Research', 85, 'Users', 3),
('AI/ML Integration', 80, 'Brain', 4),
('Market Research', 88, 'TrendingUp', 5),
('SQL & Analytics', 92, 'Database', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tools
INSERT INTO tools (name, color, text_color, order_index) VALUES
('Python', 'bg-blue-500', 'text-blue-100', 1),
('SQL', 'bg-green-500', 'text-green-100', 2),
('Tableau', 'bg-orange-500', 'text-orange-100', 3),
('Figma', 'bg-purple-500', 'text-purple-100', 4),
('Jira', 'bg-blue-600', 'text-blue-100', 5),
('Google Analytics', 'bg-yellow-500', 'text-yellow-900', 6),
('Mixpanel', 'bg-pink-500', 'text-pink-100', 7),
('Amplitude', 'bg-indigo-500', 'text-indigo-100', 8),
('TensorFlow', 'bg-orange-600', 'text-orange-100', 9),
('React', 'bg-cyan-500', 'text-cyan-100', 10),
('PostgreSQL', 'bg-blue-700', 'text-blue-100', 11),
('AWS', 'bg-yellow-600', 'text-yellow-100', 12),
('Docker', 'bg-blue-400', 'text-blue-100', 13),
('Git', 'bg-red-500', 'text-red-100', 14),
('Slack', 'bg-purple-600', 'text-purple-100', 15),
('Notion', 'bg-gray-600', 'text-gray-100', 16)
ON CONFLICT (id) DO NOTHING;

-- Insert sample experiences
INSERT INTO experiences (title, company, period, description, achievements, order_index) VALUES
('Senior Product Manager', 'TechCorp AI', '2022 - Present', 'Led AI-powered product initiatives, driving 40% increase in user engagement through data-driven insights and strategic product decisions.', ARRAY['Launched 3 AI features', 'Increased user retention by 35%', 'Led cross-functional team of 12'], 1),
('Product Analyst', 'DataFlow Solutions', '2020 - 2022', 'Analyzed user behavior patterns and market trends to inform product roadmap decisions, resulting in 25% revenue growth.', ARRAY['Built analytics dashboard', 'Reduced churn by 20%', 'Optimized conversion funnel'], 2),
('Business Analyst', 'InnovateTech', '2018 - 2020', 'Conducted market research and competitive analysis to identify new product opportunities in emerging tech markets.', ARRAY['Identified 5 new market segments', 'Improved process efficiency by 30%', 'Created strategic reports'], 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, status, users, impact, icon, order_index) VALUES
('AI Analytics Suite', 'Comprehensive analytics platform with ML-powered insights for enterprise clients.', 'Live', '10K+ users', '40% increase in decision speed', 'Brain', 1),
('Customer Journey Optimizer', 'Real-time customer journey mapping and optimization tool.', 'Beta', '2K+ users', '25% conversion improvement', 'TrendingUp', 2),
('Predictive Analytics Dashboard', 'AI-driven dashboard for predicting user behavior and market trends.', 'Development', 'Coming Soon', 'Expected 30% accuracy boost', 'BarChart3', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, tech, duration, role, order_index) VALUES
('E-commerce Personalization Engine', 'Built a machine learning system that personalizes product recommendations, increasing conversion rates by 35%.', ARRAY['Python', 'TensorFlow', 'AWS', 'PostgreSQL'], '6 months', 'Lead Product Manager', 1),
('Mobile App Analytics Platform', 'Developed comprehensive analytics platform for mobile apps with real-time user behavior tracking.', ARRAY['React', 'Node.js', 'MongoDB', 'Redis'], '8 months', 'Product Manager', 2),
('Supply Chain Optimization Tool', 'Created AI-powered tool for optimizing supply chain operations, reducing costs by 20%.', ARRAY['Python', 'Pandas', 'Tableau', 'SQL'], '4 months', 'Senior Analyst', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample case studies
INSERT INTO case_studies (title, description, industry, impact, timeline, filename, order_index) VALUES
('Reducing Customer Churn by 40%', 'How I used predictive analytics to identify at-risk customers and implement retention strategies.', 'SaaS', '40% churn reduction', '3 months', 'churn-reduction-case-study.pdf', 1),
('Launching AI-Powered Features', 'End-to-end process of researching, developing, and launching ML features that drove user engagement.', 'EdTech', '60% engagement increase', '6 months', 'ai-features-case-study.pdf', 2),
('Market Expansion Strategy', 'Data-driven approach to entering new markets, resulting in successful international expansion.', 'FinTech', '3 new markets', '12 months', 'market-expansion-case-study.pdf', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample education
INSERT INTO education (degree, school, period, focus, achievements, order_index) VALUES
('Master of Business Administration (MBA)', 'Stanford Graduate School of Business', '2016 - 2018', 'Technology Management & Data Analytics', ARRAY['Dean''s List', 'Product Management Certificate', 'Data Science Specialization'], 1),
('Bachelor of Technology (B.Tech)', 'Indian Institute of Technology (IIT) Bombay', '2012 - 2016', 'Computer Science & Engineering', ARRAY['Magna Cum Laude', 'Research Assistant', 'Tech Innovation Award'], 2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample certifications
INSERT INTO certifications (title, issuer, date, badge, color, order_index) VALUES
('Certified Product Manager', 'Product Management Institute', '2023', '🏆', 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300', 1),
('Google Analytics Certified', 'Google', '2023', '📊', 'bg-blue-500/20 border-blue-500/30 text-blue-300', 2),
('AWS Solutions Architect', 'Amazon Web Services', '2022', '☁️', 'bg-orange-500/20 border-orange-500/30 text-orange-300', 3),
('Scrum Master Certified', 'Scrum Alliance', '2022', '🎯', 'bg-green-500/20 border-green-500/30 text-green-300', 4),
('Data Science Professional', 'IBM', '2021', '🔬', 'bg-purple-500/20 border-purple-500/30 text-purple-300', 5),
('UX Design Fundamentals', 'Nielsen Norman Group', '2021', '🎨', 'bg-pink-500/20 border-pink-500/30 text-pink-300', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample animated stats
INSERT INTO animated_stats (title, value, icon, gradient, order_index) VALUES
('Years Experience', '5+', 'Calendar', 'from-blue-500 to-cyan-500', 1),
('Projects Completed', '50+', 'CheckCircle', 'from-green-500 to-emerald-500', 2),
('Revenue Generated', '$10M+', 'DollarSign', 'from-yellow-500 to-orange-500', 3),
('Team Members Led', '20+', 'Users', 'from-purple-500 to-pink-500', 4)
ON CONFLICT (id) DO NOTHING;
