CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    display_name VARCHAR(50),
    join_date DATE,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL
);

CREATE TABLE animelist (
    mal_id INT PRIMARY KEY,
    english_name VARCHAR(500),
    japanese_name VARCHAR(500),
    image_url VARCHAR(500),
    total_episodes INT,
    release_date VARCHAR(500),
    release_type VARCHAR(500)
);

CREATE TABLE watchlist (
    user_id INT NOT NULL,
    mal_id INT NOT NULL,
    tag_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (mal_id) REFERENCES animelist(mal_id)
);