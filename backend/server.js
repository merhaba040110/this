require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

app.use(cors());
app.use(express.json());

const BASE_URL = 'https://www.alphavantage.co/query';

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ Error: 'Query parameter is required' });

  try {
    const response = await fetch(`${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Search Error:', error);
    res.status(500).json({ Error: 'Failed to proxy request' });
  }
});

app.get('/api/quote', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ Error: 'Symbol parameter is required' });

  try {
    const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Quote Error:', error);
    res.status(500).json({ Error: 'Failed to proxy request' });
  }
});

app.listen(PORT, () => {
  console.log(`Quantix Backend Proxy running on http://localhost:${PORT}`);
  if (!ALPHA_VANTAGE_API_KEY) {
    console.warn('WARNING: ALPHA_VANTAGE_API_KEY is not set in .env');
  }
});
