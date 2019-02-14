
angular
    .module('sampleApp')
    .component('cogSampleEdit', {
        templateUrl: '/components/sample/sample-edit.dialog.html',
        bindings: {
            id: '<'
        }
    });

