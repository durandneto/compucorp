var status = require('http-status');

exports.$windCanvas = function($http){
    var canvas
    , ctx
    , width
    , height
    , x
    , y
    , windSpeed
    , angleInDegrees = 1;

    var image=document.createElement("img");
    image.onload=function(){
      if(ctx != undefined)
        ctx.drawImage(image,canvas.width/2-image.width/2,canvas.height/2-image.width/2);
    }

    image.src="https://cdn2.iconfinder.com/data/icons/industry-3/512/rotor-32.png";
    
    // Called after the DOM is ready (page loaded)
    function init(idCanvas,speed) {
      // init the different variables
      canvas = document.querySelector("#"+idCanvas);
      if(canvas){
        
        ctx = canvas.getContext('2d');
        
        width = canvas.width;
        height = canvas.height;

        angleInDegrees = 1;
        if(speed < 1){
          speed = 1;
        }

        windSpeed = speed;
        // Start animation
        animationLoop();
      }
    }
    
    function drawRotated(degrees){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(degrees*Math.PI/180);
        ctx.drawImage(image,-image.width/2,-image.width/2);
        ctx.restore();
    } 
    
    function animationLoop() {
      // an animation is : 1) clear canvas and 2) draw shapes, 
      // 3) move shapes, 4) recall the loop with requestAnimationFrame
      // clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.strokeRect(x, y, 10, 10);

      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

//      apply rotate
      // console.log(parseInt(windSpeed));
      drawRotated(angleInDegrees);
      // increment the velocity
      angleInDegrees += windSpeed;

      // request frame 60 fps to update canvas
      requestAnimationFrame(animationLoop);
    }  
 

  return {
    init:init
  }

}
exports.$weather = function($http){

  var geolocation
  , api_openweather = 'http://api.openweathermap.org/data/2.5/weather?'
  , api_openweather_nextday = 'http://api.openweathermap.org/data/2.5/forecast/daily?'
  , openweather_key = '8d0ae863745d6192e0282e029267d8dd'
  , positionUser  = false
  , callbackUserFunction;

  function verify(){
    if(navigator.geolocation){
      geolocation = navigator.geolocation
      return true;    
    }else{
      geolocation = null;
      return false;
    }
  }

  function isInt(n) {
     return n % 1 === 0;
  }

  function getNextDay(cityId,_callback){
    $http.get(api_openweather_nextday+'id='+cityId+'&cnt=10&APPID='+openweather_key).success(function(response){
      _callback(response);
    }).error(function(){

    });
  }

  function getPlace(city,_callback){

    callbackUserFunction = _callback;

    if (angular.isDefined(city) && city != ''){

      $http.get(api_openweather+'q='+city+'&APPID='+openweather_key)
      .success(function(response){
        _callback(response);
        
      }).error(function(){
        _callback(false);
      });

    }else{
      getCurrentPosition();
    }
  }
  function getPlaceByLatLon(position){
    $http.get(api_openweather+'lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&APPID='+openweather_key)
    .success(function(response){
      callbackUserFunction(response);
    }).error(function(){
      _callback(false);
    });
  }

  function kelvinConverter(main,_callback){
    var celsius = {};
    celsius.temp = {
      actual : Math.round(main.temp - 273.15)
      , min : Math.round(main.temp_min - 273.15)
      , max : Math.round(main.temp_max - 273.15)
    };

    var fahrenheit = {};
    fahrenheit.temp = {
      actual : Math.round(((main.temp - 273.15)*9/5)+32)
      , min : Math.round(((main.temp_min - 273.15)*9/5)+32)
      , max : Math.round(((main.temp_max - 273.15)*9/5)+32)
    };

    _callback(celsius,fahrenheit);
  }

  function convertDirectionDegree(deg,_callback){
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

      _callback(direction);
  }



  function _callbackError(error) {


    switch(error.code) {
        case error.PERMISSION_DENIED:
            _error_message = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            _error_message = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            _error_message = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            _error_message = "An unknown error occurred."
            break;
    }

      getPlace('London',callbackUserFunction);
  }

  function _callbackSuccess(positionResponse){
    positionUser = positionResponse;
    getPlaceByLatLon(positionUser);
  }

  function convertTimestamp(sys,_callback){

    var res = {};
    var pubDate = new Date();
    pubDate.setTime(sys.sunrise * 1000); 
    res.sunrise = pubDate.getHours()+':'+pubDate.getMinutes();

    var pubDate = new Date();
    pubDate.setTime(sys.sunset * 1000); 
    res.sunset = pubDate.getHours()+':'+pubDate.getMinutes();

    _callback(res);
  }

  function getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(_callbackSuccess,_callbackError);
  }
   

  return {
     getPlace : getPlace
    , kelvinConverter : kelvinConverter
    , convertDirectionDegree : convertDirectionDegree
    , convertTimestamp : convertTimestamp
    , getNextDay : getNextDay
  }

}