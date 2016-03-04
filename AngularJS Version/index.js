var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('compucorp.components', ['ng']); 

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('compucorp', ['compucorp.components','ng','ui.router']);

app.config(function($httpProvider) { 
  
  var loadingCount = 0;

  $httpProvider.interceptors.push(function($q,$rootScope ) {
  
    return {
      request: function(req) {

          if (req.url.charAt(0) === '/') {
             
            req.url = 'http://localhost:3000' + req.url;
            req.withCredentials = true; 
          }

        return req; 
      },
      response: function(response) {
        return response;
      },
      responseError: function (response) {
            return response;
        }
    };
  });
}) 

.config(function($stateProvider, $urlRouterProvider) {

  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: "./templates/home.html",
  })
  .state('weather', {
    url: '/weather/{city}',
    templateUrl: "./templates/home.html",
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})

;