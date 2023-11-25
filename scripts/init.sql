CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100),
    goals INT,
    assists INT
);

-- Additional queries as needed
