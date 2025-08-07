-- Database schema for Yummy Colors game

-- Table to store game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY,
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    start_time TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    current_round INTEGER,
    total_rounds INTEGER,
    colors_per_round INTEGER,
    game_phase VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store colors (our curated color set)
CREATE TABLE IF NOT EXISTS colors (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hex VARCHAR(7) NOT NULL UNIQUE,
    hue INTEGER NOT NULL,
    saturation INTEGER NOT NULL,
    lightness INTEGER NOT NULL,
    red INTEGER NOT NULL,
    green INTEGER NOT NULL,
    blue INTEGER NOT NULL,
    category VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store round results
CREATE TABLE IF NOT EXISTS round_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    selected_color_id UUID REFERENCES colors(id),
    time_spent INTEGER, -- milliseconds
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store colors shown in each round
CREATE TABLE IF NOT EXISTS round_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_result_id UUID REFERENCES round_results(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id),
    position INTEGER, -- position in the round (0-5 for 6 colors)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store selected colors for each session
CREATE TABLE IF NOT EXISTS session_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id),
    selection_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, color_id)
);

-- Table to store favorite colors (selected in favorites round)
CREATE TABLE IF NOT EXISTS favorite_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, color_id)
);

-- Table to store final top 3 rankings
CREATE TABLE IF NOT EXISTS final_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    color_id UUID REFERENCES colors(id),
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, rank),
    UNIQUE(session_id, color_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON game_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_phase ON game_sessions(game_phase);
CREATE INDEX IF NOT EXISTS idx_round_results_session_id ON round_results(session_id);
CREATE INDEX IF NOT EXISTS idx_round_results_round_number ON round_results(round_number);
CREATE INDEX IF NOT EXISTS idx_session_colors_session_id ON session_colors(session_id);
CREATE INDEX IF NOT EXISTS idx_session_colors_color_id ON session_colors(color_id);
CREATE INDEX IF NOT EXISTS idx_favorite_colors_session_id ON favorite_colors(session_id);
CREATE INDEX IF NOT EXISTS idx_final_rankings_session_id ON final_rankings(session_id);
CREATE INDEX IF NOT EXISTS idx_final_rankings_rank ON final_rankings(rank);
CREATE INDEX IF NOT EXISTS idx_colors_category ON colors(category);
CREATE INDEX IF NOT EXISTS idx_colors_hex ON colors(hex);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
