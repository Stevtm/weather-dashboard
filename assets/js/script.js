// initialize luxon variable
var DateTime = luxon.DateTime;

// ----- functions that handle recent search saving and display -----
// declare an array to hold recent searches
var recentsArray = [];

// function that loads recent searches from localStorage
var loadRecents = function () {
	recentsArray = JSON.parse(localStorage.getItem("recentSearches"));

	// if there is nothing in localStorage, create a new array to hold recent searches
	if (!recentsArray) {
		recentsArray = [];
	}
};

loadRecents();

// function that displays recent searches on the page
var showRecents = function () {
	// clear the existing recents on the page
	$("#recent-searches").find("a").remove();

	// for the first 5 array indexes in the recentsArray, create an element
	for (var i = 0; i < 5; i++) {
		// create an <a> element
		var recentEl = $("<a>")
			.addClass(
				"recent-search p-2 text-lg border-t border-gray-700 w-full hover:bg-blue-100"
			)
			.text(recentsArray[i]);

		// append to the DOM
		$("#recent-searches").append(recentEl);
	}
};

showRecents();

// ----- use openweathermap api to get weather information -----
// function that gets latitude and longitude based on city input
var getCoordinates = function (location) {
	// format the api url
	var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=c06ce19a48a657fbd564f534f209828a`;

	fetch(url)
		.then(function (response) {
			// request was successful
			if (response.ok) {
				response.json().then(function (data) {
					// parse the unix timestamp using luxon
					var date = DateTime.fromSeconds(data.dt).toLocaleString({
						weekday: "long",
						month: "long",
						day: "numeric",
					});

					// update the page with the location name and current date
					$("#city-title").text(`${data.name}, ${data.sys.country}`);
					$("#current-date").text(`${date}`);

					// push location name to localStorage array
					recentsArray.unshift(`${data.name}, ${data.sys.country}`);
					localStorage.setItem("recentSearches", JSON.stringify(recentsArray));

					// show updated list of recents on the page
					showRecents();

					// get latitude and longitude data
					var lat = data.coord.lat;
					var lon = data.coord.lon;
					getWeather(lat, lon);
				});
			} else {
				alert(`Error: ${response.statusText}`);
			}
		})
		.catch(function (error) {
			alert("Unable to find weather data.");
		});
};

// function that gets current weather based on coordinates (lat & long)
var getWeather = function (lat, lon) {
	// format the api url
	var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=c06ce19a48a657fbd564f534f209828a`;

	fetch(url)
		.then(function (response) {
			// request was successful
			if (response.ok) {
				response.json().then(function (data) {
					// show the current weather
					showCurrentWeather(data.current);

					// show the weather forecast for the next 5 days
					showForecast(data.daily.slice(1, 6));
				});
			} else {
				alert(`Error: ${response.statusText}`);
			}
		})
		.catch(function (error) {
			alert("Unable to find weather data.");
		});
};

// function that displays the current weather information on the page
var showCurrentWeather = function (data) {
	// declare variables for all required information from the weather object
	var temp = Math.round((data.temp - 273.15) * 1000) / 1000;
	var hum = Math.round(data.humidity * 1000) / 1000;
	var wind = Math.round(data.wind_speed * 1000) / 1000;
	var UV = Math.round(data.uvi * 1000) / 1000;

	// get the correct icon to represent the weather conditions
	var weatherIcon = getWeatherIcon(data.weather[0].main);

	// create element for the current temperature
	var tempEl = $("<p>")
		.addClass("flex flex-col justify-center text-4xl font-semibold")
		.text(`${temp}°C`);

	// create information elements to hold current weather information
	var humEl = $("<p>")
		.addClass("border-t border-gray-700 px-6 py-1 text-lg w-full")
		.text(`Humidity: ${hum}%`);
	var windEl = $("<p>")
		.addClass("border-t border-gray-700 px-6 py-1 text-lg w-full")
		.text(`Wind Speed: ${wind} m/s`);

	// create information element to hold UV index and style based on index
	var UVEl = $("<p>")
		.addClass("border-t border-gray-700 px-6 py-1 rounded-b-md text-lg w-full")
		.text(`UV Index: ${UV}`);

	if (UV >= 1 && UV <= 2) {
		UVEl.addClass("bg-green-500");
	} else if (UV >= 3 && UV <= 5) {
		UVEl.addClass("bg-yellow-300");
	} else if (UV >= 6 && UV <= 7) {
		UVEl.addClass("bg-yellow-600");
	} else if (UV >= 8 && UV <= 10) {
		UVEl.addClass("bg-red-600");
	} else if (UV >= 11) {
		UVEl.addClass("bg-purple-600");
	}

	// clear the current contents of the current-snapshot and current-conditions div
	$("#current-snapshot").find("p").remove();
	$("#current-snapshot").find("img").remove();
	$("#current-conditions").find("p").remove();

	// append the snapshot elements to the current-snapshot div
	$("#current-snapshot").append(tempEl, weatherIcon);

	// append information elements to the current-conditions div
	$("#current-conditions").append(humEl, windEl, UVEl);
};

// function that displays the forecast for the next 5 days
var showForecast = function (days) {
	// clear the current contents (previous search) from the forecasts div
	$("#forecasts").find("div").remove();

	// create a new element for each of the next 5 days
	for (var day of days) {
		// get the relevant information to be displayed
		var date = DateTime.fromSeconds(day.dt).toLocaleString({
			weekday: "long",
			month: "long",
			day: "numeric",
		});
		var temp = Math.round((day.temp.day - 273.15) * 1000) / 1000;
		var wind = Math.round((day.wind_speed * 1000) / 1000);
		var hum = Math.round(day.humidity * 1000) / 1000;

		// get the correct icon to represent the weather conditions
		var weatherIcon = getWeatherIcon(day.weather[0].main);

		// create container div to hold information
		var forecastEl = $("<div>").addClass("p-10 m-2 bg-green-600 text-white");

		// create information elements to append to container div
		var dateEl = $("<h4>").text(date);
		var tempEl = $("<p>").text(`Temp: ${temp}°C`);
		var windEl = $("<p>").text(`Wind Speed: ${wind} m/s`);
		var humEl = $("<p>").text(`Humidity: ${hum}%`);

		// append information elements to container div
		forecastEl.append(dateEl, weatherIcon, tempEl, windEl, humEl);

		// append container div to the DOM element
		$("#forecasts").append(forecastEl);
	}
};

// function that creates the correct icon based on the weather condition
var getWeatherIcon = function (weather) {
	var weatherIcon = $("<img>");

	switch (weather) {
		case "Thunderstorm":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/11d@2x.png");
			break;
		case "Drizzle":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/09d@2x.png");
			break;
		case "Rain":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/10d@2x.png");
			break;
		case "Snow":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/13d@2x.png");
			break;
		case "Atmosphere":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/50d@2x.png");
			break;
		case "Clouds":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/02d@2x.png");
			break;
		case "Clear":
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/01d@2x.png");
			break;
		default:
			weatherIcon.attr("src", "http://openweathermap.org/img/wn/01d@2x.png");
	}

	return weatherIcon;
};

// ----- add event listeners that trigger site actions -----
// get the user input for the city search when the search button is clicked
$("#submit-search").on("click", function () {
	// get the information in the input field
	var cityName = $("#city-name").val().trim();

	getCoordinates(cityName);
});

// search for corresponding city when the previous search is clicked
$("#recent-searches").on("click", "a", function () {
	// get the city name from the element
	var cityName = $(this).text().trim();

	getCoordinates(cityName);
});

getCoordinates("Vancouver");
