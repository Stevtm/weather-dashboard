// call the openweathermap api to get weather information
var getCurrentWeather = function (location) {
	// format the api url
	var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=c06ce19a48a657fbd564f534f209828a`;

	fetch(url).then(function (response) {
		// request was successful
		if (response.ok) {
			response.json().then(function (data) {
				console.log(data);
			});
		}
	});
};

getCurrentWeather("Hamilton");
