(function () {
    angular.module('cogranApp', ['ngMaterial', 'ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            //Config For ocLazyLoading
            $ocLazyLoadProvider.config({
                'debug': true, // For debugging 'true/false'
                'events': true, // For Event 'true/false'
                'modules': [{ // Set modules initially
                    name: 'user', // State1 module
                    files: [
                        'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.min.js',
                        'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.css',

                        'https://www.cogran.io/assets/css/v-accordion-min.css',
                        'https://lukaszwatroba.github.io/v-accordion/dist/v-accordion.min.js',
                        'components/user/user.module.js',
                        'components/user/user.component.js',
                        'components/user/user.controller.js',
                        'components/user/user-add.component.js',
                        'components/user/user-delete.component.js',
                        'components/user/user-edit.component.js',
                        'components/user/user-grid.component.js',
                        'components/user/user-help.component.js',
                        'components/user/user-search.component.js'
                    ]
                },]
            });
            //Config/states of UI Router
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
