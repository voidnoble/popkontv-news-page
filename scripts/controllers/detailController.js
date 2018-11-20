/**
 * Created by YJKwak on 2015-04-15.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('DetailController', DetailController);

    DetailController.$inject = ['$scope', '$http', '$routeParams', '$sce'];

    function DetailController($scope, $http, $routeParams, $sce)
    {
    	var ad = '<iframe src="scripts/views/ads/adContent.html" width="300" height="250" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" style="display: block; float:right; margin: 0 0 5px 10px;"></iframe>';
        var vm = this;
        vm.data = null;
        vm.filter_iframe = function (iframe_tag) {
            // if iframe have youtube in it - return it back unchanged
            if (/src=".+youtube/.test(iframe_tag)){ return iframe_tag; }
            else if (/src=".+yourdomain\.com/.test(iframe_tag)) { return '<!--[AD]-->'; }
            else { return ''; }

            // if not - replace it with empty string, effectively removing it
            return '';
        };

        var id = $routeParams.id;

        var reqPromise = $http.get('/popkontv/nd_crawler.php?pos=detail&id=' + id);
        reqPromise.success(function (responseData) {
            responseData.content = responseData.content.replace(/(<iframe.*?>.*?<\/iframe>)/ig, vm.filter_iframe);
            responseData.content = responseData.content.replace(/<!--\[AD\]-->/, ad);
            vm.data = responseData;

            $scope.page.setTitle(vm.data.subject); // <title> 셋팅
        });
        reqPromise.error(function (responseData, status, headers, config) {
            console.error("Ajax error occured in DetailController.");
        });

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }

        // 사용자 상세 화면에서 뒤로가기 버튼을 클릭시 호출되며 이때 $location 서비스를 이용하여 브라우저 URL을 'userList'로 변경.
        $scope.back = function() {
            $location.url('/list');
        }
    }
})();