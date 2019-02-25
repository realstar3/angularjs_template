angular
    .module('parentApp',['ngAnimate', 'oc.lazyLoad', 'ngMaterial', 'md.data.table',  'ngSanitize', 'vAccordion',])
    .controller('ParentCtrl', ParentCtrl);
function ParentCtrl($ocLazyLoad, $scope, $mdSidenav) {
    // $ocLazyLoad.load('components/parent/parent-search.component.js');
    // $ocLazyLoad.load('components/parent/user-grid.component.js');
    // $ocLazyLoad.load('components/parent/album-grid.component.js');
    var ctl = this;

    $scope.selectedAlbum = function(albums){

        $scope.accordionA.toggle(1);
        ctl.albums = $scope.parentCtrl.albums;
    };
    $scope.userDisplayMessage = 'User Maintenance';
    $scope.albumDisplayMessage = 'Album Maintenance';
    this.users = '';
    this.albums = "";
    this.searchString = '';
    $scope.stopCollapsing = false;
    $scope.toggleCollapse = function () {

        $scope.stopCollapsing = !$scope.stopCollapsing;
    }

    $scope.expandCallback = function (index, id) {
        console.log('expand:', index, id);
    };

    $scope.collapseCallback = function (index, id) {
        if ($scope.stopCollapsing) {
            $scope.accordionA.toggle(index);
        }
        // console.log('collapse:', index, id);
    };


    $scope.changedSearch = function () {
        if ($scope.parentCtrl.searchString === '') {
            $scope.userDisplayMessage = 'User Maintenance';
            $scope.albumDisplayMessage = 'Album Maintenance';
            // $scope.accordionA.expand(0)
        } else {
            $scope.userDisplayMessage = 'Select or edit Results';
            $scope.albumDisplayMessage = 'Select or edit Results';
            // $scope.accordionA.expand(0)
        }
    }

    $scope.openRightSide = function () {
        $mdSidenav('right').toggle();

    };

}

