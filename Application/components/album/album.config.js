(function () {
    angular.module('albumApp', ['ngAnimate', 'ngMaterial', 'ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider',
            function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('album', {
                        url: "/album",
                        views: {
                            "": {
                                templateUrl: "components/album/album.html",
                                controller: 'AlbumCtrl',
                                controllerAs: 'albumCtrl'
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('album'); // Resolve promise and load before view
                            }]
                        }
                    });
            }
        ]);
}());
