(function() {
    'use strict';

    /**
     * 메인 컨트롤러 (특수 구역 제외한 전체)
     */
    angular
        .module("app")
        .controller("ReviewController", ReviewController);

    ReviewController.$inject = ['$scope', '$http', '$location', 'ReviewFactory'];

    /**
     * 메인 컨트롤러 (특수 구역 제외한 전체)
     * @param $scope
     * @param $http
     */
    function ReviewController($scope, $http, $location, ReviewFactory)
    {
        var vm = this;

        vm.reviews = null;

        ReviewFactory.gets().then(function(data){
            vm.reviews = data;
        });
    }
})();