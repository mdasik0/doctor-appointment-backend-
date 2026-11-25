CREATE TABLE doctor_profiles (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(id) ON DELETE CASCADE,

    specialization VARCHAR(100) NOT NULL,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0
        CHECK (experience_years >= 0),

    consultation_fee NUMERIC(10, 2) DEFAULT 0
        CHECK (consultation_fee >= 0),

    bio TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);