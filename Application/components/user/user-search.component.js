angular
    .module('userApp',)
    .component('cogUserFind', {
        templateUrl: '/components/user/user-search.html',
        bindings:{
            value: '=',
            keyword:'='
        },
        controllerAs:'userSearchCtrl'
    });

