    angular
        .module('sampleApp')
        .component('cogSampleGrid', {
            templateUrl: './components/sample/sample-grid.html',
            bindings:{
                keyword: '=',
                value: '='
            }
        })

