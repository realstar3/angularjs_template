(function () {
    angular.module('cogranApp', ['ngMaterial', 'ui.router', 'ngSanitize', 'oc.lazyLoad'])
        .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            //Config For ocLazyLoading
            $ocLazyLoadProvider.config({
                'debug': true, // For debugging 'true/false'
                'events': true, // For Event 'true/false'
                'modules': [{ // Set modules initially
                    name: 'sample', // State1 module
                    files: [
                        'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.min.js',
                        'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.css',

                        'https://www.cogran.io/assets/css/v-accordion-min.css',
                        'https://lukaszwatroba.github.io/v-accordion/dist/v-accordion.min.js',
                        'components/sample/sample.module.js',
                        'components/sample/sample.component.js',
                        'components/sample/sample.controller.js',
                        'components/sample/sample-add.component.js',
                        'components/sample/sample-delete.component.js',
                        'components/sample/sample-edit.component.js',
                        'components/sample/sample-grid.component.js',
                        'components/sample/sample-help.component.js',
                        'components/sample/sample-search.component.js'
                    ]
                },]
            });
            //Config/states of UI Router
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
