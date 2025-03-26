BEGIN;

CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  club_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_club FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  club_id INTEGER NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invitations_club FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE marathons (
  id SERIAL PRIMARY KEY,
  club_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  registration_link VARCHAR(255),
  is_private BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_marathons_club FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  marathon_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_categories_marathon FOREIGN KEY (marathon_id) REFERENCES marathons(id)
);

CREATE TABLE participations (
  id SERIAL PRIMARY KEY,
  marathon_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_participations_marathon FOREIGN KEY (marathon_id) REFERENCES marathons(id),
  CONSTRAINT fk_participations_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_participations_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT unique_user_marathon UNIQUE (marathon_id, user_id)
);

-- Initial data for two clubs as an example
INSERT INTO clubs (name) VALUES ('Your Running Club');
INSERT INTO clubs (name) VALUES ('City Runners');

-- Admin for Club 1 (password: "admin123")
INSERT INTO users (club_id, name, email, password, role) 
VALUES (1, 'Admin1', 'admin1@club1.com', '$2b$10$TBd.4uaAuW7qZmRzZcCWk.iwGW8L1btAWjvQCmr.BsHVhtwg47HoC', 'admin');

-- Admin for Club 2 (password: "admin123")
INSERT INTO users (club_id, name, email, password, role) 
VALUES (2, 'Admin2', 'admin2@club2.com', '$2b$10$TBd.4uaAuW7qZmRzZcCWk.iwGW8L1btAWjvQCmr.BsHVhtwg47HoC', 'admin');

COMMIT;

-- Verify the setup
SELECT * FROM clubs;
SELECT * FROM users;
SELECT * FROM invitations;
SELECT * FROM marathons;
SELECT * FROM categories;
SELECT * FROM participations;