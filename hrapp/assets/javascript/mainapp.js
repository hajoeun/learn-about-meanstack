var app = angular.module('app', ['ngRoute', 'ngResource']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/view', {
    templateUrl: 'view.html',
    controller: 'view'
  })
  .when('/edit/:employeeId', {
    templateUrl: 'edit.html',
    controller: 'edit'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);

app.factory('EmployeeService', ['$resource', function($resource) {
  return $resource('/employees/:employeeId', {}, {
    list: {
      isArray: true
    },
    get: {
      isArray: false
    }
  });
}]);
