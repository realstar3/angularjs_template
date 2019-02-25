angular
    .module('cogranApp')
    .component('cogDashboard', {
        templateUrl: '/components/dashboard/cog-dashboard.html'
    })
    .controller('DashCtrl', function ($ocLazyLoad, $scope, $state) {
        // $scope.sample_clicked = function () {
        //     $ocLazyLoad.load([
        //         'components/sample/sample.config.js',
        //
        //     ]).then(function () {
        //         $state.go('sample')
        //     });
        //
        // };
        // $scope.users_clicked = function () {
        //     $ocLazyLoad.load([
        //
        //         'components/user/user.config.js',
        //     ]).then(function () {
        //         $state.go('user')
        //     });
        //
        // };
        // $scope.album_clicked = function () {
        //     $ocLazyLoad.load([
        //
        //         'components/album/album.config.js',
        //     ]).then(function () {
        //         $state.go('album')
        //     });
        //
        // };

        $scope.parent_clicked = function () {
            $ocLazyLoad.load([

                'components/parent/parent.config.js',
            ]).then(function () {
                $state.go('parent')
            });

        };

    })
;

