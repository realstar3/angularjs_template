angular
    .module('parentApp')
    .component('cogAlbumGrid', {
        templateUrl: './components/album/album-grid.html',
        bindings:{
            keyword: '=',
            albums:"=",
            tablekeyword: "=",
            userId: '=',


        },
        controller: AlbumGridCtrl,
        controllerAs: 'albumGridCtrl'
    });

function AlbumGridCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, $mdEditDialog, $q, $timeout) {


    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    };

    $scope.selected = [];
    $scope.limitOptions = [5, 10, 15,
        // {
        //     label: 'All',
        //     value: function () {
        //         return $scope.albumGridCtrl.albums ? $scope.albumGridCtrl.albums.length : 0;
        //     }
        // }
        ];

    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };
    var sc = $scope;

    $scope.editComment = function (event, record, col_key) {
        event.stopPropagation(); // in case autoselect is enabled
        if (col_key === 'id') return;

        var editDialog = {
            modelValue: record[col_key],
            placeholder: 'Edit a field',
            save: function (input) {

                record[col_key] = input.$modelValue;
                //** PUT Method **
                let url = 'https://www.brandonsport.com/albums/' + record.id;
                let config = {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                };
                $http.put(url, record, config)
                    .then(function (response) {

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(response.statusText)
                                .hideDelay(3000));
                        let url = 'https://www.brandonsport.com/users/'+sc.albumGridCtrl.userId + '/albums/';
                        $http.get(url).then(function (fieldList) {
                            if (fieldList.data == null || fieldList.data.length < 1) {
                                sc.albumGridCtrl.albums = []
                                return
                            }

                            sc.albumGridCtrl.albums = fieldList.data;

                        });
                    })
                    .catch(function (response) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(response.statusText)
                                .hideDelay(3000))
                    })
            },
            targetEvent: event,
            title: 'Edit a field',
            validators: {
                'md-maxlength': 30
            }
        };

        var promise;

        if ($scope.options.largeEditDialog) {
            promise = $mdEditDialog.large(editDialog);
        } else {
            promise = $mdEditDialog.small(editDialog);
        }

        promise.then(function (ctrl) {
            var input = ctrl.getInput();

            input.$viewChangeListeners.push(function () {
                input.$setValidity('test', input.$modelValue !== 'test');
            });
        });
    };


    $scope.showAddDialog = function (event) {
        $scope.newRecord = {};

        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, // use parent scope in template
            preserveScope: true,
            controller: AlbumAddCtrl,
            locals: {
                newRecord: $scope.newRecord
            },
            templateUrl: '/components/album/album-add.dialog.html'
        });
    };

    $scope.showEditDialog = function (event, selectedRecord) {
        $scope.selectedRecord = angular.copy(selectedRecord);
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, // use parent scope in template
            preserveScope: true,
            controller: AlbumEditCtrl,
            locals: {
                selectedRecord: $scope.selectedRecord,
            },
            templateUrl: '/components/album/album-edit.dialog.html'
        });
    };


    $scope.showDeleteConfirmationDialog = function (event, selectRecord) {
        $scope.selectRecord = selectRecord;
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, // use parent scope in template
            preserveScope: true,
            controller: AlbumDeleteCtrl,
            locals: {
                selectRecord: $scope.selectRecord
            },
            templateUrl: '/components/album/album-delete.dialog.html',
        });
    };
}

function AlbumAddCtrl($ocLazyLoad, $http, $mdToast, $scope, $mdDialog, newRecord) {
    var sc = $scope;
    $scope.addRecord = function (newRecord) {

        // newRecord['id'] = parseInt(newRecord['id'], 10);
        newRecord['userId'] = parseInt(newRecord['userId'], 10);

        let url = 'https://www.brandonsport.com/albums';
        let config = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
        $http.post(url, newRecord, config)
            .then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000))
                let url = 'https://www.brandonsport.com/users/'+sc.albumGridCtrl.userId + '/albums/';
                $http.get(url).then(function (fieldList) {
                    if (fieldList.data == null || fieldList.data.length < 1) {
                        sc.albumGridCtrl.albums = []
                        return
                    }

                    sc.albumGridCtrl.albums = fieldList.data;

                });
            })
            .catch(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000))

            })
        $mdDialog.hide();
    }
    $scope.cancel = function () {

        $mdDialog.hide();
    }
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}

function AlbumEditCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog) {

    var sc = $scope;
    $scope.save = function (selectedRecord) {
        let url = 'https://www.brandonsport.com/albums/' + selectedRecord.id;
        let config = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
        // selectedRecord['id'] = parseInt(selectedRecord['id'], 10);
        $http.put(url, selectedRecord, config).then(function (response) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(response.statusText)
                    .hideDelay(3000));

            let url = 'https://www.brandonsport.com/users/'+sc.albumGridCtrl.userId + '/albums/';
            $http.get(url).then(function (fieldList) {
                if (fieldList.data == null || fieldList.data.length < 1) {
                    sc.albumGridCtrl.albums = []
                    return
                }

                sc.albumGridCtrl.albums = fieldList.data;

            });

        }).catch(function (response) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(response.statusText)
                    .hideDelay(3000));

        });


        $mdDialog.hide();

    }
    $scope.cancel = function () {
        $mdDialog.hide();

    }
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}

function AlbumDeleteCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, selectRecord) {

    var sc = $scope
    $scope.closeDialog = function (selectRecord, feedback) {
        if (feedback === 'y') {
            let url = 'https://www.brandonsport.com/albums/' + selectRecord.id;
            let config = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            $http.delete(url)
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.statusText)
                            .hideDelay(3000))

                    let url = 'https://www.brandonsport.com/users/'+sc.albumGridCtrl.userId + '/albums/';
                    $http.get(url).then(function (fieldList) {
                        if (fieldList.data == null || fieldList.data.length < 1) {
                            sc.albumGridCtrl.albums = []
                            return
                        }

                        sc.albumGridCtrl.albums = fieldList.data;

                    });
                })
                .catch(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.statusText)
                            .hideDelay(3000))
                })
        }
        $mdDialog.hide();
    }
    $scope.cancel = function () {
        $mdDialog.hide();
    }

}
