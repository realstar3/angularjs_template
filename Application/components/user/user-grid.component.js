angular
    .module('parentApp')
    .component('cogUserGrid', {
        templateUrl: './components/user/user-grid.html',
        bindings: {
            onSelect: '&',
            tablekeyword: '=',
            users: '=',
            keyword: '=',
            albums: '=',
            userId: '='
        },
        controller: UserGridCtrl,
        controllerAs: 'userGridCtrl'
    });

function UserGridCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, $mdEditDialog, $q, $timeout) {


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
        //         return $scope.userGridCtrl.users.data ? $scope.userGridCtrl.users.data.length : 0;
        //     }
        // }
    ];

    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };
    var sc = $scope;
    $scope.radioChanged = function(user_id){
        let url  = 'https://www.brandonsport.com/users/' + user_id+ "/albums/";
        let config = {headers: { 'Content-Type': 'application/json; charset=UTF-8'}};
        $http.get(url, config)
            .then(function (response) {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000));
                if(response.data.length>0){

                    sc.userGridCtrl.albums = response.data;
                }else{
                    sc.userGridCtrl.albums = [];
                }
                sc.userGridCtrl.userId = user_id;
                sc.userGridCtrl.onSelect(sc.userGridCtrl.albums);

            })
            .catch(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000))

            })

    };

    $scope.editComment = function (event, record, col_key) {
        event.stopPropagation(); // in case autoselect is enabled
        if (col_key === 'id') return;

        var editDialog = {
            modelValue: record[col_key],
            placeholder: 'Edit a field',
            save: function (input) {

                record[col_key] = input.$modelValue;
                //** PUT Method **
                let url = 'https://www.brandonsport.com/users/' + record.id;
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
                        var keyword = $scope.userGridCtrl.keyword;

                        var params = '?';
                        var categorys = Object.keys(keyword);
                        categorys.forEach(c => {
                            if (keyword[c] === '' || keyword[c] === undefined) {
                                params = params + '';

                            } else {
                                params = params + c + "=" + keyword[c] + "&";
                            }
                        })
                        let url = 'https://www.brandonsport.com/users/' + params;
                        $http.get(url).then(function (fieldList) {
                            if (fieldList.data == null || fieldList.data.length < 1) {
                                $scope.userGridCtrl.users = [];
                                return
                            }

                            $scope.userGridCtrl.users = fieldList.data;
                        })
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
            controller: UserAddCtrl,
            locals: {
                newRecord: $scope.newRecord
            },
            templateUrl: '/components/user/user-add.dialog.html'
        });
    };

    $scope.showEditDialog = function (event, selectedRecord) {
        $scope.selectedRecord = angular.copy(selectedRecord);
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, // use parent scope in template
            preserveScope: true,
            controller: UserEditCtrl,
            locals: {
                selectedRecord: $scope.selectedRecord,
            },
            templateUrl: '/components/user/user-edit.dialog.html'
        });
    };



    $scope.showDeleteConfirmationDialog = function (event, selectRecord) {
        $scope.selectRecord = selectRecord;
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope, // use parent scope in template
            preserveScope: true,
            controller: UserDeleteCtrl,
            locals: {
                selectRecord: $scope.selectRecord
            },
            templateUrl: '/components/user/user-delete.dialog.html',
        });
    };
}

function UserAddCtrl($ocLazyLoad, $http, $mdToast, $scope, $mdDialog, newRecord) {
    var sc = $scope;
    $scope.addRecord = function (newRecord) {

        // newRecord['id'] = parseInt(newRecord['id'], 10);

        let url = 'https://www.brandonsport.com/users';
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
                var keyword = sc.userGridCtrl.keyword;

                var params = '?';
                var categorys = Object.keys(keyword);
                categorys.forEach(c => {
                    if (keyword[c] === '' || keyword[c] === undefined) {
                        params = params + '';

                    } else {
                        params = params + c + "=" + keyword[c] + "&";
                    }
                })
                let url = 'https://www.brandonsport.com/users/' + params;
                $http.get(url).then(function (fieldList) {
                    if (fieldList.data == null || fieldList.data.length < 1) {
                        sc.userGridCtrl.users = []
                        return
                    }

                    sc.userGridCtrl.users = fieldList.data;

                })
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

function UserEditCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, selectedRecord) {

    var sc = $scope;
    $scope.save = function (selectedRecord) {
        let url = 'https://www.brandonsport.com/users/' + selectedRecord.id;
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

            var keyword = sc.userGridCtrl.keyword;

            var params = '?';
            var categorys = Object.keys(keyword);
            categorys.forEach(c => {
                if (keyword[c] === '' || keyword[c] === undefined) {
                    params = params + '';

                } else {
                    params = params + c + "=" + keyword[c] + "&";
                }
            })
            let url = 'https://www.brandonsport.com/users/' + params;
            $http.get(url).then(function (fieldList) {
                if (fieldList.data == null || fieldList.data.length < 1) {
                    sc.userGridCtrl.users = []
                    return
                }

                sc.userGridCtrl.users = fieldList.data;

            });

        }).catch(function (response) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(response.statusText)
                    .hideDelay(3000));
            var keyword = sc.userGridCtrl.keyword;

            var params = '?';
            var categorys = Object.keys(keyword);
            categorys.forEach(c => {
                if (keyword[c] === '' || keyword[c] === undefined) {
                    params = params + '';

                } else {
                    params = params + c + "=" + keyword[c] + "&";
                }
            })
            let url = 'https://www.brandonsport.com/users/' + params;
            $http.get(url).then(function (fieldList) {
                sc.userGridCtrl.users = fieldList.data;

            });
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

function UserDeleteCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, selectRecord) {

    var sc = $scope
    $scope.closeDialog = function (selectRecord, feedback) {
        if (feedback === 'y') {
            let url = 'https://www.brandonsport.com/users/' + selectRecord.id;
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

                    var keyword = sc.userGridCtrl.keyword;

                    var params = '?';
                    var categorys = Object.keys(keyword);
                    categorys.forEach(c => {
                        if (keyword[c] === '' || keyword[c] === undefined) {
                            params = params + '';

                        } else {
                            params = params + c + "=" + keyword[c] + "&";
                        }
                    })
                    let url = 'https://www.brandonsport.com/users/' + params;
                    $http.get(url).then(function (fieldList) {
                        if (fieldList.data == null || fieldList.data.length < 1) {
                            sc.userGridCtrl.users = []
                            return
                        }

                        sc.userGridCtrl.users = fieldList.data;
                    })
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
