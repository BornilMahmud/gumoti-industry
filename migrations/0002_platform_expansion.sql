-- Gumti Textiles — Platform Expansion Schema (D1 / SQLite)

-- Persistent site CMS settings
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Registered user accounts & RBAC roles
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer', -- 'admin', 'moderator', 'customer'
  company TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RFQ status progression history
CREATE TABLE IF NOT EXISTS rfq_status_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rfq_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL, -- 'NEW', 'UNDER REVIEW', 'PRICING', 'QUOTED', 'SAMPLE APPROVED', 'PRODUCTION', 'COMPLETED', 'CANCELLED'
  note TEXT,
  actor_email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rfq_events_rfq_id ON rfq_status_events(rfq_id);

-- Product categories
CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

-- Admin-managed dynamic products
CREATE TABLE IF NOT EXISTS products_admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  composition TEXT NOT NULL,
  construction TEXT NOT NULL,
  gsm TEXT NOT NULL,
  finish TEXT,
  moq TEXT,
  lead_time TEXT,
  application TEXT,
  certifications TEXT,
  colors TEXT,
  image_url TEXT,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_admin_category ON products_admin(category);

-- Commercial Quotations linked to RFQs
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id TEXT UNIQUE NOT NULL,
  rfq_id TEXT NOT NULL,
  email TEXT NOT NULL,
  total_amount REAL,
  currency TEXT DEFAULT 'USD',
  unit_price REAL,
  moq_quoted TEXT,
  lead_time_days INTEGER,
  payment_terms TEXT,
  valid_until DATE,
  notes TEXT,
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'ACCEPTED', 'REVISED', 'EXPIRED'
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quotations_rfq_id ON quotations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotations_email ON quotations(email);

-- Admin mutation audit log
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON admin_audit_logs(actor_email);
