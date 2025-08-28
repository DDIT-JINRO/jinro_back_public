function filedownload(fileGroupId,fileSeq,fileOrgName){
	axios({
	  method: 'get',
	  url: `/files/download`,
	  params: {
		groupId: fileGroupId, 
		seq: fileSeq            
	  },
	  responseType: 'blob' // 중요: 파일 다운로드 시 꼭 필요
	})
	.then(response => {
	  // 브라우저에서 파일 저장 처리
	  const blob = new Blob([response.data]);
	  const url = window.URL.createObjectURL(blob);
	  
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = fileOrgName;
	  document.body.appendChild(a);
	  a.click();
	  document.body.removeChild(a);
	  window.URL.revokeObjectURL(url);
	})
	.catch(error => {
	  console.error('파일 다운로드 실패:', error);
	});
}
document.addEventListener("DOMContentLoaded", () => {
    const goToInq = document.getElementById("goToInq");

    if (goToInq) {
        goToInq.addEventListener("click", (e) => {
            if (!memId || memId === 'anonymousUser') {
                e.preventDefault(); // 링크 기본 이동 막기
                showConfirm(
                    "로그인 후 이용 가능합니다.",
                    "로그인하시겠습니까?",
                    () => {
                        sessionStorage.setItem("redirectUrl", location.href);
                        location.href = "/login"; // 확인 시 로그인 페이지로 이동
                    },
                    () => {
                        // 취소 시 아무 동작 안 함
                    }
                );
            }
        });
    }
});