-- Session table for express-session with connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS = FALSE);
-- Add primary key constraint
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
-- Create index for expire column to optimize cleanup queries
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
-- Function to automatically clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS void AS $$ BEGIN
DELETE FROM "session"
WHERE "expire" < NOW();
END;
$$ LANGUAGE plpgsql;