
//댓글 등록..
function submitComment(comId) {
	  var commentContent = $(".comment-write-area").val().trim();
	  if (commentContent === "") {
	    alert("댓글 내용을 입력해주세요.");
	    return;
	  }

	  $.ajax({
	    type: "POST",
	    url: "/exhibitscape/comment/write/" + comId,
	    data: { comContent: commentContent },
	    success: function(response) {
	      var newComment = response;
	      var postDate = new Date(newComment.postDate);
	      var formattedDate = postDate.toISOString().split('T')[0];
	      var commentHtml = `
	        <li class="comment-li">
	          <div class="comment-item">
	            <div class="comment-thumb">
	            <div class="profile-img">
			    	<img src="/image/community/${newComment.imgRandom}" alt="Random Image">
				</div>
				</div>
	            <div class="comment-content">
	              <div class="comment-info">
	                <div class="user-info">
	                  <span class="name">${newComment.memberId}</span>
	                  <span class="postDate">${newComment.postDate}</span>
	                </div>
	              </div>
	              <div class="comment-text" data-comcom-id="${newComment.comComId}">${newComment.comContent}</div>
	              <div class="comment-btn">
	                <input type="button" class="comment-update-btn" value="수정" onclick="enterEditMode(${newComment.comComId})"/>
	                <input type="button" class="comment-delete-btn" value="삭제" onclick="deleteComment(${newComment.comComId})"/>
	                <button class="save-comment" style="display: none;">수정 완료</button>
	              </div>
	            </div>
	          </div>
	        </li>
	      `;
	      $(".comment-list ul").append(commentHtml);
	      $(".comment-write-area").val("");
	    },
	    error: function(xhr, status, error) {
	      alert("댓글 등록에 실패했습니다.");
	    }
	  });
	}

function enterEditMode(comComId) {
	  var $commentText = $(".comment-text[data-comcom-id='" + comComId + "']");
	  var originalText = $commentText.text(); // 원래 댓글 내용 저장
	  $commentText.attr('contenteditable', 'true');
	  $commentText.focus();
	  var $commentBtn = $commentText.closest('.comment-content').find('.comment-btn');
	  $commentBtn.find('.comment-update-btn, .comment-delete-btn').hide(); // 수정, 삭제 버튼 숨기기
	  var $saveButton = $commentBtn.find('.save-comment');
	  $saveButton.show();
	  $saveButton.off('click').on('click', function() {
	    updateComment(comComId, originalText);
	    return false; // 폼 제출 방지
	  });
	}

	//댓글수정
	function updateComment(comComId, originalText) {
	  var $commentText = $(".comment-text[data-comcom-id='" + comComId + "']");
	  var comContent = $commentText.text().trim();
	  if (comContent === "") {
	    alert("댓글 내용을 입력해주세요.");
	    $commentText.text(originalText); // 원래 댓글 내용으로 되돌림
	    return;
	  }
	  $.ajax({
	    type: 'POST',
	    url: '/exhibitscape/comment/update/' + comComId,
	    data: { comContent: comContent },
	    success: function(response) {
	      var updatedComment = response;
	      var postDate = new Date(updatedComment.postDate);
	      var formattedDate = postDate.toISOString().split('T')[0];
	      $commentText.siblings('.comment-info').find('.postDate').text(formattedDate);
	      $commentText.attr('contenteditable', 'false');
	      var $commentBtn = $commentText.closest('.comment-content').find('.comment-btn');
	      $commentBtn.find('.comment-update-btn, .comment-delete-btn').show(); // 수정, 삭제 버튼 보이기
	      $commentBtn.find('.save-comment').hide(); // 수정완료 버튼 숨기기
	    },
	    error: function() {
	      alert('댓글 수정에 실패했습니다.');
	      $commentText.text(originalText); // 원래 댓글 내용으로 되돌림
	    }
	  });
	}
	
	//댓글삭제
	function deleteComment(comComId) {
	  $.ajax({
	    type: 'POST',
	    url: '/exhibitscape/comment/delete/' + comComId,
	    success: function(response) {
	      if (response === 'success') {
	        // 삭제 성공 시 해당 댓글 요소를 화면에서 제거
	        $(".comment-text[data-comcom-id='" + comComId + "']").closest('.comment-li').remove();
	      } else {
	        alert('댓글 삭제에 실패했습니다.');
	      }
	    },
	    error: function() {
	      alert('댓글 삭제에 실패했습니다.');
	    }
	  });
	}
	//좋아요
	function toggleLike(comId) {
    $.ajax({
        url: '/exhibitscape/community/' + comId + '/like',
        type: 'POST',
        success: function(response) {
            // 좋아요 상태 업데이트
            var heartImg = $('#heart');
            var likeCountSpan = $('.like-count');
            
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
	
//지도 생성하기
 	// 현재 페이지의 comId 값 가져오기
    var mapElement = document.getElementById('map');
    var comId = mapElement.getAttribute('data-com-id');

    // 서버로부터 데이터 가져오기
    fetch('/exhibitscape/map-data?comId=' + comId)
        .then(response => response.json())
        .then(data => {
            var latitude = data.placeLat;
            var longitude = data.placeLong;
            var placeName = data.placeName;

            // 지도 초기화 및 마커 표시 로직
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                mapOption = {
                    center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };

            var map = new kakao.maps.Map(mapContainer, mapOption);

            // 마커가 표시될 위치입니다 
            var markerPosition = new kakao.maps.LatLng(latitude, longitude);

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: markerPosition
            });

            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);

            var iwContent = '<div style="padding:5px;">' + placeName + '</div>',
                iwPosition = new kakao.maps.LatLng(latitude, longitude); //인포윈도우 표시 위치입니다

            // 인포윈도우를 생성합니다
            var infowindow = new kakao.maps.InfoWindow({
                position: iwPosition,
                content: iwContent
            });

            // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
            infowindow.open(map, marker);
        })
        .catch(error => {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        });
