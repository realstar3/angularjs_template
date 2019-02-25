    angular
        .module('albumApp')
        .component('cogAlbumGrid', {
            templateUrl: './components/album/album-grid.html',
            bindings: {
                tablekeyword: '=',
                value: '=',
                keyword: '=',
            },
            controllerAs: 'albumGridCtrl'
        })