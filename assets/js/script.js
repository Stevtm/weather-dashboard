// call the openweathermap api to get weather information
var getCurrentWeather = function (location) {
	// format the api url
	var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=c06ce19a48a657fbd564f534f209828a`;

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
	// declare variables for all requiremed information from the weather object
	var temp = Math.round((data.main.temp - 273.15) * 1000) / 1000;
	var hum = Math.round(data.main.humidity * 1000) / 1000;
	var wind = Math.round(data.wind.speed * 1000) / 1000;

	// show information on the page
	$("#currentTemp").text(` ${temp}`);
	$("#currentHum").text(` ${hum}`);
	$("#currentWind").text(` ${wind} `);
};

getCurrentWeather("Hamilton");
