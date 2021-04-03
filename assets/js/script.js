const kelvin = 273.15
var searchFormEl = document.querySelector('#search-form');
var cityNameEl = document.querySelector("#city-name");
var cityAndDateEl = document.querySelector("#city-and-date");
var currentTempEl = document.querySelector("#current-temp");


// --------------------------------------------------------------------

function displayTheWeather(weather, city) {
    // console.log(theWeather);
    console.log("Weather Current Temperature = ", weather.main.temp;
    console.log("Weather Humidity = ", weather.main.humidity);
    console.log(city + " latitude = " + weather.coord.lat);
    console.log(city + " longitude = " + weather.coord.lon);
    cityAndDateEl.textContent = weather.name;
    currentTempEl.textContent = "Temp: " + ((1.8 * (weather.main.temp - 273)) + 32).toFixed();

}


function getTheWeather(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + appID;
    console.log("apiURL = " + apiURL);

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                displayTheWeather(data, cityname);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeather API for Current Weather');
    });
};

// --------------------------------------------------------------------


function displayTheForecast(city, theForecast) {
    console.log(theForecast);

}


function getTheForecast(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=" + appID;
    console.log("apiURL = " + apiURL);

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                displayTheForecast(data, cityname);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeather API for Forecast');
    });
};


// --------------------------------------------------------------------


var searchFormHandler = function(event) {
        event.preventDefault();
        // console.log("City Name = " + cityNameEl.value);
        var cityName = cityNameEl.value.trim();
        console.log("City Name = " + cityName);
        if (cityName) {
            getTheWeather(cityName);
            getTheForecast(cityName);
    
            cityNameEl.value = '';
        } else {
            alert('Please enter a city name');
        }
};

searchFormEl.addEventListener('submit', searchFormHandler);
