(function () {
    angular.module('cogranApp', ['ngAnimate','ngMaterial','ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider' ,
            function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('user', {
                        url: "/user",
                        views: {
                            "": {
                                templateUrl: "components/user/user.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('user'); // Resolve promise and load before view
                            }]
                        }
                    });
            }]);


}());
