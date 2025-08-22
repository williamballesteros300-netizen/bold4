const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚠️ Aquí pon tu API Key secreta de Bold (NO la pública)
const BOLD_SECRET_KEY = "x-hvX8om77gzNBWEE7LlXQ";

// Ruta para generar la firma
app.post("/generar-firma", (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    // Concatenamos valores en el orden correcto
    const payload = `${orderId}${amount}${currency}`;
    const signature = crypto
      .createHmac("sha256", BOLD_SECRET_KEY)
      .update(payload)
      .digest("hex");

    res.json({ integritySignature: signature });
  } catch (err) {
    console.error("Error al generar firma:", err);
    res.status(500).json({ error: "No se pudo generar la firma" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
