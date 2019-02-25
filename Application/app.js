

var app = angular.module('cogranApp', ['ngAnimate','ngMaterial','ui.router', 'ngSanitize', 'oc.lazyLoad'])
    .config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider' ,
        function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");
            //Config For ocLazyLoading
            $ocLazyLoadProvider.config({
                'debug': true, // For debugging 'true/false'
                'events': true, // For Event 'true/false'
                'modules': [
                    { // Set modules initially
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
                            'components/sample/sample-search.component.js'
                        ]
                    },
                    { // Set modules initially
                        name: 'user', // State1 module
                        serie: true,
                        files: [
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.min.js',
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.css',
                            'https://www.cogran.io/assets/css/v-accordion-min.css',
                            'https://lukaszwatroba.github.io/v-accordion/dist/v-accordion.min.js',
                            'components/user/user.component.js',
                            'components/user/user.controller.js',
                            'components/user/user-grid.component.js',
                            'components/user/user-search.component.js'
                        ]
                    },
                    { // Set modules initially
                        name: 'album', // State1 module
                        serie: true,
                        files: [
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.min.js',
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.css',
                            'https://www.cogran.io/assets/css/v-accordion-min.css',
                            'https://lukaszwatroba.github.io/v-accordion/dist/v-accordion.min.js',
                            'components/album/album.component.js',
                            'components/album/album.controller.js',
                            'components/album/album-grid.component.js',
                            'components/album/album-search.component.js',


                        ]
                    },
                    { // Set modules initially
                        name: 'parent', // State1 module
                        serie: true,
                        files: [
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.min.js',
                            'https://rawgit.com/daniel-nagy/md-data-table/master/dist/md-data-table.css',
                            'https://www.cogran.io/assets/css/v-accordion-min.css',
                            'https://lukaszwatroba.github.io/v-accordion/dist/v-accordion.min.js',
                            'components/parent/parent.js',
                            'components/parent/parent-search.component.js',
                            'components/parent/user/user-grid.component.js',
                            'components/parent/album/album-grid.component.js'



                        ]
                    }
                ]
            });

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

            ;
        }]);

app.controller("AppCtrl", function ($ocLazyLoad) {

});


