'use strict';
var app = angular.module('app', ['ngRoute', 'ngResource'])
  .constant('config', {
    states: ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
  });

app.config(['$routeProvider', function($routeProvider) {
//클라이언트 쪽 라우터 생성
  $routeProvider
    .when('/', {
      templateUrl: 'home.html'
    })
    .when('/employees', {
      templateUrl: 'employees.html',
      controller: 'EmployeesCtrl'
    })
    .when('/employees/:employeeId', {
      templateUrl: 'employee.html',
      controller: 'EmployeeCtrl'
    })
    .when('/teams', {
      templateUrl: 'teams.html',
      controller: 'TeamsCtrl'
    })
    .when('/teams/:teamId', {
      templateUrl: 'team.html',
      controller: 'TeamCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

//두 서비스(EmployeeService, TeamService)는 $resource에 의존하는데 이는 RESTful API와 상호작용을 쉽게 만들어준다.
app.factory('EmployeeService', ['$resource', function($resource) {
  return $resource('/employees/:employeeId', {}, {
    update: {
      method: 'PUT'
    }
  });
}]);

app.factory('TeamService', ['$resource', function($resource) {
  return $resource('/teams/:teamId');
}]);

//기본 프로필 사진을 설정해주는 imageFallback 지시자, 라우트를 통하지 않고 직원 정보를 편집하도록 해주는 editInLine 지시자
app.directive('imageFallback', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.bind('error', function() {
        angular.element(this).attr('src', attrs.imageFallback);
      });
    }
  };
}).directive('editInLine', function ($compile) {
  var exports = {};
  function link (scope, element, attrs) {
    var template = '<div class="in-line-container">';
    var newElement;
    var displayValue;
    var options;

    switch (attrs.editType) {
    case 'select':
      displayValue = attrs.displayValue ? 'displayValue' : 'value';
      options = attrs.editOption;
      options = options.replace(attrs.editList, 'editList');

      template += '<div class="in-line-value" ng-hide="editing">{{' + displayValue + '}}</div>';
      template += '<select class="in-line-input form-control" ng-show="editing" ng-model="value" ng-options="'+ options +'"></select>';
      break;
    case 'number':
      template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';

      template += '<input class="in-line-input form-control" ng-show="editing" type="number" ng-model="value" step="any" min="0" max="99999" />'
      break;
    default:
      template += '<div class="in-line-value" ng-hide="editing">{{value}}</div>';
      template += '<input class="in-line-input form-control" ng-show="editing" type="text" ng-model="value" />';
    }

    // 바깥쪽 div를 닫는다.
    template += '</div>';
    newElement = $compile(template)(scope);
    element.replaceWith(newElement);

    scope.$on('$destroy', function () {
      newElement = undefined;
      element = undefined;
    });
  }

  exports.scope = {
    value: '=',
    editing: '=',
    editList: '=',
    displayValue: '='
  };
  exports.restrict = 'E';
  exports.link = link;

  return exports;
});

app.controller('EmployeesCtrl', ['$scope', 'EmployeeService', function($scope, service) {
  service.query(function(data, headers) {
    $scope.employees = data;
  }, _handleError);
}]);

app.controller('EmployeeCtrl', ['$scope', '$routeParams', 'EmployeeService', 'TeamService', '$q', 'config', '$route',function($scope, $routeParams, employee, team, $q, config, $route) {
  $scope.address = {};

  function getTeam (teams, teamId) {
    for (var i = 0, l = teams.length; i < l; ++i) {
      var t = teams[i];
      if (t._id === teamId) {
        return t;
      }
    }
  }

  $q.all([
    employee.get({
      employeeId: $routeParams.employeeId
    }).$promise,
    team.query().$promise
  ]).then(function(values) {
    $scope.teams = values[1];
    $scope.employee = values[0];
    $scope.employee.team = getTeam($scope.teams, $scope.employee.team._id);
  }).catch(_handleError);

  $scope.editing = false;
  // 동일 배열에 대한 중복 참조를 피하기 위해, 새로운 복사본을 제공한다.
  $scope.states = config.states.slice(0);

  $scope.edit = function() {
    $scope.editing = !$scope.editing;
  };

  $scope.save = function() {
    // 데이터베이스에서 빈 행을 방지하고, UI를 깨끗하게 유지한다.
    // 빈행을 삭제한다.
    var lines = $scope.employee.address.lines;

    if (lines.length) {
      lines = lines.filter(function (value) {
        return value;
      });
    }

    $scope.employee.address.lines = lines;

    employee.update({
      employeeId: $routeParams.employeeId
    }, $scope.employee, function() {
      $scope.editing = !$scope.editing;
    });
  };

  $scope.cancel = function () {
    $route.reload();
  }

  $scope.address.addLine = function (index) {
    var lines = $scope.employee.address.lines;

    lines.splice(index + 1, 0, '');
  }

  $scope.address.removeLine = function (index) {
    var lines = $scope.employee.address.lines;

    lines.splice(index, 1);
  }
}]);

app.controller('TeamsCtrl', ['$scope', 'TeamService', function($scope, service) {
  service.query(function (data) {
    $scope.teams = data;
  }, _handleError);
}]);

app.controller('TeamCtrl', ['$scope', '$routeParams', 'TeamService', function($scope, $routeParams, service) {
  service.get({
    teamId: $routeParams.teamId
  }, function(data, headers) {
    $scope.team = data;
  }, _handleError);
}]);

function _handleError(response) {
  // TODO: 여기서 뭔가를 수행한다. 대부분 오류 페이지로 리디렉트한다.
  console.log('%c ' + response, 'color:red');
}
