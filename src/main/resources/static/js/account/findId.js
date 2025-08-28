/**
 * 
 */
function selectEmailBtn() {
		const name = document.getElementById("findEmail-user-email").value
				.trim();
		const phone = document.getElementById("findEmail-user-password").value
				.trim();
		const resultBox = document.getElementById("findEmailResult");
		const resultText = document.querySelector(".resultMessege");

		if (!name || !phone) {
			showConfirm2("이름과 전화번호를 모두 입력해주세요.","",
				() => {
				}
			);
		    return;
		}

		try {
			
			fetch('/lgn/findId.do', {
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify({
					name : name,
					phone : phone
				})
			})
			.then(response => response.json())  
	  		.then(data => {
	  			console.log(data);
	  			findEmailResult.style.display = "block";
	  			resultText.textContent = data.count + "개";
	  			
	  		    const emailList = document.getElementById("emailList");

	  		    if (Array.isArray(data.memList)) {
	  		      data.memList.forEach(member => {
	  		    	const li = document.createElement("li");
	  		      	li.classList.add("email-item");
	  		     	li.textContent = member.memEmail;
	  		      	emailList.appendChild(li);
	  		      });
	  		    }
	  		})
		} catch (error) {
			console.error("에러 발생:", error);
			showConfirm2("서버 통신에 실패했습니다.","",
				() => {
				}
			);
			resultBox.style.display = "none";
		}
	}