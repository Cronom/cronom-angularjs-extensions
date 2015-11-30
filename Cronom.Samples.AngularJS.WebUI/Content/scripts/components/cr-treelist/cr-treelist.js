﻿/*

model
{
    data                = []                    // treelist array [{ Id:'', Title:'', Children:[], Extra:{} }]
    selectAndExpand     = true|false            // selects and expands the parent node at the same time
    buttonClass         = ""                    // bootstrap button class
    placeholder         = ""                    // text to show when no item is selected
    onItemSelected      = function(item)        // item selection callback
    -- useTextFilter    = true|false            // displays text filter
}

*/


window.$applicationModule.directive('crTreelist', function () {
    return {
        restrict: 'E',
        templateUrl: '/Content/scripts/components/cr-treelist/cr-treelist.tmpl.html',
        replace: true,
        require: '?ngModel',
        scope: {
            treeListModel: '=ngModel',
            defaultItem: '=',
            onSelection: '='
        },
        controller: function ($scope, $rootScope) {
            $rootScope.depth = 0;

            $scope.selectionHash = -1;
            $scope.matchHashes = [];
            $scope.treeListModel.textFilter = '';
            $scope.treeListModel.selectedItem = $scope.treeListModel.defaultItem || {};

            //$scope.$watch('treeListModel.textFilter', function () {
            //    $scope.matchHashes = [];
            //    if ($scope.treeListModel.data && $scope.treeListModel.data.length > 0 && $scope.treeListModel.textFilter.length > 0) {
            //        var matches = $scope.findNode($scope.treeListModel.textFilter, $scope.treeListModel.data);
            //        for (var i = 0; i < matches.length; i++) {
            //            $scope.matchHashes.push(matches[i].$$hashKey);
            //        }
            //    }
            //});

            $scope.itemOnClick = function (item) {
                $scope.selectionHash = item.$$hashKey;
                $scope.treeListModel.selectedItem = item;

                var selectionCallback = $scope.onSelection || $scope.treeListModel.onItemSelected;

                if (selectionCallback) {
                    selectionCallback(item);
                }

                if ($scope.treeListModel.selectAndExpand) {
                    $scope.expandCollapseOnClick(item);
                }
            };

            $scope.expandCollapseOnClick = function (item) {
                if (item.Children.length > 0) {
                    item.expanded = !item.expanded;
                }
            };

            $scope.revertSelection = function () {
                $scope.treeListModel.selectedItem = $scope.treeListModel.defaultItem || {};
                if ($scope.treeListModel.selectedItem && $scope.treeListModel.selectedItem.$$hashKey) {
                    $scope.selectionHash = $scope.treeListModel.selectedItem.$$hashKey;
                }
                else {
                    $scope.selectionHash = -1;
                }
            };

            $scope.clearSelection = function () {
                $scope.treeListModel.selectedItem = {};
                $scope.selectionHash = -1;
            };

            $scope.setItemPreselected = function (item) {
                console.log('preselected item ' + item.Id);
                if ($scope.treeListModel.initialSelected) {
                    return;
                }
                $scope.treeListModel.defaultItem = item;
                $scope.treeListModel.selectedItem = item;
                $scope.selectionHash = item.$$hashKey;
                $scope.treeListModel.initialSelected = true;
            };

            $scope.findNode = function (keyword, list) {
                var length = list.length;
                var matches = [];
                for (var i = 0; i < length; i++) {
                    var element = list[i];
                    if (element.Title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                        matches.push(element);
                    }
                    var subMatches = [];
                    if (element.Children && element.Children.length > 0) {
                        subMatches = $scope.findNode(keyword, element.Children);
                        for (var m = 0; m < subMatches.length; m++) {
                            matches.push(subMatches[m]);
                        }
                    }
                }
                return matches;
            };
        }
    };
});