angular
    .module('userApp')
    .component('cogUserFind', {
        templateUrl: '/components/album/user-search.html',
        bindings:{
            value: '=',
            subject:'='

        },

    });

