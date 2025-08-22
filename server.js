const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// 🔥 Cambia '*' por tu dominio de Netlify
app.use(cors({
  origin: 'https://rainbow-dragon-0931a2.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY;

app.post('/crear-checkout', async (req, res) => {
  const { valor } = req.body;

  if (!valor || typeof valor !== 'string') {
    return res.status(400).json({ error: 'Valor inválido o no enviado' });
  }

  try {
    const valorLimpio = valor.replace(/[^\d]/g, '');

    const response = await axios.post('https://api.bold.co/v1/checkouts', {
      amount: valorLimpio,
      currency: 'COP',
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL
    }, {
      headers: {
        Authorization: `Bearer ${BOLD_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ url: response.data.checkout_url });
  } catch (error) {
    console.error('Error al crear checkout:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudo crear el checkout' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Bold backend corriendo en puerto ${PORT}`);
});

