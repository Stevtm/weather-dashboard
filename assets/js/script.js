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

// function to display the current weather information on the page
var showCurrentWeather = function (data) {
	// declare variables for all required information from the weather object
	var temp = Math.round((data.temp - 273.15) * 1000) / 1000;
	var hum = Math.round(data.humidity * 1000) / 1000;
	var wind = Math.round(data.wind_speed * 1000) / 1000;
	var UV = Math.round(data.uvi * 1000) / 1000;

	// show information on the page
	$("#currentTemp").text(` ${temp}`);
	$("#currentHum").text(` ${hum}`);
	$("#currentWind").text(` ${wind} `);
	$("#currentUV").text(` ${UV}`);
};

var showForecast = function (days) {
	console.log(days);
	// create a new element for each of the next 5 days
	for (var day of days) {
		// get the relevant information to be displayed
		var date = day.dt;
		var temp = Math.round((day.temp.day - 273.15) * 1000) / 1000;
		var hum = Math.round(day.humidity * 1000) / 1000;

		// create container div to hold information
		var forecastEl = $("<div>").addClass("p-10 m-2 bg-green-600 text-white");

		// create information elements to append to container div
		var dateEl = $("<h4>").text(date);
		var tempEl = $("<p>").text(`Temp: ${temp}`);
		var humEl = $("<p>").text(`Humidity: ${hum}`);

		// append information elements to container div
		forecastEl.append(dateEl, tempEl, humEl);

		// append container div to the DOM element
		$("#forecasts").append(forecastEl);
	}
};

getCoordinates("Toronto");
