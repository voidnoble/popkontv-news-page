/**
 * Created by YJKwak on 2015-04-15.
 */
(function () {
    'use strict';

    angular
        .module("app")
        .config(configure)
        .run(run);

    configure.$inject = ['$routeProvider'];

    function configure($routeProvider)
    {
        $routeProvider
            .when('/', {
                title : '메인',
                templateUrl : 'scripts/views/main.html',
                controller : 'MainController',
                controllerAs : 'mainCtrl'
            })
            .when('/list', {
                title : '섹션',
                templateUrl : 'scripts/views/list.html',
                controller : 'ListController',
                controllerAs : 'listCtrl'
            })
            .when('/list/:section', {
                title : '섹션',
                templateUrl : 'scripts/views/list.html',
                controller : 'ListController',
                controllerAs : 'listCtrl'
            })
            .when('/list/:section/:page', {
                title : '섹션',
                templateUrl : 'scripts/views/list.html',
                controller : 'ListController',
                controllerAs : 'listCtrl'
            })
            .when('/detail/:id', {
                title : '글보기',
                templateUrl : 'scripts/views/detail.html',
                controller : 'DetailController',
                controllerAs : 'detailCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    run.$inject = ['$location', '$rootScope', '$timeout', '$window'];

    function run($location, $rootScope, $timeout, $window)
    {
        $rootScope.page = {
            // <title> 셋팅
            setTitle : function(title) {
                this.title = title; // <title> 셋팅
                document.querySelector('title').innerHTML = title +' - 팝콘TV 자동차 : 회사';
            },
            // 이 앱이 iframe 으로 실행될 때 부모창에 높이 값 전달하여 동적 iframe 높이 할당을 도움
            postMessageToParent : function(height) {
                var docHeight = (height)? height : Math.max(angular.element(document).height(), angular.element('body > div:first-child').height());
                var msg = { "height": docHeight };
                //console.log(msg);
                var targetDomain = "http://www.popkontv.com";
                window.parent.postMessage(msg, targetDomain);
            }
        };

        // route 따라 동적으로 <title> 지정
        $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) {
            $rootScope.currentPath = $location.path();

            if (previousRoute !== currentRoute) {
                $rootScope.title = currentRoute.title;

                // 섹션코드에 따른 네비게이션 활성 : <a ng-class="{active: activeNav == 'all'}" ...>
                var activeNav = '';
                if (currentRoute.$$route.controller == "ListController") {
                    var sectionCode = currentRoute.params.section;
                    switch (sectionCode) {
                        case "S1N1":
                            activeNav = 'new';
                            break;
                        case "S1N4":
                            activeNav = 'review';
                            break;
                        case "S1N2":
                            activeNav = 'industry';
                            break;
                        case "S1N3":
                            activeNav = 'column';
                            break;
                        case "S1N6":
                            activeNav = 'life';
                            break;
                        case "S1N5":
                            activeNav = 'analysis';
                            break;
                        case "S1N7":
                            activeNav = 'motorshow';
                            break;
                        default :
                            activeNav = 'all';
                            break;
                    }
                }
                $rootScope.activeNav = activeNav;

                if ($window.ga) $window.ga('send', 'pageview', { page: $location.path() });
            }

            $timeout(function() {
                var height = Math.max(angular.element(document).height(), angular.element('body > div:first-child').height());
                angular.element('#content').height(height);
                $rootScope.page.postMessageToParent(height);
            }, 1.5 * 1000);
            //$rootScope.$evalAsync(function() { $rootScope.page.postMessageToParent(); });
        });
    }
})();