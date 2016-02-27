app.controller('view', ['$scope', 'EmployeeService', function($scope, EmployeeService) {
  $scope.employees = [];
  $scope.firstName = $scope.lastName = '';

  EmployeeService.list(function (data) {
    $scope.employees = data;
  });
}]);
