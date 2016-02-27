app.controller('edit', ['$scope', 'EmployeeService','$routeParams', function($scope, EmployeeService, $routeParams) {
  $scope.employee = {};
  EmployeeService.get({
    employeeId: $routeParams.employeeId
  }, function (data) {
    $scope.employee = data;
  });
}]);
