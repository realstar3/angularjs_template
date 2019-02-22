/**
* @description Form name user - User Maintenance
* @version 1.0
* @since Fri Feb 22 2019 14:39:42 GMT-0600 (Central Standard Time)
* @author Jin
* @copyright Cogran Systems LLC
*/

(function (angular, undefined) {

    angular.module('userApp', ['ngAnimate', 'oc.lazyLoad', 'ngMaterial', 'md.data.table', 'ngSanitize', 'vAccordion', ])
        .controller('userCtrl', userCtrl)
        .controller('userSearchCtrl', userSearchCtrl)
        .controller('userAddCtrl', userAddCtrl)
        .controller('userDeleteCtrl', userDeleteCtrl)
        .controller('userEditCtrl', userEditCtrl)
        .controller('userGridCtrl', userGridCtrl);

    function UserCtrl($scope, $mdSidenav) {
        $scope.displayMessage = '';
        this.data = "";
        this.searchString = '';
        $scope.stopCollapsing = false;
        $scope.toggleCollapse = function () {

            $scope.stopCollapsing = !$scope.stopCollapsing;
        }

        $scope.expandCallback = function (index, id) {
            // console.log('expand:', index, id);
        };

        $scope.collapseCallback = function (index, id) {
            if ($scope.stopCollapsing) {
                $scope.accordionA.toggle(index);
            }
            // console.log('collapse:', index, id);
        };

        $scope.changedSearch = function () {
            if ($scope.userCtrl.searchString === '') {
                $scope.displayMessage = $scope.userCtrl.subject;
                $scope.accordionA.expand(0)
            } else {
                $scope.displayMessage = 'Select or edit Results';
                // $scope.accordionA.expand(0)
            }
        }

        $scope.openRightSide = function () {
            $mdSidenav('right').toggle();

        };
    }

    function UserSearchCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdSidenav, $log, $rootScope) {

        $scope.serverError = '';

        var sc = $scope;
        $scope.applyFilters = function () {

            sc.$parent.userSearchCtrl.keyword = {
                "name": sc.name,
                "id": sc.id
            };
            var keyword = sc.$parent.userSearchCtrl.keyword;

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
            $http.get(url).then(
                    function (fieldList) {
                        if (fieldList.data == null || fieldList.data.length < 1) {
                            sc.$parent.userSearchCtrl.value = [];
                            $mdSidenav('right').toggle();
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('No records found, please try another search (COG-1000)')
                                .hideDelay(3000));

                        } else {
                            sc.serverError = '';
                            sc.$parent.userSearchCtrl.value = fieldList;
                            $mdSidenav('right').toggle();
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('Success! (COG-1001)')
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

    function UserGridCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, $mdEditDialog, $q, $timeout) {
        this.subject = "";

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
        $scope.limitOptions = [5, 10, 15, {
            label: 'All',
            value: function () {
                return $scope.$parent.userGridCtrl.value.data ? $scope.$parent.userGridCtrl.value.data.length : 0;
            }
        }];

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
                            var keyword = sc.$parent.userGridCtrl.keyword;

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
                                    sc.$parent.userGridCtrl.value = []
                                    return
                                }
                                var keys = Object.keys(fieldList.data[0]);
                                fieldList.keys = keys;
                                sc.$parent.userGridCtrl.value = fieldList;
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

                        var keyword = sc.$parent.userGridCtrl.keyword;

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
                                sc.$parent.userGridCtrl.value = []
                                return
                            }

                            sc.$parent.userGridCtrl.value = fieldList;
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

    function UserEditCtrl($ocLazyLoad, $http, $scope, $mdToast, $mdDialog, selectedRecord) {

        var sc = $scope;
        $scope.save = function (selectedRecord) {
            let url = 'https://www.brandonsport.com/users/' + selectedRecord.id;
            let config = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            selectedRecord['id'] = parseInt(selectedRecord['id'], 10);
            $http.put(url, selectedRecord, config).then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(response.statusText)
                    .hideDelay(3000));

                var keyword = sc.$parent.userGridCtrl.keyword;

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
                        sc.$parent.userGridCtrl.value = []
                        return
                    }

                    sc.$parent.userGridCtrl.value = fieldList;

                });

            }).catch(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(response.statusText)
                    .hideDelay(3000));
                var keyword = sc.$parent.userGridCtrl.keyword;

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
                    sc.$parent.userGridCtrl.value = fieldList;

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

    function UserAddCtrl($ocLazyLoad, $http, $mdToast, $scope, $mdDialog, newRecord) {
        var sc = $scope;
        $scope.addRecord = function (newRecord) {

            newRecord['id'] = parseInt(newRecord['id'], 10);

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
                    var keyword = sc.$parent.userGridCtrl.keyword;

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
                            sc.$parent.userGridCtrl.value = []
                            return
                        }

                        sc.$parent.userGridCtrl.value = fieldList;

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
})(angular);