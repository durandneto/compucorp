
exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: './templates/search_bar.html'
  };
}; 
exports.weatherCity = function() { 
  return {
    scope: {
            city: "@city",
        },
    controller: 'WeatherCityController',
    templateUrl: './templates/weather_city.html'
  };
};  