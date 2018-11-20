(function() {
    'use strict';

    /**
     * 많이 본 뉴스
     */
    angular
        .module("app")
        .controller("FavoriteController", FavoriteController);

    FavoriteController.$inject = ['$scope', '$http', 'FavoriteFactory'];

    /**
     * 많이 본 뉴스
     * @param $scope
     * @param $http
     */
    function FavoriteController($scope, $http, FavoriteFactory)
    {
        var vm = this;

        vm.favorites = null;

        FavoriteFactory.gets().then(function (data) {
            vm.favorites = data;
        });
    }
})();