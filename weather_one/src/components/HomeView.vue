<script setup>
import { ref, onMounted } from 'vue';

const weatherData = ref(null);

onMounted(() => {
  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    console.log('Data received:', event.data);
    weatherData.value = JSON.parse(event.data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}); 


</script>

<template>
  <div class="weather-container">
    <h1>Météo Lille</h1>
    <p v-if="weatherData && weatherData.temp">Température: {{ Math.round(weatherData.temp - 273.15) }}°C</p>
    <p v-if="weatherData && weatherData.humidity">Humidité: {{ weatherData.humidity }}%</p>
  </div>
</template>

<style scoped>
.weather-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weather-container h1 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 24px;
}

.weather-container p {
  margin: 10px 0;
  font-size: 18px;
  color: #666;
}

</style>