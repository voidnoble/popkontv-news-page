/**
 * 위젯 탭 컨트롤러
 * Created by YJKwak on 2015-05-04.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('TabController', TabController);

    TabController.$inject = ['$scope', '$location', '$sce', '$log', 'SectionListFactory'];

    function TabController($scope, $location, $sce, $log, SectionListFactory) {
        var vm = this;

        vm.sectionname = null;
        vm.lists = null;
        vm.pagelist = null;

        vm.tabs = [
            {
                "id" : "main",
                "code" : "main",
                "title" : "주요기사",
                "url" : "scripts/views/main.widjet.html"
            },{
                "id" : "latest",
                "code" : "all",
                "title" : "최신기사",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "newcar",
                "code" : "S1N1",
                "title" : "신차",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "review",
                "code" : "S1N4",
                "title" : "시승기/리뷰",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "policy",
                "code" : "S1N2",
                "title" : "업계/정책",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "column",
                "code" : "S1N3",
                "title" : "칼럼/분석",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "life",
                "code" : "S1N6",
                "title" : "라이프",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "analysis",
                "code" : "S1N5",
                "title" : "결함/문제점",
                "url" : "scripts/views/list.widjet.html"
            },{
                "id" : "motorshow",
                "code" : "S1N7",
                "title" : "회사쇼",
                "url" : "scripts/views/list.widjet.html"
            }
        ];

        // 섹션별 목록
        var sectionCode = vm.tabs[0].code;
        var page = 1;
        // 탭 initialize
        vm.currentTab = vm.tabs[0];

        vm.onClickTab = function (tab) {
            SectionListFactory.setProp(tab.code, page);
            SectionListFactory.gets().then(function(data){
                vm.lists = data.lists;
                vm.sectionname = data.sectionname;

                $scope.page.setTitle(vm.sectionname);
            });

            vm.currentTab = tab;
        };

        vm.isActiveTab = function(tab) {
            return tab == vm.currentTab;
        };

        // ng-click : 상세보기 goDetail()
        vm.goDetail = function(id)
        {
            $location.url('/detail/'+ id);
        };
    }
})();