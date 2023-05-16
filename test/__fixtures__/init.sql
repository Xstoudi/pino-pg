CREATE TYPE "severity" AS ENUM ('INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL');
CREATE TYPE "category" AS ENUM ('DEV', 'BOOTSTRAP', 'RUNTIME', 'ACCESS');
CREATE TYPE "notify" AS ENUM ('NONE', 'ADMIN', 'CLIENT', 'BOTH');
CREATE TABLE log (
                     id SERIAL PRIMARY KEY,
                     severity severity,
                     category category,
                     created_at TIMESTAMP DEFAULT Now(),
                     message VARCHAR(256),
                     vars VARCHAR(256),
                     notify notify DEFAULT 'BOTH'
);
