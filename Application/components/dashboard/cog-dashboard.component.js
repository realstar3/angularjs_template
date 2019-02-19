angular
    .module('cogranApp')
    .component('cogDashboard', {
        templateUrl: '/components/dashboard/cog-dashboard.html'
    })
    .controller('DashCtrl', function ($ocLazyLoad, $scope, $state) {
        $scope.sample_clicked = function () {
            $ocLazyLoad.load([
                'components/sample/sample.config.js',

            ]).then(function () {
                $state.go('sample')
            });

        };
        $scope.users_clicked = function () {
            $ocLazyLoad.load([

                'components/user/user.config.js',
            ]).then(function () {
                $state.go('user')
            });

        };
        $scope.albumns_clicked = function () {
            $ocLazyLoad.load([

                'components/album/user.config.js',
            ]).then(function () {
                $state.go('album')
            });

        };

    })
;

