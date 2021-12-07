const cityEl = document.getElementById("enter-city");
const searchEl = document.getElementById('search-button');
const clearEl = document.getElementById('clear-history');
const nameEl = document.getElementById('city-name');
const currentPicEl = document.getElementById('current-pic');
const currentTempEl = document.getElementById('temperature');
const currentHumidityEl = document.getElementById('humidity');
const currentWindEl = document.getElementById('wind-speed');
const currentUVEl = document.getElementById('UV-index');
const historyEl = document.getElementById('history');

var fivedayEl = document.getElementById('fiveday-header');
var todayweatherEl = document.getElementById('today-weather');

// API key for making API calls
const APIKey = 'af48d67960dc6c043fc7658bf1e89f7f';
    