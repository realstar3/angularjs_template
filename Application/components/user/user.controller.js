(function(angular, undefined){

    angular.module('userApp', ['ngAnimate', 'oc.lazyLoad', 'ngMaterial', 'md.data.table',  'ngSanitize', 'vAccordion',])
        .controller('SampleCtrl', SampleCtrl)
        .controller('EventCtrl', EventCtrl)
        .controller('AddCtrl', AddCtrl)
        .controller('DeleteCtrl', DeleteCtrl)
        .controller('EditCtrl', EditCtrl)
        .controller('SampleGridCtrl', SampleGridCtrl);

    function SampleCtrl($scope, $mdSidenav) {


        this.data = "";
        this.searchString = '';
        $scope.header_string = "Field List"


        $scope.stopCollapsing = false;
        $scope.toggleCollapse = function(){

            $scope.stopCollapsing = !$scope.stopCollapsing;
        }


        $scope.expandCallback = function (index, id) {
            console.log('expand:', index, id);
        };

        $scope.collapseCallback = function (index, id) {
            if($scope.stopCollapsing){
                $scope.accordionA.toggle(index);
            }
            console.log('collapse:', index, id);
        };

        $scope.changedSearch = function(){
            if($scope.Sctl.searchString===''){
                $scope.accordionA.expand(1)
            }
            else
            {
                $scope.accordionA.expand(0)

            }
        }

        // $rootScope.rootSearchString = "test";
        $scope.openRightSide = function () {
            // $ocLazyLoad.load('components/sample/sample-search.component.js');
            $mdSidenav('right').toggle();

        };



    }


    function EventCtrl( $ocLazyLoad, $scope, $rootScope, $http, $mdSidenav, $mdToast, $log) {

        this.serverfakeerror=''
        var ctrl = this;
        var sc = $scope;
        $scope.applyFilters = function(){
            let url  = 'http://54.153.92.80:3001/';
            // let url  = '/components/sample/sample.json'
            if(sc.selectedForms === 'users'){
                url = url + sc.selectedForms;
            }else {
                url = url + "users";
            }

            $http.get(url).then(
                function (fieldList) {
                    var keys = Object.keys(fieldList.data[0]);
                    // for( var i = 0; i < keys.length; i++){
                    //     if ( keys[i] === 'id') {
                    //         keys.splice(i, 1);
                    //     }
                    // }

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('GET method is performed successfully.')
                            .hideDelay(3000))
                        // .then(
                        //     function () {
                        //         $log.log('Toast dismissed.');
                        //     }
                        // )
                        // .catch(function() {
                        //     $log.log('Toast failed or was forced to close early by another toast.');
                        // });

                    if (fieldList.data == null || fieldList.data.length<1){

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('COG-1000 no records found, please try another search')
                                .hideDelay(3000))
                            .then(function() {
                                $log.log('Toast dismissed.');
                            })
                            .catch(function() {
                                $log.log('Toast failed or was forced to close early by another toast.');
                            });
                    }else{
                        fieldList.keys = keys;

                        sc.$parent.$ctrl.value = fieldList;
                        // $rootScope.$emit("getSearchResults", fieldList.data, keys);
                        $mdSidenav('right').toggle();
                    }
                })
                .catch(function (err) {
                    ctrl.serverfakeerror= 'error: ' + err.status + ' : ' + err.statusText;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('COG-1000 no records found, please try another search')
                            .hideDelay(3000));

                });

        }
    }


    function SampleGridCtrl($ocLazyLoad, $http, $mdDialog, $mdToast, $mdEditDialog, $q, $timeout,$scope) {

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
                return $scope.formFields ? $scope.formFields.length : 0;
            }
        }];

        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        var sc = $scope;

        $scope.editComment = function (event, id, col_key) {
            event.stopPropagation(); // in case autoselect is enabled

            var record = ''
            for (var i=0; i< sc.$parent.$ctrl.value.data.length; i++){
                if (sc.$parent.$ctrl.value.data[i]['id'] === id){
                    record = sc.$parent.$ctrl.value.data[i]

                }
            };
            var editDialog = {
                modelValue: record[col_key],
                placeholder: 'Edit a field',
                save: function (input) {

                    record[col_key] = input.$modelValue;
                    //** PUT Method **
                    let url  = 'http://54.153.92.80:3001/users/' + record.id;
                    let config = {headers: { 'Content-Type': 'application/json; charset=UTF-8'}};
                    $http.put(url, record, config)
                        .then(function (response) {

                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(response.statusText)
                                    .hideDelay(3000))
                            $http.get("http://54.153.92.80:3001/users/").then(function (fieldList) {
                                var keys = Object.keys(fieldList.data[0]);
                                fieldList.keys = keys;
                                sc.$parent.$ctrl.value = fieldList;

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

            if($scope.options.largeEditDialog) {
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


        $scope.showEditDialog = function (event, selectedRecord, keys) {
            $scope.selectedRecord = selectedRecord;
            $scope.keys = keys;
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: EditCtrl,
                locals: { selectedRecord: selectedRecord, keys: keys,},
                templateUrl: '/components/user/user-edit.dialog.html'
            });
        };

        $scope.showAddDialog = function (event, keys) {
            $scope.record = {};
            $scope.keys = keys;
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: AddCtrl,
                locals: {record: $scope.record, keys: $scope.keys},
                templateUrl: '/components/user/user-add.dialog.html'
            });
        };

        // $scope.toggleLimitOptions = function () {
        //     $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        // };
        // $scope.onPaginate = function(page, limit) {
        //     // console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
        //     // console.log('Page: ' + page + ' Limit: ' + limit);
        //
        //     $scope.promise = $timeout(function () {
        //
        //     }, 2000);
        // };
        // $scope.logItem = function (item) {
        //     // console.log(item.name, 'was selected');
        // };
        //
        // $scope.loadStuff = function () {
        //     $scope.promise = $timeout(function () {
        //
        //     }, 2000);
        // };

        // $scope.logOrder = function(order) {
        //     $scope.promise = $timeout(function () {
        //         $http.get('/components/sample/sample.json').then(function (fieldList) {
        //             $scope.fieldList = fieldList.data;
        //         });
        //     }, 2000);
        // };

        $scope.showDeleteConfirmationDialog = function(event, id){
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: DeleteCtrl,
                locals: {id: id},
                templateUrl: '/components/user/user-delete.dialog.html',
            });
        };
    }

    function DeleteCtrl($ocLazyLoad, $http,$mdToast, $scope, $mdDialog, id) {
        $scope.id = id;
        var sc = $scope
        $scope.closeDialog = function(id, feedback) {
            if(feedback==='y'){
                let url  = 'http://54.153.92.80:3001/users/' + id;
                let config = {headers: { 'Content-Type': 'application/json; charset=UTF-8'}};
                $http.delete(url)
                    .then(function (response) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(response.statusText)
                                .hideDelay(3000))
                        $http.get("http://54.153.92.80:3001/users/").then(function (fieldList) {
                            var keys = Object.keys(fieldList.data[0]);
                            fieldList.keys = keys;
                            sc.$parent.$ctrl.value = fieldList;

                        })

                    })
                    .catch(function (response) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(response.statusText)
                                .hideDelay(3000))
                    })

                // $scope.$parent.$ctrl.value.data.splice(id, 1)

            }
            $mdDialog.hide();
        }
    }
    function EditCtrl($ocLazyLoad, $scope,$http, $mdToast,  $mdDialog, selectedRecord, keys) {

        $scope.selectedRecord = selectedRecord;
        $scope.cancel = function() {
            $mdDialog.hide();
        }
        var sc = $scope;
        $scope.save= function(selectedRecord) {
            let url  = 'http://54.153.92.80:3001/users/' + selectedRecord.id;
            let config = {headers: { 'Content-Type': 'application/json; charset=UTF-8'}};
            $http.put(url, selectedRecord, config).then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000))
                $http.get("http://54.153.92.80:3001/users/").then(function (fieldList) {
                    var keys = Object.keys(fieldList.data[0]);
                    fieldList.keys = keys;
                    sc.$parent.$ctrl.value = fieldList;

                })
            }).catch(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.statusText)
                        .hideDelay(3000))
            })

            $mdDialog.hide();

        }
    }
    function AddCtrl($ocLazyLoad, $http, $mdToast, $scope, $mdDialog) {
        var sc = $scope;
        $scope.addRecord = function(record){

            record['id'] =  parseInt(record['id'], 10);

            let url  = 'http://54.153.92.80:3001/users/';
            let config = {headers: { 'Content-Type': 'application/json; charset=UTF-8'}};
            $http.post(url, record, config)
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.statusText)
                            .hideDelay(3000))
                    $http.get("http://54.153.92.80:3001/users/").then(function (fieldList) {
                        var keys = Object.keys(fieldList.data[0]);
                        fieldList.keys = keys;
                        sc.$parent.$ctrl.value = fieldList;

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
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
        $scope.displayPrevious = function() {
            $mdDialog.hide();
        }
    }


})(angular);
