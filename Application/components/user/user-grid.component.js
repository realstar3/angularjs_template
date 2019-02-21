    angular
        .module('userApp')
        .component('cogUserGrid', {
            templateUrl: './components/user/user-grid.html',
            bindings: {
                tablekeyword: '=',
                value: '=',
                subject: '=',
                keyword: '=',
                category: '='
            },
            controllerAs: 'userGridCtrl'
        })