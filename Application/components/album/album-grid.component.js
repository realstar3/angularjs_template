    angular
        .module('userApp')
        .component('cogAlbumGrid', {
            templateUrl: './components/album/album-grid.html',
            bindings:{
                keyword: '=',
                albums:"=",


            },

        });


