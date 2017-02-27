'use strict';

angular.module('bookingListDirective', [])

.directive('bookingList', function () {
  return {
    restrict: 'E',
    templateUrl: 'directives/bookingList/bookingList.tpl.html',
    scope: {
      resource: '=',
    },
    controller: function functionName($scope, $log, bookingService, alertService, $state) {
      $scope.busy = false;
      $scope.bookings = [];

      //Set begin and end day of the current month as the current timeframe
      $scope.currentTimeFrame = {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD')
      };

      //Load booking with the current timeframe
      loadBookings();

      //Load bookings of the previous month
      $scope.previous = function () {
        $scope.currentTimeFrame = {
          startDate: moment($scope.currentTimeFrame.startDate).subtract('months', 1).startOf('month').format('YYYY-MM-DD'),
          endDate: moment($scope.currentTimeFrame.endDate).subtract('months', 1).endOf('month').format('YYYY-MM-DD')
        };
        loadBookings();
      };

      //Load bookings of the next month
      $scope.next = function () {
        $scope.currentTimeFrame = {
          startDate: moment($scope.currentTimeFrame.startDate).add('months', 1).startOf('month').format('YYYY-MM-DD'),
          endDate: moment($scope.currentTimeFrame.endDate).add('months', 1).endOf('month').format('YYYY-MM-DD')
        };
        loadBookings();
      };

      function loadBookings () {
        $scope.busy = true;
        alertService.load();
        return bookingService.forResource({
          resource: $scope.resource.id,
          timeFrame: $scope.currentTimeFrame
        }).then(function (bookings) {
          $scope.busy = false;
          alertService.loaded();
          $scope.bookings = bookings;
        }).then(function () {
          //Get the total hours of the bookings in the current timeframe
          $scope.getTotalHours = function(){
            var total = 0;
            for(var i = 0; i < $scope.bookings.length; i++){
              var bookingHours = moment($scope.bookings[i].endBooking).diff(moment($scope.bookings[i].beginBooking), 'hours');
              total += bookingHours;
            }
            return total;
          };
        })
        .catch(function (err) {
          $log.debug('error loading bookings', err);
        });
      }

    }
  };
});
