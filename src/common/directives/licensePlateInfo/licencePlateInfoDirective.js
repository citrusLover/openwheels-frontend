'use strict';

angular.module('licencePlateInfoDirective', [])

.directive('licensePlateInfo', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    templateUrl: 'directives/licensePlateInfo/licencePlateInfo.tpl.html',
    controller: function functionName($scope, $http, $log, appConfig) {
      function showError(show) {
        if (show) {
          $scope.licencePlate.showError = true;
          $scope.licencePlate.data = false;
          $scope.licencePlate.error = 'Als kenteken onbekend is: Helaas kunnen we geen auto met dit kenteken vinden. Wil je het nog een keer proberen?';
        } else {
          $scope.licencePlate.showError = false;
        }
      }
      $scope.getLicencePlateInfo = function () {
        var url = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=' + $scope.licencePlate.content.toUpperCase() + '&$$app_token=' + appConfig.appTokenRdw;
        var urlFuel = 'https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=' + $scope.licencePlate.content.toUpperCase() + '&$$app_token=' + appConfig.appTokenRdw;
        $http.get(url)
          .then(function (responseCarData) {
            if (responseCarData.data.length > 0) {
              return responseCarData;
            } else {
              showError(true);
            }
          }).then(function (responseCarData) {
            $http.get(urlFuel).then(function (response) {
              if (response.data.length > 0) {
                $scope.licencePlate.data = {
                  merk: responseCarData.data[0].merk,
                  brandstof: response.data[0].brandstof_omschrijving,
                  handelsbenaming: responseCarData.data[0].handelsbenaming,
                  datum_eerste_toelating: moment(responseCarData.data[0].datum_eerste_toelating, 'DD/MM/YYYY').format('ddd DD MMM'),
                  kleur: responseCarData.data[0].eerste_kleur
                };
              }
              showError(false);
            }).catch(function (err) {
              showError(true);
            });
          }).catch(function (err) {
            showError(true);
          });
      };
    }
  };
});
