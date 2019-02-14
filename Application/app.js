

var app = angular.module('cogranApp', ['ngAnimate','ngMaterial','ui.router', 'ngSanitize', 'oc.lazyLoad'])
    .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider' , function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        //Config For ocLazyLoading

        //Config/states of UI Router
        $stateProvider
            .state('index', {
                url: "/", // root route
                views: {
                    "": {
                        controller: 'DashCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'components/dashboard/cog-dashboard.html'
                    }
                },
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('components/dashboard/cog-dashboard.component.js');
                    }]
                }
            })
    }]);
app.controller("AppCtrl", function ($ocLazyLoad) {
    $ocLazyLoad.load('components/sample/sample.config.js');
});


