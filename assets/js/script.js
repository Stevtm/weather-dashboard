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
			.addClass("p-1 m-1 text-lg border border-black")
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
					var date = DateTime.fromSeconds(data.dt).toLocaleString(
						DateTime.DATE_MED
					);

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

	// create information elements to hold current weather information
	var tempEl = $("<p>").text(`Temperature: ${temp}°C`);
	var humEl = $("<p>").text(`Humidity: ${hum}%`);
	var windEl = $("<p>").text(`Wind Speed: ${wind} m/s`);
	var UVEl = $("<p>").text(`UV Index: ${UV}`);

	// clear the current contents of the current-conditions div
	$("#current-conditions").find("p").remove();

	// append information elements to the current-conditions div
	$("#current-conditions").append(tempEl, humEl, windEl, UVEl);
};

// function that displays the forecast for the next 5 days
var showForecast = function (days) {
	// clear the current contents (previous search) from the forecasts div
	$("#forecasts").find("div").remove();

	// create a new element for each of the next 5 days
	for (var day of days) {
		// get the relevant information to be displayed
		var date = DateTime.fromSeconds(day.dt).toLocaleString(DateTime.DATE_MED);
		var temp = Math.round((day.temp.day - 273.15) * 1000) / 1000;
		var wind = Math.round((day.wind_speed * 1000) / 1000);
		var hum = Math.round(day.humidity * 1000) / 1000;

		// create container div to hold information
		var forecastEl = $("<div>").addClass("p-10 m-2 bg-green-600 text-white");

		// create information elements to append to container div
		var dateEl = $("<h4>").text(date);
		var tempEl = $("<p>").text(`Temp: ${temp}°C`);
		var windEl = $("<p>").text(`Wind Speed: ${wind} m/s`);
		var humEl = $("<p>").text(`Humidity: ${hum}%`);

		// append information elements to container div
		forecastEl.append(dateEl, tempEl, windEl, humEl);

		// append container div to the DOM element
		$("#forecasts").append(forecastEl);
	}
};

// ----- get the user input for the city search -----
$("#submit-search").on("click", function () {
	// get the information in the input field
	var cityName = $("#city-name").val().trim();

	getCoordinates(cityName);
});
