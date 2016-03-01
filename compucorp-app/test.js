describe('Nav Bar', function() {
  var injector;
  var NavBar;
  var SearchBar;
  var scope;
  var intercepts;
  var httpBackend;
  var WeatherService;


  beforeEach(function() {
    injector = angular.injector(['compucorp.components', 'ngMockE2E']);
    intercepts = {};

    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();

      $httpBackend.whenGET(/.*\/templates\/.*/i).passThrough();
      httpBackend = $httpBackend;

      SearchBar = $compile('<search-bar></search-bar>')(scope);

      WeatherService = injector.get('$weather');

      scope.$apply();
    });



  });

  it('displays an input field', function(done) {

    scope.$on('SearchBarController', function() {

      assert.equal(SearchBar.find('input').length, 2);
      assert.ok(SearchBar.find('input').hasClass('search-bar-input'));
      assert.ok(SearchBar.find('input').hasClass('button_search'));

      done();
    });
  }); 
});
