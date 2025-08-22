const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚠️ Tu llave secreta de Bold
const BOLD_SECRET_KEY = "x-hvX8om77gzNBWEE7LlXQ";

// Ruta para generar la firma
app.post("/generar-firma", (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    // Concatenamos exactamente como pide Bold: orderId + amount + currency + llave secreta
    const payload = `${orderId}${amount}${currency}${BOLD_SECRET_KEY}`;
    
    // SHA256 simple
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

