const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(process.env.OFFER_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from OFFER_URL:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

module.exports = router;
