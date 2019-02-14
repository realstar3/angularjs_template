angular
    .module('cogranApp')
    .component('cogDashboard', {
        templateUrl: '/components/dashboard/cog-dashboard.html'
    })
    .controller('DashCtrl', function ($scope, $state) {
        $scope.clicked = function () {
            // alert('Worked!');
            $state.go('sample')
        };

    })
;

