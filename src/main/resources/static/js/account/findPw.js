/**
 * 
 */

function ReissuePwBtn() {
		const email = document.getElementById("findEmail-user-email").value.trim();
		const name = document.getElementById("findEmail-user-name").value.trim();
		const button = document.getElementById("reissueBtn");
		
		if (!email || !name ) {
			showConfirm2("모든 항목을 입력해주세요.","",
	  			() => {
					return;
	  			}
	  		);
		}
		
		button.disabled = true;
		button.innerText = "전송 중";
		button.classList.add("disabled-btn");
		
		fetch("/lgn/findPw.do", {
		  method: "POST",
		  headers: {
		    "Content-Type": "application/json"
		  },
		  body: JSON.stringify({
		    email: email,
		    name: name,
		  })
		})
		.then(response => response.text())
		.then(result => {
			if (result === "success") {
				showConfirm2("임시 비밀번호 발급 요청 메일이 전송되었습니다.","",
		  			() => {
						return;
		  			}
		  		);
		    } else {
				showConfirm2("입력하신 정보가 일치하지 않습니다.","",
		  			() => {
						return;
		  			}
		  		);
		    }
		})
		.catch(error => {
			console.error("에러 발생:", error);
			showConfirm2("서버 오류가 발생했습니다.","",
	  			() => {
					return;
	  			}
	  		);
		})
		.finally(() => {
		      button.disabled = false;
		      button.innerText = "임시 비밀번호 발급";
		      button.classList.remove("disabled-btn");
		    });
	}