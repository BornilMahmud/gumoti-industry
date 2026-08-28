-- Gumti Textiles — Enterprise platform: RBAC, workflows, CMS-verified data (D1 / SQLite)

-- ============ RBAC ============
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'BUYER',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  last_seen_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS roles (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  code TEXT PRIMARY KEY,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_code TEXT NOT NULL,
  permission_code TEXT NOT NULL,
  PRIMARY KEY (role_code, permission_code)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ============ Workflow events ============
CREATE TABLE IF NOT EXISTS rfq_status_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rfq_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  actor_email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rfq_events ON rfq_status_events(rfq_id);

CREATE TABLE IF NOT EXISTS sample_status_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  actor_email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sample_events ON sample_status_events(ref_id);

-- ============ Quotations ============
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_id TEXT UNIQUE NOT NULL,
  rfq_id TEXT,
  customer_email TEXT NOT NULL,
  company_name TEXT,
  currency TEXT DEFAULT 'USD',
  validity TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  total REAL DEFAULT 0,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quotation_email ON quotations(customer_email);

CREATE TABLE IF NOT EXISTS quotation_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_id TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity REAL DEFAULT 0,
  unit TEXT,
  unit_price REAL DEFAULT 0,
  amount REAL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_qitems ON quotation_items(quotation_id);

-- ============ Orders ============
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT UNIQUE NOT NULL,
  rfq_id TEXT,
  quotation_id TEXT,
  customer_email TEXT NOT NULL,
  company_name TEXT,
  product TEXT,
  quantity TEXT,
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);

CREATE TABLE IF NOT EXISTS order_status_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  actor_email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_events ON order_status_events(order_id);

-- ============ Customer CRM ============
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  contact_person TEXT,
  country TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ Product catalog (admin-managed, verified) ============
CREATE TABLE IF NOT EXISTS products_cms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  construction TEXT,
  composition TEXT,
  gsm TEXT,
  finish TEXT,
  colors TEXT,
  application TEXT,
  certifications TEXT,
  moq TEXT DEFAULT 'Per order confirmation',
  lead_time TEXT DEFAULT 'Per order confirmation',
  availability TEXT DEFAULT 'Available for Order',
  description TEXT,
  image TEXT,
  verification_status TEXT NOT NULL DEFAULT 'PENDING',
  published INTEGER NOT NULL DEFAULT 0,
  sort INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories_cms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 100,
  published INTEGER NOT NULL DEFAULT 1
);

-- ============ Verified data registries ============
CREATE TABLE IF NOT EXISTS verified_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL DEFAULT 'sustainability',
  label TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  year TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  published INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS export_markets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country TEXT NOT NULL,
  region TEXT,
  products TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  published INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ AI analytics (no personal data) ============
CREATE TABLE IF NOT EXISTS ai_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  matched INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ Seed: roles ============
INSERT OR IGNORE INTO roles (code, name, description) VALUES
 ('SUPER_ADMIN','Super Admin','Full platform control including roles and settings'),
 ('ADMIN','Admin','Full operational control'),
 ('SALES_MANAGER','Sales Manager','RFQ, quotation, customer and order management'),
 ('SALES_EXECUTIVE','Sales Executive','RFQ and quotation handling'),
 ('MERCHANDISING','Merchandising','Products, samples and RFQ support'),
 ('PRODUCTION_MANAGER','Production Manager','Order and production stage updates'),
 ('QUALITY_MANAGER','Quality Manager','Quality records and verification'),
 ('HR_MANAGER','HR Manager','Career applications'),
 ('CONTENT_MANAGER','Content Manager','CMS content, metrics and markets'),
 ('VIEWER','Viewer','Read-only access'),
 ('BUYER','Buyer','Customer portal access');

-- ============ Seed: permissions ============
INSERT OR IGNORE INTO permissions (code, description) VALUES
 ('products.read','View products'),('products.create','Create products'),('products.update','Update products'),('products.delete','Archive products'),
 ('rfq.read','View RFQs'),('rfq.create','Create RFQs'),('rfq.assign','Assign RFQs'),('rfq.update','Update RFQ status'),('rfq.convert','Convert RFQ to order'),
 ('quotation.read','View quotations'),('quotation.create','Create quotations'),('quotation.update','Update quotations'),('quotation.send','Send quotations'),('quotation.approve','Approve quotations'),
 ('orders.read','View orders'),('orders.create','Create orders'),('orders.update','Update orders'),
 ('production.read','View production'),('production.update','Update production'),
 ('quality.read','View quality'),('quality.update','Update quality'),
 ('customers.read','View customers'),('customers.create','Create customers'),('customers.update','Update customers'),
 ('cms.read','View CMS'),('cms.create','Create CMS content'),('cms.update','Update CMS content'),('cms.publish','Publish CMS content'),
 ('users.read','View users'),('users.create','Create users'),('users.update','Update users'),('users.disable','Disable users'),('users.assign_role','Assign roles'),
 ('analytics.read','View analytics'),
 ('settings.read','View settings'),('settings.update','Update settings'),
 ('audit_logs.read','View audit logs');

