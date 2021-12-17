// Search and localStorage variables
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('button-addon2');
const historyEl = document.getElementById('history');
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
const firstDayEl = document.getElementById('firstDay');
const secondDayEl = document.getElementById('secondDay');
const thirdDayEl = document.getElementById('thirdDay');
const fourthDayEl = document.getElementById('fourthDay');
const fifthDayEl = document.getElementById('fifthDay'); 
// API Key
const apiKey = 'af48d67960dc6c043fc7658bf1e89f7f';

var searchHistory = JSON.parse(localStorage.getItem('search')) || [];

// Make sure to remove d-none from todayWeather(id=today-weather) and fivedayForecast(id=fiveday-forecast)

// event listener for search functionality and pass that value off to the function

searchBtn.addEventListener('click', function() {
    var searchValue = cityInput.value;
    searchHistory.push(searchValue);
    localStorage.setItem('search', JSON.stringify(searchHistory));
    cityName.innerHTML = searchValue;
    cityName.setAttribute('class', 'text-white text-uppercase text-center');
    var city = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;
    getLatLon(city);
    printSearchHistory();
});

function printSearchHistory() {
    historyEl.innerHTML = '';
    for (let i = 0; i <searchHistory.length; i++) {
        const historyList = document.createElement('input');
        historyList.setAttribute('type', 'text');
        historyList.setAttribute('readonly', true);
        historyList.setAttribute('class', 'form-control d-block text-white text-center text-uppercase bg-dark customCSS');
        historyList.setAttribute('value', searchHistory[i]);
        historyList.innerHTML = historyList.value;
        historyList.addEventListener('click', function(){
            cityName.innerHTML = historyList.value;
            cityName.setAttribute('class', 'text-white text-uppercase text-center');
            var searchedCity = "https://api.openweathermap.org/data/2.5/weather?q=" + historyList.value + "&appid=" + apiKey;
            getLatLon(searchedCity);
            console.log(searchHistory);
        })
        historyEl.append(historyList);
        if (searchHistory.length > 14) {
            localStorage.clear();
            searchHistory = [];
            window.alert('History succeeded maximum limit, refreshing page. (Max = 14)');
            location.reload();
        }
        console.log(historyList.value)
    }
}


function getLatLon(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            console.log(data.coord.lat)
            console.log(data.coord.lon)

            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;

            var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=hourly,minutely&appid=" + apiKey;
            getForecast(oneCall);
        })
};

