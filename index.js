const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Manually load .env since dotenv isn't installed
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const ACCESS_TOKEN = envFile.split('=')[1].trim();

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

const OBJECT_TYPE = '2-268160164'; // your Practicum Item object ID
const BASE_URL = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

// Homepage - list all records
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?properties=name,category,description`, { headers });
    res.render('homepage', { title: 'Practicum Items | Integrating With HubSpot I Practicum', records: response.data.results });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching records');
  }
});

// Show the create form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Handle form submission - create a new record
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, category, description } = req.body;
    await axios.post(BASE_URL, {
      properties: { name, category, description }
    }, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));