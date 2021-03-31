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
					var lat = data.coord.lat;
					var lon = data.coord.lon;
					getCurrentWeather(lat, lon);
				});
			} else {
				alert(`Error: ${response.statusText}`);
			}
		})
		.catch(function (error) {
			alert("Unable to find weather data.");
		});
};

// function that gets weather based on coordinates (lat & long)
var getCurrentWeather = function (lat, lon) {
	// format the api url
	var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely&appid=c06ce19a48a657fbd564f534f209828a`;

	fetch(url)
		.then(function (response) {
			// request was successful
			if (response.ok) {
				response.json().then(function (data) {
					console.log(data);
					showCurrentWeather(data);
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
	var temp = Math.round((data.current.temp - 273.15) * 1000) / 1000;
	var hum = Math.round(data.current.humidity * 1000) / 1000;
	var wind = Math.round(data.current.wind_speed * 1000) / 1000;
	var UV = Math.round(data.current.uvi * 1000) / 1000;

	// show information on the page
	$("#currentTemp").text(` ${temp}`);
	$("#currentHum").text(` ${hum}`);
	$("#currentWind").text(` ${wind} `);
	$("#currentUV").text(` ${UV}`);
};

getCoordinates("Toronto");
