<?php header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Enable CORS
/**
 * Created by PhpStorm.
 * User: YJKwak
 * Date: 2015-04-14
 * Time: 오전 11:13
 *
 * phpQuery selector reference = https://code.google.com/archive/p/phpquery/wikis/Selectors.wiki
 */
include("../../lib/phpQuery.php");

// 파싱 위치
$pos = (isset($_GET['pos']))? $_GET['pos'] : '';
$id = (isset($_GET['id']))? $_GET['id'] : '';
$section = (isset($_GET['section']))? $_GET['section'] : '';
$page = (isset($_GET['page']))? $_GET['page'] : 1;

switch ($pos) {
    case "detail":
        printDetailJson($id);
        break;
    case "list":
        printListJson($section, $page);
        break;
    case "feature":
        printFeatureJson();
        break;
    case "review":
        printReviewJson();
        break;
    case "favorite":
        printFavoriteJson();
        break;
    case "issue":
        printIssueJson();
        break;
    default:
        printMainJson();
        break;
}

/**
 * 많이 본 뉴스
 */
function printFavoriteJson() {
    $url = "http://www.yourdomain.com/Autobox/250_bestnews.html";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 필요한 부분 DOM 쿼리
    $lis = $dom['.Article a'];
    $i = 0;
    $row = array();
    foreach ($lis as $li) {
        $row[$i]['url'] = pq($li)->attr('href');
        $row[$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row[$i]['url']);
        $row[$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * 메인 선택 슬라이드 크롤링하여 JSON 뿌리기
 */
function printFeatureJson() {
    $url = "http://www.yourdomain.com/Autobox/autobox_h16_4.html";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 필요한 부분 DOM 쿼리
    $lis = $dom['.BigPhotonew_23'];
    $i = 0;
    $row = array();
    foreach ($lis as $li) {
        $aFirst = pq($li)->find('a:first');
        $row[$i]['url'] = pq($aFirst)->attr('href');
        $row[$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row[$i]['url']);
        $row[$i]['subject'] = pq($aFirst)->text();
        $row[$i]['thumb'] = pq($li)->find('a:last')->attr('style'); // <a style="...background:url(?)..">
        preg_match('/background:url\((?P<image>.+)\)/', $row[$i]['thumb'] ,$matches); // Only get image url
        $row[$i]['thumb'] = $matches['image'];

        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * 메인 리뷰 크롤링하여 JSON 뿌리기
 */
function printReviewJson() {
    $url = "http://www.yourdomain.com/index.html";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 시승기&리뷰
    $lis = $dom['.article-box1:first-child .ArticleNew'];
    $i = 0;
    foreach ($lis as $li) {
        $row[$i]['url'] = pq($li)->find('a:first')->attr('href');
        $row[$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row[$i]['url']);
        $row[$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $row[$i]['thumb'] = pq($li)->find('a:first > img')->attr('src');
        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * 메인 크롤링하여 JSON 뿌리기
 */
function printMainJson() {
    $url = "http://www.yourdomain.com/index.html";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 위치: 실시간 이슈
    $lis = $dom['.ArticleNew:lt(3)'];
    $i = 0;
    $row = array();
    foreach ($lis as $li) {
        $row['issues'][$i]['url'] = pq($li)->find('a:first')->attr('href');
        $row['issues'][$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row['issues'][$i]['url']);
        $row['issues'][$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $row['issues'][$i]['thumb'] = pq($li)->find('a:first > img')->attr('src');

        $i++;
    }

    // 리스트
    $lis = $dom['.ArticleNew:gt(3):lt(15)'];
    $i = 0;
    foreach ($lis as $li) {
        $row['lists'][$i]['url'] = pq($li)->find('a:first')->attr('href');
        $row['lists'][$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row['lists'][$i]['url']);
        $row['lists'][$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $row['lists'][$i]['thumb'] = pq($li)->find('a:first > img')->attr('src');
        $row['lists'][$i]['content'] = pq($li)->find('.FtColor_typeB')->text();
        $i++;
    }

    // 시승기&리뷰
    $lis = $dom['.article-box1:first-child .ArticleNew'];
    $i = 0;
    foreach ($lis as $li) {
        $row['reviews'][$i]['url'] = pq($li)->find('a:first')->attr('href');
        $row['reviews'][$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $row['reviews'][$i]['thumb'] = pq($li)->find('a:first > img')->attr('src');
        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * 메인 이슈 크롤링하여 JSON 뿌리기
 */
function printIssueJson() {
    $url = "http://www.yourdomain.com/index.html";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 위치: 실시간 이슈
    $lis = $dom['.ArticleNew:lt(3)'];
    $i = 0;
    $row = array();
    foreach ($lis as $li) {
        $row['issues'][$i]['url'] = pq($li)->find('a:first')->attr('href');
        $row['issues'][$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $row['issues'][$i]['url']);
        $row['issues'][$i]['subject'] = pq($li)->find('.OnLoad')->text();
        $row['issues'][$i]['thumb'] = pq($li)->find('a:first > img')->attr('src');

        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * printListJson()
 * @param $section
 * @param $page
 *
 * NDSoft URL Pattern
 * http://www.yourdomain.com/news/articleList.html?sc_section_code={$section}&view_type=sm
 * http://www.yourdomain.com/news/articleList.html?sc_section_code=S1N1&page={$page}&sc_sub_section_code=&sc_serial_code=&sc_area=&sc_level=&sc_article_type=&sc_view_level=&sc_sdate=&sc_edate=&sc_serial_number=&sc_word=&sc_word2=&sc_andor=&sc_order_by=E&view_type=sm
 */
function printListJson($section = "", $page = 1)
{
    // 페이번호 링크 치환시 전체섹션일 경우 href="#/list//{$page}" 로 경로로 인해 오류 발생하여 #/list/all/ 로 임시 치환한것을 되돌림
    if ($section == "all") $section = "";

    // Crawling Source URL = NDSoft URL
    $url = "http://www.yourdomain.com/news/articleList.html?sc_section_code={$section}&page={$page}&sc_order_by=E&view_type=sm";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    $row = array();

    $contentWrapper = $dom['.body-wrap-basic > table'];

    // 섹션 레이블
    if ($section == "") {
        $row['sectionname'] = "최신뉴스";
    } else {
        $row['sectionname'] = pq($contentWrapper)->find('span:first')->text();
    }

    // 페이지리스트
    $row['pagelist'] = pq($contentWrapper)->find('td:first > table:last')->find('table')->htmlOuter();
    $row['pagelist'] = str_replace('<font color="#666666"> | </font>', '', $row['pagelist']); // 페이지번호 간 구분문자 제거
    $row['pagelist'] = str_replace('<img src="http://www.yourdomain.com/image2006/default/btn_first.gif" width="17" height="14" border="0">', '&laquo;', $row['pagelist']); // 처음으로 치환
    $row['pagelist'] = str_replace('<img src="http://www.yourdomain.com/image2006/default/btn_back.gif" width="14" height="14" border="0">', '&lsaquo;', $row['pagelist']); // 이전페이지 치환
    $row['pagelist'] = str_replace('<img src="http://www.yourdomain.com/image2006/default/btn_next.gif" width="14" height="14" border="0">', '&rsaquo;', $row['pagelist']); // 다음페이지 치환
    $row['pagelist'] = str_replace('<img src="http://www.yourdomain.com/image2006/default/btn_end.gif" width="17" height="14" border="0">', '&raquo;', $row['pagelist']); // 마지막페이지 치환
    // 페이지 번호들의 링크를 아래 ND소프트 url 에서
    // './articleList.html?page=2&total=2759&sc_section_code=S1N2&sc_sub_section_code=&sc_serial_code=&sc_area=&sc_level=&sc_article_type=&sc_view_level=&sc_sdate=&sc_edate=&sc_serial_number=&sc_word=&sc_word2=&sc_andor=&sc_order_by=E&view_type=sm'
    // 에서 #/list/:section/:page 형식으로 치환
    $pattern = '/href="\.\/articleList\.html\?page=(\d+).[^&]*&.[^sc]*sc_section_code=(\w[^&]+)?&.[^"]+"/i';
    $replacement = 'href="#/list/\2/\1"';
    $row['pagelist'] = preg_replace($pattern, $replacement, $row['pagelist']);
    $row['pagelist'] = str_replace("list//", "list/all/", $row['pagelist']);

    // items
    $lis = $dom['.ArtList_Title'];
    $i = 0;
    foreach ($lis as $itemTextContainer) {
        $itemImageContainer = pq($itemTextContainer)->prev();

        $row['lists'][$i]['url'] = pq($itemTextContainer)->find('a:first')->attr('href');
        $row['lists'][$i]['id'] = str_replace("articleView.html?idxno=", "", $row['lists'][$i]['url']);
        $row['lists'][$i]['subject'] = pq($itemTextContainer)->find('a:first')->text();
        $row['lists'][$i]['thumb'] = pq($itemImageContainer)->find('img')->attr('src');
        $row['lists'][$i]['content'] = pq($itemTextContainer)->find('a:first')->next()->text();
        $row['lists'][$i]['writer'] = pq($itemTextContainer)->find('.FontKor')->text();
        $row['lists'][$i]['writedtm'] = pq($itemTextContainer)->find('.FontEng')->text();

        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * printDetailJson()
 * @param $id
 *
 * NDSoft URL Pattern
 * http://www.yourdomain.com/news/articleView.html?idxno={$id}
 */
function printDetailJson($id)
{
    $url = "http://www.yourdomain.com/news/articleView.html?idxno={$id}";
    $html = crawl_url($url);

    // DOM 분석 준비
    $dom = phpQuery::newDocument($html);

    // 리스트
    $lis = $dom['.boxFootBig .ArticleNew'];
    $row = array();

    $row['id'] = $id; // 고유번호
    $row['url'] = "#/detail/{$row['id']}"; // 경로
    $row['sectionname'] = $dom['.View_Local']->find('a:last')->text(); // 섹션명
    $row['subject'] = $dom['.View_Title']->text(); // 제목
    $row['writer'] = $dom['.View_Info']->text(); // 필자
    $row['date'] = $dom['.View_Time']->text(); // 일자
    $row['date'] = str_replace("승인 ", "", $row['date']);

    // 내용
    $content = $dom['#articleBody'];
    $row['content'] = trim($content->html());

    // 첨부 이미지들
    $imagelist = pq($content)->find('img');
    foreach($imagelist as $img) {
        $row['imagelist'][]['image'] = pq($img)->attr('src');
    }

    // 관련기사
    $relatedArticlelist = $dom['.View_ReArticle2'];
    $i = 0;
    foreach($relatedArticlelist as $relatedArticle) {
        $row['relatedArticlelist'][$i]['url'] = $url = pq($relatedArticle)->attr('href');
        $row['relatedArticlelist'][$i]['id'] = str_replace("http://www.yourdomain.com/news/articleView.html?idxno=", "", $url);
        $row['relatedArticlelist'][$i]['subject'] = pq($relatedArticle)->text();
        $i++;
    }

    // 마무으리
    echo(json_encode($row));
}

/**
 * crawl_url()
 * @param String $url
 * @return String
 */
function crawl_url($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    curl_close($ch);

    // ND소프트 사이트는 euc-kr 이므로 인코딩 전환
    $result = mb_convert_encoding($result, 'UTF-8', 'EUC-KR');
    $result = str_replace("euc-kr", "utf-8", $result);

    // 기본 포맷팅
    $result = str_replace('background:url(/', 'background:url(http://www.yourdomain.com/', $result);
    $result = str_replace('./thumbnail', '/news/thumbnail', $result);
    $result = preg_replace('/(|src)="\//', '\1="http://www.yourdomain.com/', $result);
    $result = preg_replace('/(href)="\//', '\1="http://cms.yourdomain.com/', $result);

    // 반환
    return $result;
}
