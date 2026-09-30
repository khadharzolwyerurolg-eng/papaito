CREATE DATABASE Papaito;
 
USE Papaito;

CREATE TABLE Animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    characteristics VARCHAR(100) NOT NULL UNIQUE,
    gender VARCHAR(255) NOT NULL,
    cover VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO Animals (name, characteristics, gender, cover) VALUES
('Cão', 'Amigável, leal, brincalhão', 'Macho', NULL),
('Gato', 'Independente, curioso, ágil', 'Fêmea', NULL),
('Pássaro', 'Colorido, cantador, voador', 'Macho', NULL),
('Peixe', 'Silencioso, aquático, nadador', 'Fêmea', NULL),
('Coelho', 'Fofo, saltitante, herbívoro', 'Macho', NULL),
('Hamster', 'Pequeno, ativo, noturno', 'Fêmea', NULL),
('Tartaruga', 'Lenta, resistente, aquática', 'Macho', NULL),
('Cavalo', 'Elegante, veloz, forte', 'Fêmea', NULL),
('Papagaio', 'Colorido, falante, inteligente', 'Macho', NULL),
('Porquinho-da-índia', 'Sociável, dócil, roedor', 'Fêmea', NULL);


-- Garante que o utilizador usa autenticação por palavra-passe tradicional
ALTER USER 'terdeu'@'localhost' IDENTIFIED WITH mysql_native_password BY '54e7OtJM';

-- Concede todas as permissões sobre a base de dados do blog
GRANT ALL PRIVILEGES ON Papaito.* TO 'terdeu'@'localhost';

-- Aplica as alterações imediatamente
FLUSH PRIVILEGES;

MySQL DB Name
b7_42793698_Papaito	

MySQL User Name 
b7_42793698	(Your vPanel Password)	


MySQL Host Name
sql112.byethost7.com


//:: Ćonnection::
const db = mysql.createConnection({
    host: "sql112.byethost7.com",
    user: "b7_42793698",
    password: "54e7OtJM",
    database: "b7_42793698_Papaito"
})
