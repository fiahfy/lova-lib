/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    var MainController = (function () {
        function MainController($scope, $location, $timeout) {
            $scope.now = new Date();
            $scope.scrollPos = {}; // scroll position of each view
            $(window).on('scroll', function () {
                if ($scope.okSaveScroll) {
                    $scope.scrollPos[$location.path()] = $(window).scrollTop();
                }
            });
            $scope.scrollClear = function (path) {
                $scope.scrollPos[path] = 0;
            };
            $scope.$on('$routeChangeStart', function () {
                $scope.okSaveScroll = false;
            });
            $scope.$on('$routeChangeSuccess', function () {
                $timeout(function () {
                    $(window).scrollTop($scope.scrollPos[$location.path()] ? $scope.scrollPos[$location.path()] : 0);
                    $scope.okSaveScroll = true;
                }, 0);
            });
        }
        MainController.$inject = [
            '$scope',
            '$location',
            '$timeout'
        ];
        return MainController;
    })();
    lova.MainController = MainController;
    var ServantListController = (function () {
        function ServantListController($scope, $location, servantService) {
            $scope.servants = [];
            $scope.viewOptions = [
                { key: null, icon: 'fui-list-columned' },
                { key: 1, icon: 'fui-list-large-thumbnails' }
            ];
            $scope.raceIdOptions = [
                { key: null, value: 'Select Race...' },
                { key: 1, value: '人獣' },
                { key: 2, value: '神族' },
                { key: 3, value: '魔種' },
                { key: 4, value: '海種' },
                { key: 5, value: '不死' }
            ];
            $scope.view = $location.search().view;
            $scope.race_id = $location.search().race_id;
            //$scope.q = $location.search().q;
            var filter = {};
            if ($scope.race_id) {
                filter.race_id = $scope.race_id;
            }
            //if ($scope.q) {
            //  filter.name = $scope.q;
            //}
            $scope.filter = filter;
            $scope.predicate = ['race_id', 'race_code'];
            $scope.reverse = false;
            $scope.init = function () {
                $scope.load();
            };
            $scope.load = function () {
                servantService.loadServants()
                    .then(function (reason) {
                    $scope.servants = reason.servants;
                });
            };
            $scope.showServant = function (servant) {
                $location.url('/servants/' + servant.id + '/');
            };
            $scope.selectView = function (view) {
                $scope.view = view;
                $location.search('view', view).replace();
            };
            $scope.changeQuery = function () {
                $scope.filter.name = $scope.q;
                //$location.search('q', $scope.q).replace();
            };
            $scope.init();
            $scope.$watch('race_id', function (newValue, oldValue) {
                if (typeof newValue === 'undefined' || typeof oldValue === 'undefined' || newValue == oldValue) {
                    return;
                }
                $scope.filter = $scope.race_id ? { race_id: $scope.race_id } : {};
                $location.search('race_id', $scope.race_id).replace();
            }, true);
            angular.element(document).ready(function () {
                //$('select').select2();
            });
        }
        ServantListController.$inject = [
            '$scope',
            '$location',
            'ServantService'
        ];
        return ServantListController;
    })();
    lova.ServantListController = ServantListController;
    var ServantDetailController = (function () {
        function ServantDetailController($scope, $routeParams, servantService) {
            $scope.servant = null;
            $scope.init = function () {
                $scope.load();
            };
            $scope.load = function () {
                servantService.loadServant($routeParams.id)
                    .then(function (reason) {
                    $scope.servant = reason.servant;
                });
            };
            $scope.init();
        }
        ServantDetailController.$inject = [
            '$scope',
            '$routeParams',
            'ServantService'
        ];
        return ServantDetailController;
    })();
    lova.ServantDetailController = ServantDetailController;
})(lova || (lova = {}));
//# sourceMappingURL=controllers.js.map