const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json()); 

app.use(express.static(path.join(__dirname, "public")));
app.use('/files', express.static(path.join(__dirname, "../../files")));

const databasePath = path.join(__dirname, "database.json");
const htmlPath = path.join(__dirname, "public/index.html");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/save", async (req, res) => {
    const { text, title } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Texto não pode estar vazio" });
    }

    try {
        let data = {};

        if (fs.existsSync(databasePath)) {
            const fileContent = await fs.promises.readFile(databasePath, "utf8");
            data = JSON.parse(fileContent);
        }

        const id = Date.now().toString();
        data[id] = {
            text,
            title: title || "Inserir Título_", // Se não tiver título, define um padrão
        };

        await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));

        res.json({ link: `http://localhost:${PORT}/${id}` });
    } catch (error) {
        console.error("Erro ao salvar texto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.post("/save-title", async (req, res) => {
    const { id, title } = req.body;

    if (!id || !title) {
        return res.status(400).json({ error: "ID e título são obrigatórios." });
    }

    try {
        let data = {};

        if (fs.existsSync(databasePath)) {
            const fileContent = await fs.promises.readFile(databasePath, "utf8");
            data = JSON.parse(fileContent);
        }

        if (!data[id]) {
            return res.status(404).json({ error: "Texto não encontrado." });
        }

        data[id].title = title;

        await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));

        res.json({ message: "Título atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar título:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get("/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/text/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!fs.existsSync(databasePath)) {
            return res.status(404).json({ error: "Texto não encontrado" });
        }

        const data = await fs.promises.readFile(databasePath, "utf8");
        const jsonData = JSON.parse(data);
        const entry = jsonData[id];

        if (!entry) {
            return res.status(404).json({ error: "Texto não encontrado" });
        }

        res.json({ text: entry.text, title: entry.title || "Inserir Título_" });
    } catch (error) {
        console.error("Erro ao carregar o texto:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

app.listen(PORT, () => {
    console.log(`[CARREGADO] Servidor Colar`);
});