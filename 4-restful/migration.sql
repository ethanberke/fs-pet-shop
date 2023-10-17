CREATE TABLE pets (
    id SERIAL,
    age INTEGER NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL
);

INSERT INTO pets (age, name, kind) VALUES (2, 'Ginger', 'Dog');
INSERT INTO pets (age, name, kind) VALUES (9, 'Paisley', 'Dog');
INSERT INTO pets (age, name, kind) VALUES (10, 'Smokey', 'Bear');