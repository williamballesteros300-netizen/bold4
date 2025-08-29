const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();

// ⚠️ Permitir CORS desde cualquier dominio
app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

// ⚠️ Llave secreta de Bold (NO la pública)
const BOLD_SECRET_KEY = "eXqF2rQTnlNI6DGHY2M0eQ";

// Ruta para generar la firma
app.post("/generar-firma", (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    // Concatenamos valores en el orden correcto
    const payload = `${orderId}${amount}${currency}${BOLD_SECRET_KEY}`;

    // Generamos hash SHA256
    const signature = crypto.createHash("sha256").update(payload).digest("hex");

    res.json({ integritySignature: signature });
  } catch (err) {
    console.error("Error al generar firma:", err);
    res.status(500).json({ error: "No se pudo generar la firma" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));

