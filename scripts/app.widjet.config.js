/**
 * Created by YJKwak on 2015-04-15.
 */
(function () {
    'use strict';

    angular
        .module("app")
        //.config(configure)
        .run(run);

    configure.$inject = ['$routeProvider'];

    function configure($routeProvider)
    {
        $routeProvider
            .when('/', {
                title : '메인',
                templateUrl : 'scripts/views/main.widjet.html',
                controller : 'WidjetController',
                controllerAs : 'widjetCtrl'
            })
            .when('/list', {
                title : '섹션',
                templateUrl : 'scripts/views/list.widjet.html',
                controller : 'ListController',
                controllerAs : 'listCtrl'
            })
            .when('/list/:section', {
                title : '섹션',
                templateUrl : 'scripts/views/list.widjet.html',
                controller : 'ListController',
                controllerAs : 'listCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    run.$inject = ['$location', '$rootScope', '$timeout'];

    function run($location, $rootScope, $timeout)
    {
        $rootScope.page = {
            // <title> 셋팅
            setTitle : function(title) {
                this.title = title; // <title> 셋팅
                document.querySelector('title').innerHTML = title +' - 팝콘TV 자동차 : 회사';
            },
            // 이 앱이 iframe 으로 실행될 때 상세페이지로 이동하도록 부모창에 글 번호값 전달
            postMessageToParent : function(msg) {
                //console.log(msg);
                var targetDomain = "http://www.popkontv.com"; //"http://27.102.93.203:9001";
                window.parent.postMessage(msg, targetDomain);
            },
            postUrlToParent : function(locationHash) {
                var msg = {
                    "locationHash": locationHash,
                    "originDomain": "yourdomain.com"
                };
                this.postMessageToParent(msg);
            }
        };

        // route 따라 동적으로 <title> 지정
        $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) {
            $rootScope.currentPath = $location.path();

            if (previousRoute !== currentRoute) {
                $rootScope.title = currentRoute.title;

                // 섹션코드에 따른 네비게이션 활성 : <a ng-class="{active: activeNav == 'all'}" ...>
                var activeNav = "";

                if (currentRoute.$$route.controller == "ListController") {
                    var activeNavHashTable = new Object();
                    activeNavHashTable['S1N1'] = "new";
                    activeNavHashTable['S1N2'] = "industry";
                    activeNavHashTable['S1N3'] = "column";
                    activeNavHashTable['S1N4'] = "review";
                    activeNavHashTable['S1N5'] = "analysis";
                    activeNavHashTable['S1N6'] = "life";
                    activeNavHashTable['S1N7'] = "motorshow";

                    var sectionCode = currentRoute.params.section;
                    if (activeNav.hasOwnProperty(sectionCode)) {
                        activeNav = activeNavHashTable[sectionCode];
                    } else {
                        activeNav = "all";
                    }
                }
                $rootScope.activeNav = activeNav;
            }
        });
    }
})();