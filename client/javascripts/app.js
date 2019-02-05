angular.module('nodeTodo', [])
  .controller('mainController', ($scope, $http, $timeout) => {
    $scope.today = false;
    $scope.week = false;
    $scope.month = false;
    $scope.waiting = false;
    $scope.done = false;
    $scope.all = false;
    $scope.error = '';
    $scope.message = '';
    $scope.isCheck = true;

    $scope.gridView = true;
    $scope.formData = {};
    $scope.todoData = {};

    $timeout(function () { $scope.isCheck = true; }, 300);

    // Get all todos
    $http.get('/todos')
      .success((data) => {
        $scope.todoData = data.data;
        console.log(data);
      })
      .error((error) => {
        console.log('Error: ' + error);
      });

    $scope.createTodo = () => {
      $http.post('/todos', $scope.formData)
        .success((data) => {
          $scope.formData = {};
          $scope.message = data.message;
          $scope.error = data.error;
          $scope.isCheck = false;
          getAll();
        })
        .error((error) => {
          $scope.error = data.error;
        });
    };

    $scope.changeStatus = (id, currentStatus) => {
      var obj = {};
      obj.done = currentStatus === 1 ? 0 : 1;
      $http.put('/todos/' + id, obj)
        .success((data) => {
          $scope.formData = {};
          getAll();
        })
        .error((error) => {
          console.log('Error: ' + error);
        });
    };

    // Delete a todo
    $scope.deleteTodo = (todoID) => {
      $http.delete('/todos/' + todoID)
        .success((data) => {
          getAll();
        })
        .error((data) => {
          console.log('Error: ' + data);
        });
    };

    $scope.applyFilter = () => {
      var queryString = '';
      var status = '';
      var obj = new persianDate();
      var tdate = '';
      if (!$scope.all) {
        if ($scope.month) {
          tdate = obj.startOf('month').format('YYYY/MM/DD') + ',' + obj.endOf('month').format('YYYY/MM/DD')
        } else if ($scope.week) {
          tdate = obj.startOf('week').format('YYYY/MM/DD') + ',' + obj.endOf('week').format('YYYY/MM/DD')
        } else if ($scope.today) {
          tdate = obj.format('YYYY/MM/DD')
        }
      }

      if ($scope.waiting) {
        status = 'status=0';
      }
      if ($scope.done) {
        if (status !== '') {
          status = 'status=0,1';
        } else {
          status = 'status=1';
        }
      }

      if (tdate !== '') {
        if (status !== '') {
          queryString = 'date=' + tdate + '&' + status;
        } else {
          queryString = 'date=' + tdate;
        }
      } else {
        queryString = status;
      }
      $http.get('/todos?' + queryString)
        .success((data) => {
          $scope.todoData = data.data;
          console.log(data);
        })
        .error((error) => {
          console.log('Error: ' + error);
        });
    };

    $scope.filterByDate = (part) => {

      $http.delete('/todos/' + todoID)
        .success((data) => {
          getAll();
        })
        .error((data) => {
          console.log('Error: ' + data);
        });
    };

    function getAll() {
      $http.get('/todos')
        .success((data) => {
          $scope.todoData = data.data;
          console.log(data);
        })
        .error((error) => {
          console.log('Error: ' + error);
        });
    };

    $scope.toggleView = () => {
      $scope.gridView = !$scope.gridView;
    }
  });