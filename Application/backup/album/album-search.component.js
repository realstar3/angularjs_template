angular
    .module('albumApp',)
    .component('cogAlbumFind', {
        templateUrl: '/components/album/album-search.html',
        bindings:{
            value: '=',
            keyword:'='
        },
        controllerAs:'albumSearchCtrl'
    });

