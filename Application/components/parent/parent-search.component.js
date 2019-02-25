angular
    .module('parentApp',)
    .component('cogUserSearch', {
        templateUrl: '/components/parent/parent-search.html',
        bindings:{
            tablekeyword: '=',
            value: '=',
            keyword:'='
        },
        controller: ParentSearchCtrl,
        controllerAs:'parentSearchCtrl'
    });
function ParentSearchCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdSidenav, $log, $rootScope) {

    $scope.serverError = '';
    var sc = $scope;
    $scope.applyFilters = function () {

        sc.parentSearchCtrl.keyword = {
            "name": sc.name,
            "id": sc.id
        };
        var keyword = sc.parentSearchCtrl.keyword;

        var params = '?';
        var categories = Object.keys(keyword);
        categories.forEach(c => {
            if (keyword[c] === '' || keyword[c] === undefined) {
                params = params + '';

            } else {
                params = params + c + "=" + keyword[c] + "&";
            }
        })
        let url = 'https://www.brandonsport.com/users/' + params;
        $http.get(url).then(
            function (fieldList) {
                if (fieldList.data == null || fieldList.data.length < 1) {
                    sc.parentSearchCtrl.value = [];
                    $mdSidenav('right').toggle();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('No records found, please try another search.')
                            .hideDelay(3000));

                } else {
                    sc.serverError = '';
                    sc.parentSearchCtrl.value = fieldList.data;
                    $mdSidenav('right').toggle();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Records found.')
                            .hideDelay(3000));
                }
            })
            .catch(function (err) {
                sc.serverError = 'error: ' + err.status + ' : ' + err.statusText;
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('No records found, please try another search. (COG-1002)')
                        .hideDelay(3000));
            });
    }
}
