    // the search form that includes the search field and button
var searchFormEl = document.querySelector('#search-form');
    // the input field where the user enters the city name
var cityNameEl = document.querySelector("#city-name");
    // the element the city name and date are displayed with current conditions
var cityAndDateEl = document.querySelector("#city-and-date");
    // displays current temperature element 
var currentTempEl = document.querySelector("#current-temp");
    // displays current wind spped element
var currentWindEl = document.querySelector("#current-wind");
    // displays current humidity element
var currentHumidityEl = document.querySelector("#current-humidity");
    // displays the current UV index
var currentUVIndexEl = document.querySelector("#current-uv-index");
    // holds the array of Bootstrap cards that display the daily forecast
var forecastCardArray = document.querySelectorAll(".forecast-card-div");
    // holds the UV index so we can change the background color
var uVIndexSpan = document.querySelector("#uv-span");
    // array of city names from previous searches
var storedSearchedCities = [];
var saveCityName;               // city name global variable;
var latitude = 0;               // lattitude and longitude form 1st API
var longitude = 0;              // call used in 2nd API call


// --------------------------------------------------------------------


// builds and displays the current conditions as well as 
// builds the Bootstrap cards and displays them
function displayTheForecast(weather, city) {

    // Display current conditions
    var currentDate = moment(weather.daily[0].dt,'X').format("(MM-DD-YYYY)"); 
    currentTempEl.textContent = "Temp: " + weather.current.temp + " Degrees F";
    currentWindEl.textContent = "Winds: " + weather.current.wind_speed + " MPH";
    currentHumidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    if (weather.current.uvi < 3) {
        uVIndexSpan.style.backgroundColor = "green";
    } else if (weather.current.uvi >= 3 && weather.current.uvi < 6) {
        uVIndexSpan.style.backgroundColor = "yellow";
    } else if (weather.current.uvi >= 6 && weather.current.uvi < 8) {
        uVIndexSpan.style.backgroundColor = "orange";
    } else {
        uVIndexSpan.style.backgroundColor = "red";
    }
    uVIndexSpan.style.color = "white";     
     uVIndexSpan.innerHTML = "&nbsp" + weather.current.uvi + "&nbsp";
    cityAndDateEl.textContent += currentDate;
    
    // display the 5-day forecast
    var iconURL = "http://www.openweathermap.org/img/wn/";
    for (var i = 1; i < 6; i++) {
        var forecastDate = moment(weather.daily[i].dt,'X').format("MM-DD-YYYY");
        var dateEl = document.createElement("h5");
        dateEl.innerHTML = forecastDate;
        forecastCardArray[i-1].appendChild(dateEl);
         var weatherIcon = iconURL + weather.daily[i].weather[0].icon + ".png";
        var iconEl = document.createElement("img");
        iconEl.src = weatherIcon;
        iconEl.classList.add("float-left");
        iconEl.classList.add("weather-icon");
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

// performs the 2nd fetch to get the current conditions and 5-day forecast
// calls addToSavedCities to save the city name for display with the other
// previously searched cities 
function getTheForecast(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + 
                "&lon=" + longitude + "&units=imperial" + "&appid=" + appID;

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
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


// --------------------------------------------------------------------


// adds the last city name that was searched to the list of previously searched
// cities so they can be searched again.  Also writes it and other previously 
// searched cities to local storage
function addToSavedCities() {
    var inSavedCities = false;
    var savedCitiesButtonArray = document.querySelectorAll(".saved-cities");
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
        
        // put an event listener on the newly created button so when clicked,
        // the city's weather and forecast can be displayed again
        savedCityButton.addEventListener("click", function () {

            fetchFirstAPI(event.target.id);
            cityNameEl.value = '';
            for (var i = 0; i < forecastCardArray.length; i++) {
                forecastCardArray[i].innerHTML = "";
            }
        }); 
    }
}


// --------------------------------------------------------------------


// called when a new search is initiated.
var searchFormHandler = function(event) {
        event.preventDefault();
        var cityName = cityNameEl.value.trim();
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


// --------------------------------------------------------------------


// pulls the coordinates from the data from the first fetch
function getCityCoordinates(weather, city) {
    latitude = weather.coord.lat;
    longitude = weather.coord.lon;
    cityAndDateEl.textContent = weather.name + " ";
    saveCityName = weather.name;
}


// --------------------------------------------------------------------


// builds the API URL, performs the first fetch, and calls the 2nd fetch
function fetchFirstAPI(cityname) {
    var appID = "219b005a9f6aadc643b16112eaf5db5e";
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + appID;

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCityCoordinates(data, cityname);
                getTheForecast(cityname);  // 2nd fetch
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


// when the application starts, check local storage for any city names that
// were previosly displayed.  Create buttons to display each one.
function getSavedCities() {
    storedSearchedCities = JSON.parse(localStorage.getItem("storedSearchedCities"));
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
            savedCityButton.innerHTML = storedSearchedCities[i];
            savedCitiesDiv.appendChild(savedCityButton);           
        }
    }
}


// --------------------------------------------------------------------
// This runs when the application starts
getSavedCities();
// --------------------------------------------------------------------


// Event listener that fires when a search for a new city is entered
// and the form is submitted (clicking the search button or hitting return)
searchFormEl.addEventListener('submit', searchFormHandler);


// Event listeners for all of the previously searched / weather displayed 
// cities.  
document.querySelectorAll('.saved-cities').forEach(item => {
    item.addEventListener('click', event => {
        fetchFirstAPI(event.target.id);
        cityNameEl.value = '';
        for (var i = 0; i < forecastCardArray.length; i++) {
            forecastCardArray[i].innerHTML = "";
        }
    })
});