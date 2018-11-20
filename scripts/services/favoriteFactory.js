/**
 * Created by YJKwak on 2015-04-16.
 */
(function(){
    'use strict';

    /**
     * 이슈들 on 회사 메인
     *
     * Example in Controller :
     * // 이슈들
     * IssueFactory.gets()
     *      .then(function(data){
     *            vm.issues = data;
     *        });
     */
    angular
        .module('app')
        .factory('FavoriteFactory', FavoriteFactory);

    FavoriteFactory.$inject = ['$http', '$log'];

    function FavoriteFactory($http, $log)
    {
        return {
            gets : gets
        }

        function gets() {
            var scope = this;

            var url = '/popkontv/nd_crawler.php?pos=favorite';
            // IE8 implements ECMAScript 3 so .catch -> ["catch"]
            return $http.get(url).then(loadComplete)["catch"](loadFailed);

            function loadComplete(responseData)
            {
                return responseData.data;
            }

            function loadFailed(error, status, headers, config) {
                $log.error("Ajax failed in IssueFactory.load().\n"+ error.data);
            }
        }
    }
})();