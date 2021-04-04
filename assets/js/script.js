const kelvin = 273.15
var searchFormEl = document.querySelector('#search-form');
var cityNameEl = document.querySelector("#city-name");
var cityAndDateEl = document.querySelector("#city-and-date");
var currentTempEl = document.querySelector("#current-temp");
var currentWindEl = document.querySelector("#current-wind");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentUVIndexEl = document.querySelector("#current-uv-index");
var forecastCardArray = document.querySelectorAll(".forecast-card-div");
var storedSearchedCities = [];
var saveCityName;

var latitude = 0;
var longitude = 0;


// --------------------------------------------------------------------

function getCityCoordinates(weather, city) {
    console.log(city + " latitude = " + weather.coord.lat);
    console.log(city + " longitude = " + weather.coord.lon);
    console.log(weather);
    latitude = weather.coord.lat;
    longitude = weather.coord.lon;
    console.log("City Name = " + weather.name);
    cityAndDateEl.textContent = weather.name + " ";
    saveCityName = weather.name;
    console.log("weather.name = " + weather.name);

}


function fetchFirstAPI(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + appID;
    console.log("apiURL = " + apiURL);

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            // console.log(response);
            response.json().then(function (data) {
                // console.log(data);
                getCityCoordinates(data, cityname);
                getTheForecast(cityname);
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

function displayTheForecast(weather, city) {
    var dailyForecastArray = weather.daily;
    console.log(dailyForecastArray);

    // Display current conditions
    var currentDate = moment(weather.daily[0].dt,'X').format("(MM-DD-YYYY)"); 
    console.log("weather.current.dt = " + weather.current.dt);
    currentTempEl.textContent = "Temp: " + weather.current.temp + " Degrees F";
    currentWindEl.textContent = "Winds: " + weather.current.wind_speed + " MPH";
    currentHumidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    currentUVIndexEl.textContent = "UV Index: " + weather.current.uvi;
    cityAndDateEl.textContent += currentDate;
    
    // display 5-day forecast
    var iconURL = "http://www.openweathermap.org/img/wn/";
    for (var i = 1; i < 6; i++) {
        var forecastDate = moment(weather.daily[i].dt,'X').format("MM-DD-YYYY");
        var dateEl = document.createElement("h5");
        dateEl.innerHTML = forecastDate;
        forecastCardArray[i-1].appendChild(dateEl);
        console.log("weather icon = " + weather.daily[i].weather[0].icon + ".png");        
        var weatherIcon = iconURL + weather.daily[i].weather[0].icon + ".png";
        var iconEl = document.createElement("img");
        iconEl.src = weatherIcon;
        iconEl.classList.add("float-left");
        iconEl.classList.add("weather-icon");
        console.log(iconEl);
        forecastCardArray[i-1].appendChild(iconEl);
        var tempEl = document.createElement("p");
        tempEl.innerHTML = "Temp: " + weather.daily[i].temp.max;
        forecastCardArray[i-1].appendChild(tempEl);
        var windEl = document.createElement("p");
        windEl.innerHTML = "Wind: " + weather.daily[i].wind_speed + "MPH";
        forecastCardArray[i-1].appendChild(windEl);
        var humidityEl = document.createElement("p");
        humidityEl.innerHTML = "Humidity: " + weather.daily[i].humidity + "%";
        forecastCardArray[i-1].appendChild(humidityEl);
    }



}

// --------------------------------------------------------------------


function getTheForecast(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + 
                "&lon=" + longitude + "&units=imperial" + "&appid=" + appID;
    console.log("apiURL = " + apiURL);

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            // console.log(response);
            response.json().then(function (data) {
                console.log(data);
                displayTheForecast(data, cityname);
                addToSavedCities();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeather API for Forecast');
    });
};



function addToSavedCities() {
    var inSavedCities = false;
    var savedCitiesButtonArray = document.querySelectorAll(".saved-cities");
    // console.log(savedCitiesButtonArray[0].innerHTML);
    // console.log(saveCityName);
    // console.log("length =" + savedCitiesButtonArray.length);
    for (var i = 0; i < savedCitiesButtonArray.length; i++) {

        if (savedCitiesButtonArray[i].innerHTML === saveCityName) {
            inSavedCities = true;
            break;
        }
    }
    if (!inSavedCities) {
        // display as a button on screen
        var savedCitiesDiv = document.querySelector("#saved-cities-div");
        var savedCityButton = document.createElement("button");
        savedCityButton.classList.add("btn");
        savedCityButton.classList.add("btn-block");
        savedCityButton.classList.add("btn-primary");
        savedCityButton.classList.add("btn-lg");
        savedCityButton.classList.add("saved-cities");
        savedCityButton.setAttribute("id", saveCityName);
        // console.log("saveCityName = " + saveCityName);
        savedCityButton.innerHTML = saveCityName;
        savedCitiesDiv.appendChild(savedCityButton);

        // save to local storage
        if (storedSearchedCities == null) {
            storedSearchedCities = [saveCityName];
        } else {
            storedSearchedCities.push(saveCityName);            
        }
        storedSearchedCities.sort();
        localStorage.setItem("storedSearchedCities", JSON.stringify(storedSearchedCities));
        savedCityButton.addEventListener("click", function () {

            fetchFirstAPI(event.target.id);
            cityNameEl.value = '';
            for (var i = 0; i < forecastCardArray.length; i++) {
                forecastCardArray[i].innerHTML = "";
            }
        }); 
    }
}



function getSavedCities() {
    storedSearchedCities = JSON.parse(localStorage.getItem("storedSearchedCities"));
    console.log("In getSavedCities()");
    if (storedSearchedCities !== null) {
        // display as a button on screen
        storedSearchedCities.sort();
        var savedCitiesDiv = document.querySelector("#saved-cities-div");
        for (var i = 0; i < storedSearchedCities.length; i++) {
            var savedCityButton = document.createElement("button");
            savedCityButton.classList.add("btn");
            savedCityButton.classList.add("btn-block");
            savedCityButton.classList.add("btn-primary");
            savedCityButton.classList.add("btn-lg");
            savedCityButton.classList.add("saved-cities");
            savedCityButton.setAttribute("id", storedSearchedCities[i]);
            // console.log("saveCityName = " + saveCityName);
            savedCityButton.innerHTML = storedSearchedCities[i];
            savedCitiesDiv.appendChild(savedCityButton);           
        }
    }
}


// --------------------------------------------------------------------


var searchFormHandler = function(event) {
        event.preventDefault();
        // console.log("City Name = " + cityNameEl.value);
        var cityName = cityNameEl.value.trim();
        console.log("City Name = " + cityName);
        if (cityName) {
            fetchFirstAPI(cityName);
            cityNameEl.value = '';
            for (var i = 0; i < forecastCardArray.length; i++) {
                forecastCardArray[i].innerHTML = "";
            }
        } else {
            alert('Please enter a city name');
        }
};


getSavedCities();

searchFormEl.addEventListener('submit', searchFormHandler);

document.querySelectorAll('.saved-cities').forEach(item => {
    item.addEventListener('click', event => {
        console.log("event = ", event);
        fetchFirstAPI(event.target.id);
        cityNameEl.value = '';
        for (var i = 0; i < forecastCardArray.length; i++) {
            forecastCardArray[i].innerHTML = "";
        }
    })
});