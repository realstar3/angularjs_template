    angular
        .module('albumApp')
        .component('cogAlbumGrid', {
            templateUrl: './components/album/album-grid.html',
            bindings:{
                keyword: '=',
                albums:"=",


            },

        });


