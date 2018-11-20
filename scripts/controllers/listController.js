/**
 * Created by YJKwak on 2015-04-15.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope', '$http', '$routeParams', '$location', '$sce', '$log', 'SectionListFactory'];

    function ListController($scope, $http, $routeParams, $location, $sce, $log, SectionListFactory)
    {
        var vm = this;

        vm.sectionname = null;
        vm.lists = null;
        vm.pagelist = null;

        var url = "";

        // 섹션별 목록
        var sectionCode = $routeParams.section;
        var page = $routeParams.page;

        SectionListFactory.setProp(sectionCode, page);
        SectionListFactory.gets().then(function(data){
            vm.lists = data.lists;
            vm.sectionname = data.sectionname;
            vm.pagelist = data.pagelist;

            $scope.page.setTitle(vm.sectionname);
        });

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }

        // ng-click : 상세보기 goDetail()
        vm.goDetail = function(id)
        {
            $location.url('/detail/'+ id);
        }
    }
})();