/**
 * Created by YJKwak on 2015-05-05.
 */
(function(){
    'use strict';

    /**
     * 리스트 on 팝콘TV 메인
     */
    angular
        .module('app')
        .factory('ListFactory', ListFactory);

    ListFactory.$inject = [];

    function ListFactory()
    {
        var data = {
            code : '',
            page : 1
        };

        return {
            getCode : getCode,
            setCode : setCode,
            getPage : getPage,
            setPage : setPage
        }

        function getCode() {
            return data.code;
        }
        function setCode(code) {
            data.code = code;
        }

        function getPage() {
            return data.page;
        }
        function setPage(page) {
            data.page = page;
        }
    }
})();