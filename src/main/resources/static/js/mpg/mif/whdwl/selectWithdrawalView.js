/**
 * 
 */

document.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 메시지 처리
    const channelSection = document.querySelector(".channel");
    if (channelSection) {
        const successMessage = channelSection.dataset.successMessage;
        const errorMessage = channelSection.dataset.errorMessage;
        if (successMessage) {
			showConfirm2(successMessage,"", 
			   () => {
			    }
			);
			return;
		}
		
        if (errorMessage) {
			showConfirm2(errorMessage,"", 
			   () => {
			    }
			);
			return;
		}
    }
	
	const movePasswordLink = document.querySelector("#movePassword");

	movePasswordLink.addEventListener("click", (e) => {
		e.preventDefault();
		
		const loginType = movePasswordLink.dataset.loginType;
		if (loginType != "G33001") {
			showConfirm2("소셜로그인 계정은 비밀번호를 변경 할 수 없습니다.","",()=>{});
			return;
		}
		
		location.href = "/mpg/mif/pswdchg/selectPasswordChangeView.do";
	})
	
    const withdrawalForm = document.querySelector(".withdrawal-form");
	const passwordCheckMessage = document.getElementById("password-check-message");

    withdrawalForm.addEventListener("submit", (e) => {
		
        e.preventDefault();

        const data = {
            password : document.querySelector("#password").value,
            category : document.querySelector("#reason-select").value,
            reason : document.querySelector("#reason-text").value,
        }

        fetch("/mpg/mif/whdwl/insertMemDelete.do", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(async response => {
			if (!response.ok) {
			    const errorData = await response.json();
                return await Promise.reject(errorData);
			}
			return response.json();
		}).then(result => {
			showConfirm2(result.message, "",
				() => {
					window.location.href = "/logout";
				}
			);
		}).catch(error => {
			console.error("회원 탈퇴 중 에러 발생 :", error);
			const errorMessage = error.message || "회원 탈퇴 처리 중 오류가 발생했습니다.";
			
			if(!passwordCheckMessage.classList.contains("is-active")) {
				passwordCheckMessage.classList.add("is-active");
			}
			
			passwordCheckMessage.textContent = errorMessage;
		})
    });
	
	document.getElementById("password").addEventListener("input", () => {
		passwordCheckMessage.classList.remove("is-active");
	})
});
