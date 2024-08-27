	
document.getElementById('deleteFile').addEventListener('click', function() {
document.querySelector('input[name="comImgSname"]').value = '';
document.getElementById('fileName').textContent = '첨부파일 없음';
});

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('fileName').textContent = '현재 파일명 : ' + input.files[0].name;
        document.getElementById('fileName').dataset.originalName = input.files[0].name;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      var originalName = document.getElementById('fileName').dataset.originalName;
      if (originalName) {
        document.getElementById('fileName').textContent = '현재 파일명 : ' + originalName;
      } else {
        document.getElementById('fileName').textContent = '첨부파일 없음';
      }
      document.getElementById('preview').src = "";
    }
  }
