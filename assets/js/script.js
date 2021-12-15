// Search and localStorage variables
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('button-addon2');
const searchHistory = document.getElementById('history');
// Current weather variables
const todayWeather = document.getElementById('today-weather');
const todayPic = document.getElementById('today-pic');
const cityName = document.getElementById('city-name');
const todayTemp = document.getElementById('temp');
const todayHum = document.getElementById('humidity');
const todayWind = document.getElementById('wind');
const todayUV = document.getElementById('uv');
// 5 day forecast variables
const fivedayForecast = document.getElementById('fiveday-forecast');
const fivedayTitle = document.getElementById('fiveday-title');
// API Key
const apiKey = 'af48d67960dc6c043fc7658bf1e89f7f';

// Make sure to remove d-none from todayWeather(id=today-weather) and fivedayForecast(id=fiveday-forecast)

// event listener for search functionality and pass that value off to the function

searchBtn.addEventListener('click', function() {
    var searchValue = cityInput.value;
    var cityName = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;
    getLatLong(cityName);
});

function getLatLong(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            console.log(data.coord.lat)
            console.log(data.coord.lon)

            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;

            var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely&appid=" + apiKey;
            getForecast(oneCall);
        })
};

function getForecast(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}