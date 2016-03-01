
exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: 'compucorp-app/templates/search_bar.html'
  };
}; 
exports.weatherCity = function() { 
  return {
    scope: {
            city: "@city",
        },
    controller: 'WeatherCityController',
    templateUrl: 'compucorp-app/templates/weather_city.html'
  };
};  