function getForecast(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            todayWeather.classList.remove('d-none')
            firstDayEl.innerHTML = '';
            secondDayEl.innerHTML = '';
            thirdDayEl.innerHTML = '';
            fourthDayEl.innerHTML = '';
            fifthDayEl.innerHTML = '';
            // generate and append current date
            var currentDate = new Date(data.current.dt * 1000)
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() +1;
            const currentYear = currentDate.getFullYear();
            var cityDate = document.createElement('p');
            cityDate.textContent = "(" + currentMonth + "/" + currentDay + "/" + currentYear + ")";
            cityDate.setAttribute('class', 'text-white');
            cityName.append(cityDate)
            console.log(data)
            console.log(data.daily[0].dt)
            console.log(data.current.weather[0].icon)
            console.log(data.current.weather[0].description)
            // generate current weather image
            let currentWeatherPic = data.current.weather[0].icon;
            todayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentWeatherPic + '@2x.png');
            todayPic.setAttribute('alt', data.current.weather[0].description);
            // generate current weather data
            todayTemp.innerHTML = 'Temperature: ' + data.current.temp + '&#176';
            todayTemp.setAttribute('class', 'text-white text-center');
            todayHum.innerHTML = 'Humidity: ' + data.current.humidity + '%';
            todayHum.setAttribute('class', 'text-white text-center');
            todayWind.innerHTML = 'Wind Speed: ' + data.current.wind_speed + ' MPH';
            todayWind.setAttribute('class', 'text-white text-center');
            let UVI = document.createElement('span');
            if (data.current.uvi < 4) {
                UVI.setAttribute('class', 'badge alert-success')
            } else if (data.current.uvi < 8) {
                UVI.setAttribute('class', 'badge alert-warning')
            } else {
                UVI.setAttribute('class', 'badge alert-danger')
            };
            UVI.innerHTML = data.current.uvi;
            todayUV.innerHTML = 'UV Index: ';
            todayUV.setAttribute('class', 'text-white text-center');
            todayUV.append(UVI);
            // generate 5 day forecast
            // first day pic
            fivedayForecast.classList.remove('d-none');
            let firstDayPic = document.createElement('img');
            let firstDayPicVal = data.daily[1].weather[0].icon;
            firstDayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + firstDayPicVal + '@2x.png');
            firstDayPic.setAttribute('alt', data.daily[1].weather[0].description);
            firstDayPic.setAttribute('class', 'mx-auto d-block')
            firstDayEl.append(firstDayPic);
            // first day date
            var firstDayDate = new Date(data.daily[1].dt * 1000);
            const firstDayDay = firstDayDate.getDate();
            const firstDayMonth = firstDayDate.getMonth() +1;
            const firstDayYear = firstDayDate.getFullYear();
            var firstDate = document.createElement('p');
            firstDate.textContent = 
            "(" + firstDayMonth + "/" + firstDayDay + "/" + firstDayYear + ")";
            firstDate.setAttribute('class', 'text-white text-center');
            firstDayEl.append(firstDate);
            // first day temp
            var firstDayTemp = document.createElement('p');
            firstDayTemp.innerHTML = 'Temperature: ' + data.daily[1].temp.day + '&#176';
            firstDayTemp.setAttribute('class', 'text-white text-center');
            firstDayEl.append(firstDayTemp);
            // first day wind speed
            var firstDayWind = document.createElement('p');
            firstDayWind.innerHTML = 'Wind Speed: ' + data.daily[1].wind_speed + ' MPH';
            firstDayWind.setAttribute('class', 'text-white text-center');
            firstDayEl.append(firstDayWind);
            // first day humidity
            var firstDayHum = document.createElement('p');
            firstDayHum.innerHTML = 'Humidity: ' + data.daily[1].humidity + '%';
            firstDayHum.setAttribute('class', 'text-white text-center');
            firstDayEl.append(firstDayHum);
            // second day pic
            let secondDayPic = document.createElement('img');
            let secondDayPicVal = data.daily[2].weather[0].icon;
            secondDayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + secondDayPicVal + '@2x.png');
            secondDayPic.setAttribute('alt', data.daily[2].weather[0].description);
            secondDayPic.setAttribute('class', 'mx-auto d-block')
            secondDayEl.append(secondDayPic);
            // second day date
            var secondDayDate = new Date(data.daily[2].dt * 1000);
            const secondDayDay = secondDayDate.getDate();
            const secondDayMonth = secondDayDate.getMonth() +1;
            const secondDayYear = secondDayDate.getFullYear();
            var secondDate = document.createElement('p');
            secondDate.textContent = 
            "(" + secondDayMonth + "/" + secondDayDay + "/" + secondDayYear + ")";
            secondDate.setAttribute('class', 'text-white text-center');
            secondDayEl.append(secondDate);
            // second day temp
            var secondDayTemp = document.createElement('p');
            secondDayTemp.innerHTML = 'Temperature: ' + data.daily[2].temp.day + '&#176';
            secondDayTemp.setAttribute('class', 'text-white text-center');
            secondDayEl.append(secondDayTemp);
            // second day wind speed
            var secondDayWind = document.createElement('p');
            secondDayWind.innerHTML = 'Wind Speed: ' + data.daily[2].wind_speed + ' MPH';
            secondDayWind.setAttribute('class', 'text-white text-center');
            secondDayEl.append(secondDayWind);
            // second day humidity
            var secondDayHum = document.createElement('p');
            secondDayHum.innerHTML = 'Humidity: ' + data.daily[2].humidity + '%';
            secondDayHum.setAttribute('class', 'text-white text-center');
            secondDayEl.append(secondDayHum);
            // third day pic
            let thirdDayPic = document.createElement('img');
            let thirdDayPicVal = data.daily[3].weather[0].icon;
            thirdDayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + thirdDayPicVal + '@2x.png');
            thirdDayPic.setAttribute('alt', data.daily[3].weather[0].description);
            thirdDayPic.setAttribute('class', 'mx-auto d-block')
            thirdDayEl.append(thirdDayPic);
            // third day date
            var thirdDayDate = new Date(data.daily[3].dt * 1000);
            const thirdDayDay = thirdDayDate.getDate();
            const thirdDayMonth = thirdDayDate.getMonth() +1;
            const thirdDayYear = thirdDayDate.getFullYear();
            var thirdDate = document.createElement('p');
            thirdDate.textContent = 
            "(" + thirdDayMonth + "/" + thirdDayDay + "/" + thirdDayYear + ")";
            thirdDate.setAttribute('class', 'text-white text-center');
            thirdDayEl.append(thirdDate);
            // third day temp
            var thirdDayTemp = document.createElement('p');
            thirdDayTemp.innerHTML = 'Temperature: ' + data.daily[3].temp.day + '&#176';
            thirdDayTemp.setAttribute('class', 'text-white text-center');
            thirdDayEl.append(thirdDayTemp);
            // third day wind speed
            var thirdDayWind = document.createElement('p');
            thirdDayWind.innerHTML = 'Wind Speed: ' + data.daily[3].wind_speed + ' MPH';
            thirdDayWind.setAttribute('class', 'text-white text-center');
            thirdDayEl.append(thirdDayWind);
            // third day humidity
            var thirdDayHum = document.createElement('p');
            thirdDayHum.innerHTML = 'Humidity: ' + data.daily[3].humidity + '%';
            thirdDayHum.setAttribute('class', 'text-white text-center');
            thirdDayEl.append(thirdDayHum);
            // fourth day pic
            let fourthDayPic = document.createElement('img');
            let fourthDayPicVal = data.daily[4].weather[0].icon;
            fourthDayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + fourthDayPicVal + '@2x.png');
            fourthDayPic.setAttribute('alt', data.daily[4].weather[0].description);
            fourthDayPic.setAttribute('class', 'mx-auto d-block');
            fourthDayEl.append(fourthDayPic);
            // fourth day date
            var fourthDayDate = new Date(data.daily[4].dt * 1000);
            const fourthDayDay = fourthDayDate.getDate();
            const fourthDayMonth = fourthDayDate.getMonth() +1;
            const fourthDayYear = fourthDayDate.getFullYear();
            var fourthDate = document.createElement('p');
            fourthDate.textContent = 
            "(" + fourthDayMonth + "/" + fourthDayDay + "/" + fourthDayYear + ")";
            fourthDate.setAttribute('class', 'text-white text-center');
            fourthDayEl.append(fourthDate);
            // fourth day temp
            var fourthDayTemp = document.createElement('p');
            fourthDayTemp.innerHTML = 'Temperature: ' + data.daily[4].temp.day + '&#176';
            fourthDayTemp.setAttribute('class', 'text-white text-center');
            fourthDayEl.append(fourthDayTemp);
            // fourth day wind speed
            var fourthDayWind = document.createElement('p');
            fourthDayWind.innerHTML = 'Wind Speed: ' + data.daily[4].wind_speed + ' MPH';
            fourthDayWind.setAttribute('class', 'text-white text-center');
            fourthDayEl.append(fourthDayWind);
            // fourth day humidity
            var fourthDayHum = document.createElement('p');
            fourthDayHum.innerHTML = 'Humidity: ' + data.daily[4].humidity + '%';
            fourthDayHum.setAttribute('class', 'text-white text-center');
            fourthDayEl.append(fourthDayHum);
            // fifth day pic
            let fifthDayPic = document.createElement('img');
            let fifthDayPicVal = data.daily[5].weather[0].icon;
            fifthDayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + fifthDayPicVal + '@2x.png');
            fifthDayPic.setAttribute('alt', data.daily[5].weather[0].description);
            fifthDayPic.setAttribute('class', 'mx-auto d-block')
            fifthDayEl.append(fifthDayPic);
            // fifth day date
            var fifthDayDate = new Date(data.daily[5].dt * 1000);
            const fifthDayDay = fifthDayDate.getDate();
            const fifthDayMonth = fifthDayDate.getMonth() +1;
            const fifthDayYear = fifthDayDate.getFullYear();
            var fifthDate = document.createElement('p');
            fifthDate.textContent = 
            "(" + fifthDayMonth + "/" + fifthDayDay + "/" + fifthDayYear + ")";
            fifthDate.setAttribute('class', 'text-white text-center');
            fifthDayEl.append(fifthDate);
            // fifth day temp
            var fifthDayTemp = document.createElement('p');
            fifthDayTemp.innerHTML = 'Temperature: ' + data.daily[5].temp.day + '&#176';
            fifthDayTemp.setAttribute('class', 'text-white text-center');
            fifthDayEl.append(fifthDayTemp);
            // fifth day wind speed
            var fifthDayWind = document.createElement('p');
            fifthDayWind.innerHTML = 'Wind Speed: ' + data.daily[5].wind_speed + ' MPH';
            fifthDayWind.setAttribute('class', 'text-white text-center');
            fifthDayEl.append(fifthDayWind);
            // fifth day humidity
            var fifthDayHum = document.createElement('p');
            fifthDayHum.innerHTML = 'Humidity: ' + data.daily[5].humidity + '%';
            fifthDayHum.setAttribute('class', 'text-white text-center');
            fifthDayEl.append(fifthDayHum);
        })
}

printSearchHistory();