-- SUPER_ADMIN + ADMIN: all permissions
INSERT OR IGNORE INTO role_permissions (role_code, permission_code) SELECT 'SUPER_ADMIN', code FROM permissions;
INSERT OR IGNORE INTO role_permissions (role_code, permission_code) SELECT 'ADMIN', code FROM permissions WHERE code NOT IN ('users.assign_role','settings.update');

INSERT OR IGNORE INTO role_permissions (role_code, permission_code) VALUES
 ('SALES_MANAGER','rfq.read'),('SALES_MANAGER','rfq.assign'),('SALES_MANAGER','rfq.update'),('SALES_MANAGER','rfq.convert'),
 ('SALES_MANAGER','quotation.read'),('SALES_MANAGER','quotation.create'),('SALES_MANAGER','quotation.update'),('SALES_MANAGER','quotation.send'),('SALES_MANAGER','quotation.approve'),
 ('SALES_MANAGER','orders.read'),('SALES_MANAGER','orders.create'),('SALES_MANAGER','customers.read'),('SALES_MANAGER','customers.create'),('SALES_MANAGER','customers.update'),
 ('SALES_MANAGER','products.read'),('SALES_MANAGER','analytics.read'),
 ('SALES_EXECUTIVE','rfq.read'),('SALES_EXECUTIVE','rfq.update'),('SALES_EXECUTIVE','quotation.read'),('SALES_EXECUTIVE','quotation.create'),('SALES_EXECUTIVE','quotation.update'),
 ('SALES_EXECUTIVE','customers.read'),('SALES_EXECUTIVE','products.read'),
 ('MERCHANDISING','products.read'),('MERCHANDISING','products.create'),('MERCHANDISING','products.update'),('MERCHANDISING','rfq.read'),
 ('PRODUCTION_MANAGER','orders.read'),('PRODUCTION_MANAGER','orders.update'),('PRODUCTION_MANAGER','production.read'),('PRODUCTION_MANAGER','production.update'),
 ('QUALITY_MANAGER','quality.read'),('QUALITY_MANAGER','quality.update'),('QUALITY_MANAGER','orders.read'),
 ('HR_MANAGER','analytics.read'),
 ('CONTENT_MANAGER','cms.read'),('CONTENT_MANAGER','cms.create'),('CONTENT_MANAGER','cms.update'),('CONTENT_MANAGER','cms.publish'),('CONTENT_MANAGER','products.read'),
 ('VIEWER','rfq.read'),('VIEWER','quotation.read'),('VIEWER','orders.read'),('VIEWER','customers.read'),('VIEWER','products.read'),('VIEWER','analytics.read');

-- ============ Seed: super admins ============
INSERT OR IGNORE INTO users (email, display_name, role, status) VALUES
 ('bornilmahmud56@gmail.com','Bornil Mahmud','SUPER_ADMIN','ACTIVE'),
 ('bonrilmahmud56@gmail.com','Bornil Mahmud','SUPER_ADMIN','ACTIVE');

-- ============ Seed: categories ============
INSERT OR IGNORE INTO categories_cms (slug, name, sort, published) VALUES
 ('t-shirts','T-Shirts',1,1),('polo-shirts','Polo Shirts',2,1),('knit-jackets','Knit Jackets',3,1),('shorts','Shorts',4,1);

-- ============ Seed: verified sustainability/company metrics ============
INSERT OR IGNORE INTO verified_metrics (id, category, label, value, unit, year, source, status, published) VALUES
 (1,'sustainability','Certified memberships','BCI · SEDEX · OEKO-TEX · GOTS','','Current','BGMEA public listing','VERIFIED',1),
 (2,'sustainability','Water consumption per kg fabric',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (3,'sustainability','Renewable energy share',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (4,'sustainability','Recycled material share',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (5,'sustainability','Wastewater treatment coverage',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (6,'capability','Factory type','Knit Composite','','Current','BGMEA public listing','VERIFIED',1),
 (7,'capability','Established','30 October 1993','','1993','BGMEA public listing','VERIFIED',1),
 (8,'capability','Machine count',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (9,'capability','Daily production capacity',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0),
 (10,'capability','Employee count',NULL,NULL,NULL,NULL,'PENDING_VERIFICATION',0);
