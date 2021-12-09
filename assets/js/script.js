function initPage(){    
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

    let searchHistory = JSON.parse(localStorage.getItem('search')) || [];

    // API key for making API calls
    const APIKey = 'af48d67960dc6c043fc7658bf1e89f7f';

    function getWeather(cityName) {
        // Current weather request from open weather API
        let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                // remove display none for current weather
                todayweatherEl.classList.remove('d-none');
                // Parse response to display current weather
                // convert to milliseconds *1000
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                // Add +1 to month so months array correctly corresponds with order of months
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                // prints current city name and date
                nameEl.innerHTML = response.data.name + ' (' + month + '/' + day + '/' + year + ') ';
                // create variable and set current weather icon depending on current weather
                let weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute('src', "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                // set description value from weather
                currentPicEl.setAttribute('alt', response.data.weather[0].description);
                // set text to current temperature(k2f =kelvin to fahrenheit, conversion function at bottom) &#176F is for degree fahrenheit
                currentTempEl.innerHTML = 'Temperature: ' + k2f(response.data.main.temp) + ' &#176F';
                // set text to current humidity
                currentHumidityEl.innerHTML = 'Humidity: ' + response.data.main.humidity + '%';
                // set text for current wind speed
                currentWindEl.innerHTML = 'Wind Speed: ' + response.data.wind.speed + ' MPH';

                // Get UV index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = 'https://api.openweathermap.org/data/2.5/uvi/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&cnt=1';
                axios.get(UVQueryURL)
                    .then(function (response) {
                        // create UVIndex span to edit colors depending on quality of UV Index and print UV Index
                        let UVIndex = document.createElement('span');
                        // When UV index is favorable the color is green, when it's moderate the color is yellow, when it's severe shows red
                        if (response.data[0].value < 4) {
                            UVIndex.setAttribute ('class', 'badge alert-success');
                        } else if (response.data[0].value < 8) {
                            UVIndex.setAttribute ('class', 'badge alert-warning');
                        } else {
                            UVIndex.setAttribute ('class', 'badge alert-danger');
                        }
                        console.log(response.data[0].value)
                        // print UV index
                        UVIndex.innerHTML = response.data[0].value;
                        currentUVEl.innerHTML = 'UV Index: ';
                        currentUVEl.append(UVIndex);
                    });
                    
                    // Get 5 day forecast for searched city
                    let cityID = response.data.id;
                    let forecastQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + APIKey;
                    axios.get(forecastQueryURL)
                        .then(function (response) {
                            // remove display none
                            fivedayEl.classList.remove('d-none');

                            // Parse the response and display 5 day forecast
                            const forecastEls = document.querySelectorAll('.forecast');
                            for (i = 0; i < forecastEls.length; i++) {
                                forecastEls[i].innerHTML = '';
                                const forecastIndex = i * 8 + 4;
                                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                                const forecastDay = forecastDate.getDate();
                                const forecastMonth = forecastDate.getMonth() + 1;
                                const forecastYear = forecastDate.getFullYear();
                                // print 
                                const forecastDateEl = document.createElement('p');
                                forecastDateEl.setAttribute('class', 'mt-3 mb-0 forecast-date');
                                forecastDateEl.innerHTML = forecastMonth + '/' + forecastDay + '/' + forecastYear;
                                forecastEls[i].append(forecastDateEl);

                                // data for 5 day forecast
                                // icon for weather
                                const forecastImgEl = document.createElement('img');
                                forecastImgEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + response.data.list[forecastIndex].weather[0].icon + '@2x.png');
                                forecastImgEl.setAttribute('alt', response.data.list[forecastIndex].weather[0].description);
                                // append images to 5 day forecast
                                forecastEls[i].append(forecastImgEl);
                                // temp data for 5 day forecast
                                const forecastTempEl = document.createElement('p');
                                forecastTempEl.innerHTML = 'Temp: ' + k2f(response.data.list[forecastIndex].main.temp) + ' &#176F';
                                // append temp data to 5 day forecast
                                forecastEls[i].append(forecastTempEl);
                                // humidity data for 5 day forecast
                                const forecastHumidityEl = document.createElement('p');
                                forecastHumidityEl.innerHTML = 'Humidity ' + response.data.list[forecastIndex].main.humidity + '%';
                                // append humidity data to 5 day forecast
                                forecastEls[i].append(forecastHumidityEl);
                            }
                        })
            })
    }

    // Get history from local storage
    searchEl.addEventListener('click', function() {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem('search', JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear History button function
    clearEl.addEventListener('click', function() {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    // Kelvin to fahrenheit function (data.main.temp pulls kelvin by default)
    function k2f(k) {
        return Math.floor((k - 273.15) * 1.8 + 32);
    }

    // loop through search history and append to #history form
    function renderSearchHistory() {
        historyEl.innerHTML = '';
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement('input');
            historyItem.setAttribute('type', 'text');
            historyItem.setAttribute('readonly', true);
            historyItem.setAttribute('class', 'form-control d-block bg-white');
            historyItem.setAttribute('value', searchHistory[i]);
            historyItem.addEventListener('click', function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    // call on page load so history is there on refresh
    renderSearchHistory();
    
    console.log(searchHistory);
}
// call initPage on page load
initPage();
