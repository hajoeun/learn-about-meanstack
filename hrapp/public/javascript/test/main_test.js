decribe('main controller', function() {
 beforeEach(module('app'));
 var _scope;
 var _httpBackend;

 beforeEach(inject(function($controller, $rootScope, EmployeeService, $httpBackend) {

  _scope = $rootScope.$new();
  _httpBackend = $httpBackend;

  $httpBackend.when('GET', '/employees').respond([{
   first: 'Abraham',
   last: 'Lincoln'
  }, {
   first: 'Andrew',
   last: 'Johnson'
  }]);

  $httpBackend.when('POST', '/employees').respond({
   first: 'Grover',
   last: 'Cleveland'
  });

  $controller('main', {
   $scope: _scope,
   EmployeeService: EmployeeService
  });
 }));
});
