//카테고리 버튼 클릭 이벤트 핸들러
function filterByCategory(button) {
  var category = $(button).data('category');
  console.log(category);

  // 현재 URL 가져오기
  var currentUrl = new URL(window.location.toString());

  // 새로운 URLSearchParams 객체 생성
  //currentUrl.search -> ?category=전시 소식
  var searchParams = new URLSearchParams(currentUrl.search);

  // category 파라미터 수정
  if (category === '전체') {
    searchParams.delete('category');
  } else {
    searchParams.set('category', category);
  }

  // 새로운 쿼리 파라미터 설정
  currentUrl.search = searchParams.toString();

  // URL 변경 (새로고침 없이)
  history.replaceState(null, null, currentUrl.toString());
}

// 로그인 없이 글쓰기 
window.onload = function() {
    var errorMessage = "[[${errorMessage}]]";
    if (errorMessage && errorMessage !== "") {
        alert(errorMessage);
    }
};


//좋아요
function toggleLike(comId) {
$.ajax({
    url: '/exhibitscape/community/' + comId + '/like',
    type: 'POST',
    success: function(response) {
        // 좋아요 상태 업데이트
        var heartImg = $('#heart-' + comId);
        var likeCountSpan = $('#likeCount-' + comId);
        
        if (response.liked) {
            heartImg.attr('src', '/image/community/redheart.png');
        } else {
            heartImg.attr('src', '/image/community/emptyheart.png');
        }
        
        likeCountSpan.text(response.likeCount);
    },
    error: function(xhr, status, error) {
        console.log('좋아요 토글 실패');
        
    }
});
}

function showLoginAlert() {
    var result = confirm("로그인 하셔야 이용할 수 있습니다. 로그인 페이지로 이동하시겠습니까?");
    if (result) {
        window.location.href = "/login"; // 로그인 페이지 URL로 변경해야 합니다.
    }
}
