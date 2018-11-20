/**
 * Created by YJKwak on 2015-04-22.
 */
$(function(){
    var parentUrl = decodeURIComponent( document.location.hash.replace( /^#/, '' ) );
    parentUrl = decodeURIComponent( document.location.search.replace("?parentUrl=", "") );
    if (typeof parentUrl != "undefined" && parentUrl != "/" && parentUrl != "") resizeIframeWithPostMessage(parentUrl);
});

function resizeIframeWithPostMessage(parentUrl) {
    var h = $(document).height(),
        w = $(document).width();
    $.postMessage(
        { height: h, width: w },
        parentUrl,
        parent
    );
}