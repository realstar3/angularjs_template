(function () {
    angular.module('cogranApp', ['ngAnimate','ngMaterial','ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider' ,
            function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('sample', {
                        url: "/sample",
                        views: {
                            "": {
                                templateUrl: "components/sample/sample.html"
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('sample'); // Resolve promise and load before view
                            }]
                        }
                    });
            }]);


}());
