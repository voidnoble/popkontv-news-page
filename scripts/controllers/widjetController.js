(function() {
    'use strict';

    /**
     * 메인 컨트롤러 (특수 구역 제외한 전체)
     */
    angular
        .module("app")
        .controller("WidjetController", WidjetController);

    WidjetController.$inject = ['$scope', '$http', '$location', '$q', 'MainFeatureFactory', 'IssueFactory'];

    /**
     * 메인 컨트롤러 (특수 구역 제외한 전체)
     * @param $scope
     * @param $http
     */
    function WidjetController($scope, $http, $location, $q, MainFeatureFactory, IssueFactory)
    {
        var vm = this;
        var deferred = $q.defer();

        vm.limitCount = 3;

        vm.features = null;
        vm.issues = null;
        vm.reviews = null;
        vm.lists = null;

        $q.all([
            MainFeatureFactory.gets(),
            IssueFactory.gets(),
            $http.get('/popkontv/nd_crawler.php')
        ]).then(
            function(results) {
                vm.features = results[0];
                vm.issues = results[1];
                vm.reviews = results[2].data.reviews;
                vm.lists = results[2].data.lists;

                deferred.resolve(results);
            },
            function(errors) {
                deferred.reject(errors);
            },
            function(updates) {
                deferred.update(updates);
            }
        );
    }
})();