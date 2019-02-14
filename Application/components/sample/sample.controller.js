(function(angular, undefined){
	"use strict";
angular.module('sampleApp', ["oc.lazyLoad", 'ngMaterial', 'md.data.table',  'ngAnimate', 'ngSanitize', 'vAccordion',])
    .controller('EventCtrl', EventCtrl)
	.controller('SampleCtrl', SampleCtrl)
	.controller('DeleteCtrl', DeleteCtrl)
	.controller('EditCtrl', EditCtrl)
	.controller('SampleGridCtrl', SampleGridCtrl);

    function EventCtrl($ocLazyLoad, $scope, $rootScope, $http, $mdSidenav, $mdToast) {
        $scope.eventData = {
            "program": ["program1","program2","program3"],
            "location": []
        };
        $scope.event={
            "program": ["program1","program2","program3"],
            "location": ["location1","location2","location3"]
        };
        $scope.applyFilters = function (event){
            $http.get('/components/sample/sample.json').then(function (fieldList) {
                var keys = Object.keys(fieldList.data.formFields[0]);
                console.log(keys);
                if (fieldList.data == null || fieldList.data.formFields.length<1){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('No records Found!')
                            .hideDelay(3000))
                        .then(function() {
                            $log.log('Toast dismissed.');
                        }).catch(function() {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
                }else{
                    $rootScope.$emit("getSearchResults", fieldList.data, keys);
                    $mdSidenav('right').toggle();
                }
            });

        }
    }
    function SampleCtrl($ocLazyLoad, $scope, $mdSidenav) {
        $ocLazyLoad.load('/components/sample/sample.controller.js');
        this.data = '';

        // $rootScope.rootSearchString = "test";
        $scope.openRightSide = function () {
            // $ocLazyLoad.load('components/sample/sample-search.component.js');
            $mdSidenav('right').toggle();
            // alert("ok");
        };
        $scope.changedSearch = ()=> {
            this.data = $scope.searchString
            // console.log(this.data);
        }
    }
    function DeleteCtrl($ocLazyLoad, $scope, $mdDialog, id) {
        $scope.confirmString = '<b>Are you sure you want to delete '+id+' row?</b>';
        $scope.id = id;
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
    }
    function EditCtrl($ocLazyLoad, $scope, $mdDialog, id, sampleSelected) {
        $scope.id = id;
        $scope.sampleSelected = sampleSelected;
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
        $scope.displayPrevious = function(accordion, number) {
            $mdDialog.hide();
        }
    }
    function AddCtrl($ocLazyLoad, $scope, $mdDialog) {
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
        $scope.displayPrevious = function() {
            $mdDialog.hide();
        }
    }
    function SampleGridCtrl($ocLazyLoad, $http, $mdDialog, $mdEditDialog, $q, $timeout,$scope, $rootScope) {
        var destroyHandler = $rootScope.$on("getSearchResults", function(event, searchResults, keys) {
            $scope.fieldList = searchResults;
            $scope.keys = keys;
        });
        $scope.$on('$destroy', destroyHandler);
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


        $scope.showEditDialog = function (event, sampleSelected, id) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: EditCtrl,
                locals: {id: id, sampleSelected: sampleSelected},
                templateUrl: '/components/sample/sample-edit.dialog.html'
            });
        };

        $scope.showAddDialog = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: AddCtrl,
                templateUrl: '/components/sample/sample-add.dialog.html'
            });
        };

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };
        $scope.onPaginate = function(page, limit) {
            // console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            // console.log('Page: ' + page + ' Limit: ' + limit);

            $scope.promise = $timeout(function () {

            }, 2000);
        };
        $scope.logItem = function (item) {
            // console.log(item.name, 'was selected');
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {

            }, 2000);
        };

        $scope.logOrder = function(order) {

            // console.log('Scope Order: ' + $scope.query.order);
            // console.log('Order: ' + order);

            $scope.promise = $timeout(function () {
                $http.get('/components/sample/sample.json').then(function (fieldList) {
                    $scope.fieldList = fieldList.data;
                });
            }, 2000);
        };
        // $http.get('/components/sample/sample.json').then(function (fieldList) {
        //     $scope.fieldList = fieldList.data;
        // });
        $scope.showDeleteConfirmationDialog = function(event, id){
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        // use parent scope in template
                preserveScope: true,
                controller: DeleteCtrl,
                locals: {id: id},
                templateUrl: '/components/sample/sample-delete.dialog.html',
            });
        };
    }

})(angular);
