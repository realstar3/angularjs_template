    angular
        .module('userApp')
        .component('cogUserGrid', {
            templateUrl: './components/user/user-grid.html',
            bindings: {
                tablekeyword: '=',
                value: '=',
                keyword: '=',
            },
            controllerAs: 'userGridCtrl'
        })