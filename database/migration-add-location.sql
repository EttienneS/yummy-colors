-- Migration to add location data to game sessions
-- Add location columns to game_sessions table
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(3),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(8, 6),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(9, 6),
ADD COLUMN IF NOT EXISTS location_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS location_consent_timestamp TIMESTAMP
WITH
    TIME ZONE;

-- Add indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_city ON game_sessions (city);

CREATE INDEX IF NOT EXISTS idx_game_sessions_country ON game_sessions (country);

CREATE INDEX IF NOT EXISTS idx_game_sessions_country_code ON game_sessions (country_code);

CREATE INDEX IF NOT EXISTS idx_game_sessions_location_consent ON game_sessions (location_consent);

-- Create a view for location analytics
CREATE
OR REPLACE VIEW location_analytics AS
SELECT
    country,
    country_code,
    region,
    city,
    COUNT(*) as total_sessions,
    COUNT(
        CASE
            WHEN game_phase = 'complete' THEN 1
        END
    ) as completed_sessions,
    AVG(total_rounds) as avg_rounds,
    MIN(created_at) as first_session,
    MAX(created_at) as latest_session
FROM
    game_sessions
WHERE
    location_consent = TRUE
    AND city IS NOT NULL
GROUP BY
    country,
    country_code,
    region,
    city
ORDER BY
    total_sessions DESC;