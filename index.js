import express from "express"
import mysql from "mysql2" // Alterado para mysql2
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

// Configuração necessária para ler caminhos de arquivos usando "import" (ES Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())

//:: Connection::

// Configuração da conexão com suporte a SSL para a Aiven
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 22964,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // Configuração obrigatória de SSL para a Aiven
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
    },
    
    // Parâmetros de Pool que você definiu
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    //keepAliveInitialDelayMs: 0
});

//::

// Parse urlencoded bodies (from HTML form submits)
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ["https://papaito-1.onrender.com", "https://papaito-1.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

//::
//:: Rota GET Geral Ajustada
app.get("/animals", (req, res) => {
    const query = "SELECT id, name, characteristics, gender, cover FROM Animals";

    // 1. Recebemos 'results' normalmente sem desestruturar direto no parâmetro
    db.query(query, (err, results) => { 
        // 2. OBRIGATÓRIO: Verificar o erro primeiro. Se houver erro, interrompe a execução aqui.
        if (err) {
            console.error("❌ ERRO DETALHADO DO MYSQL:", err.message);
            console.error("Código do erro:", err.code);
            return res.status(500).json({
                message: "Database query failed!",
                error: err.message
            });
        }

        // 3. Com a biblioteca 'mysql2', os dados brutos vêm direto no primeiro parâmetro de resposta
        const data = results;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "There is no data!"
            });
        }

        return res.json(data);
    });
});

//:: Rota GET por ID Ajustada
app.get("/animals/:id", (req, res) => {
    const animalId = req.params.id;

    if (!animalId) {
        return res.status(400).json("Missing Papaito id data!");
    }

    const query = "SELECT * FROM Animals WHERE id = ?";

    // Adicionado os colchetes [data] aqui também
    db.query(query, [animalId], (err, [data]) => {
        if (err) {
            console.error("Erro no SELECT /animals/:id:", err);
            return res.status(500).json({
                message: "Database query failed."
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Animal not found." });
        }

        // Como usamos desestruturação, 'data' já é a lista de resultados filtrados
        return res.json(data[0]);
    });
});

//:: 
//:: 
app.post("/register/animals", (req, res) => {
    if (!req.body || !req.body.name) {
        return res.status(400).json("Missing Papaito data!");
    }

    // 1. Alterado para mapear 4 parâmetros individuais correspondentes às colunas
    const query = "INSERT INTO Animals (`name`, `characteristics`, `gender`, `cover`) VALUES (?, ?, ?, ?)";

    const values = [
        req.body.name, 
        req.body.characteristics,
        req.body.gender,
        req.body.cover
    ];

    // 2. Passa o array diretamente sem envelopá-lo em outros colchetes
    db.query(query, values, (err, data) => {
        if (err) {
            console.error("Erro interno do MySQL:", err); // Log para ajudar você a debugar no terminal
            return res.status(500).json({
                message: "Database query failed"
            });
        }

        return res.status(201).json("Animals has been created!");
    });
});


//::
app.delete("/kill/animals/:id", (req, res) => {
    const animalId = req.params.id;

    if (!animalId) {
        return res.status(400).json("Missing Papaito id data!")
    }

    const query = "DELETE FROM Animals WHERE id = ?";

    db.query(query, [animalId], (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Database query failed."
            })
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "Animal not found." })
        }

        return res.status(200).json("Animal has been deleted!")
    })
})

//::
app.put("/kill/animals/:id", (req, res) => {
    const animalId = req.params.id;

    if (!animalId) {
        return res.status(400).json("Missing Papaito id data!");
    }

    if (!req.body || !req.body.name) {
        return res.status(400).json("Missing Papaito data!");
    }

    const query = "UPDATE Animals SET `name` = ?, `characteristics` = ?, `gender` = ?, `cover` = ? WHERE id = ?";

    const values = [
        req.body.name,
        req.body.characteristics ?? null,
        req.body.gender ?? null,
        req.body.cover ?? null
    ];

    db.query(query, [...values, animalId], (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Database query failed."
            });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "Animal not found." });
        }

        return res.status(200).json("Animal has been updated!");
    });
});

app.listen(8800, () =>{
    console.log("Server started!");
})
