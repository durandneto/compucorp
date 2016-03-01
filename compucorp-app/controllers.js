exports.SearchBarController = function($scope,$window,$interval,$weather,$location) {

  $scope.checkIfEnterKeyWasPressed = function($event){
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
       $location.path("weather/"+$scope.city);
    }

  };
 
  $scope.verifyScroll = function(){
    angular.element($window).bind("scroll", function() {
      if(this.pageYOffset > 100 ){
        $scope.scrollActive = 'active';
      }else{
        $scope.scrollActive = '';
      }
    });
  };

  $interval($scope.verifyScroll,1000);

  setTimeout(function() {
    $scope.$emit('SearchBarController');
  }, 0);
};
 
exports.WeatherCityController = function($scope,$weather,$stateParams,$windCanvas,$timeout){


  if(angular.isDefined($stateParams.city)){
    $scope.city = $stateParams.city;
  } 

  $scope.degree = 'F';
  $scope.degreeSwitch = 'C';
  $scope.messageSwitchDegree = 'Switch to';
  $scope.defaultLoading = false;

  $scope.convertDirectionDegree = function(deg){
    var direction;

      if (deg>11.25 && deg<33.75){
        direction = "NNE";
      }else if (deg>33.75 && deg<56.25){
        direction = "ENE";
      }else if (deg>56.25 && deg<78.75){
        direction = "E";
      }else if (deg>78.75 && deg<101.25){
        direction = "ESE";
      }else if (deg>101.25 && deg<123.75){ 
        direction = "ESE";
      }else if (deg>123.75 && deg<146.25){
        direction = "SE";
      }else if (deg>146.25 && deg<168.75){
        direction = "SSE";
      }else if (deg>168.75 && deg<191.25){
        direction = "S";
      }else if (deg>191.25 && deg<213.75){
        direction = "SSW";
      }else if (deg>213.75 && deg<236.25){
        direction = "SW";
      }else if (deg>236.25 && deg<258.75){
        direction = "WSW";
      }else if (deg>258.75 && deg<281.25){
        direction = "W";
      }else if (deg>281.25 && deg<303.75){
        direction = "WNW";
      }else if (deg>303.75 && deg<326.25){
        direction = "NW";
      }else if (deg>326.25 && deg<348.75){
        direction = "NNW";
      }else{
        direction = "N"; 
      }

      return deg +" m/s "+ direction;
  }

  $scope.formatDate = function(dt){

    var today = new Date();


    var pubDate = new Date();
    pubDate.setTime(dt * 1000);

    // if(today.getDay() == pubDate.getDay()){
    //   return 'Today';
    // }
    var weekday=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
    var monthname=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
    var formattedDate = weekday[pubDate.getDay()] + ' ' 
                    + monthname[pubDate.getMonth()] + ' ' 
                    + pubDate.getDate() + ', ' + pubDate.getFullYear()
 
    return formattedDate;

  }

  $scope.formatTemp = function(temp){
    return  Math.round(((temp- 273.15)*9/5)+32);
  }

  $scope.getPlace = function($place){
    $scope.defaultLoading = true;
    $weather.getPlace($place,function (defaultPlace){

      if(defaultPlace){

        $scope.default = defaultPlace;
          $weather.kelvinConverter(defaultPlace.main,function(celsius,fahrenheit){
            $scope.celsius = celsius.temp;
            $scope.fahrenheit = fahrenheit.temp;
            $scope.temp = fahrenheit.temp;
          }); 

          $weather.convertDirectionDegree(defaultPlace.wind.deg,function(direction){
            $scope.wind_direction = direction; 
          });

          $weather.convertTimestamp(defaultPlace.sys,function(hours){
            $scope.sunrise = hours.sunrise;
            $scope.sunset = hours.sunset;
             
          });

          $weather.getNextDay(defaultPlace.id,function(nextDays){
            $scope.nextDays  = nextDays.list ;

          });

          $scope.defaultLoading = false;

          $timeout(function(){
            $windCanvas.init("windCanvas",defaultPlace.wind.speed); 
          });

      }
    });
  }

  $scope.changeTempLocation = function (){
    $scope.degreeSwitch = $scope.degree;
    if($scope.degree == 'C'){
      $scope.degree = 'F';
      $scope.temp =  $scope.fahrenheit;
    }else{
      $scope.degree = 'C';
      $scope.temp =  $scope.celsius;
    }
  }

   setTimeout(function() {
    $scope.getPlace($scope.city);
    $scope.$emit('WeatherCityController');
  }, 0);

}