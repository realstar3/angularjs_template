    angular
        .module('userApp')
        .component('cogUserGrid', {
            templateUrl: './components/album/user-grid.html',
            bindings:{
                keyword: '=',
                value: '=',
                subject: '=',

            }
        })

