-- Gumti Textiles — core B2B data model (D1 / SQLite)

CREATE TABLE IF NOT EXISTS rfqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rfq_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  product TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  composition TEXT,
  gsm TEXT,
  color TEXT,
  delivery_date TEXT,
  target_price TEXT,
  requirements TEXT,
  uid TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rfqs_email ON rfqs(email);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  inquiry_type TEXT,
  message TEXT NOT NULL,
  uid TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_inquiries(email);

CREATE TABLE IF NOT EXISTS sample_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_id TEXT UNIQUE NOT NULL,
  product TEXT NOT NULL,
  color TEXT,
  gsm TEXT,
  quantity TEXT,
  shipping_address TEXT,
  country TEXT,
  purpose TEXT,
  comments TEXT,
  email TEXT NOT NULL,
  uid TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref_id TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  experience TEXT,
  education TEXT,
  cover_letter TEXT,
  uid TEXT,
  status TEXT NOT NULL DEFAULT 'RECEIVED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);
