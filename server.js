require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

app.get('/', (req, res) => {
    res.send('Server is running');
  });
  

app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Lille&appid=${process.env.OPENWEATHER_API_KEY}`);
    const { temp, humidity } = response.data.main;
    res.json({ temp, humidity });
  } catch (error) {
    res.status(500).send('Error retrieving weather data');
  }
});


// Créer un serveur HTTP basé sur l'application Express
const server = http.createServer(app);

// Créer un serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New client connected');

  // Envoi périodique de données météo
  const sendWeatherUpdate = async () => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${process.env.OPENWEATHER_API_KEY}`);
      const { temp, humidity } = response.data.main;
      const dataToSend = { temp, humidity };
    console.log('Sending data:', dataToSend);
      ws.send(JSON.stringify({ temp, humidity }));
    } catch (error) {
      console.error('Error retrieving weather data');
    }
  };

  // Envoi des données toutes les minutes (60000 ms)
  const intervalId = setInterval(sendWeatherUpdate, 60000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
