(function () {
    angular.module('parentApp', ['ngAnimate', 'ngMaterial', 'ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider',
            function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state('parent', {
                        url: "/parent",
                        views: {
                            "": {
                                templateUrl: "components/parent/parent.html",
                                controller: 'ParentCtrl',
                                controllerAs: 'parentCtrl'
                            }
                        },
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('parent'); // Resolve promise and load before view
                            }]
                        }
                    });
            }
        ]);
}());
