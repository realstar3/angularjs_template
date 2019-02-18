    angular
        .module('userApp')
        .component('cogUserGrid', {
            templateUrl: './components/user/user-grid.html',
            bindings:{
                keyword: '=',
                value: '='
            }
        })

