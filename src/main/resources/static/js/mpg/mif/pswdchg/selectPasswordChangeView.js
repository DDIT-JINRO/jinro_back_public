/**
 * 
 */
// 비밀번호 적합 여부
document.addEventListener("DOMContentLoaded", () => {
    let isNewValidate = false;
    let isConfirmValidate = false;

    const submitBtn = document.querySelector("#submit-btn");
    // 페이지 로드 시 메시지 처리
    const channelSection = document.querySelector(".channel");
    if (channelSection) {
        const successMessage = channelSection.dataset.successMessage;
        const errorMessage = channelSection.dataset.errorMessage;
        if (successMessage){
			showConfirm2(successMessage,"",
				() => {
					return;
				}
			);
		}
        if (errorMessage){
			showConfirm2(errorMessage,"",
				() => {
					return;
				}
			);
		}
		
    }

    const oldPasswordInput = document.querySelector("#old-password");
    const oldErrorMsg = oldPasswordInput.nextElementSibling;
    const newPasswordInput = document.querySelector("#new-password");
    const newErrorMsg = newPasswordInput.nextElementSibling;
    const confirmPasswordInput = document.querySelector("#confirm-password");
    const confirmErrorMsg = confirmPasswordInput.nextElementSibling;

    oldPasswordInput.addEventListener("input", () => {
        if(oldErrorMsg) oldErrorMsg.textContent = "";
    })

    newPasswordInput.addEventListener("input", () => {
        validateNewPassword();
        validateConfirmPassword();
    });

    confirmPasswordInput.addEventListener("input", () => {
        validateConfirmPassword();
    })

    submitBtn.addEventListener("click", () => {
		const isOldValid = oldPasswordInput.value.trim() !== "";
		if (!isOldValid) {
			showConfirm2("현재 비밀번호를 입력해주세요.","",
				() => {
					oldPasswordInput.focus();
					return;
				}
			);
		}
		
		if (isNewValidate && isConfirmValidate) {
	        fetch("/mpg/mif/pswdchg/updatePassword.do", {
	            method: "POST",
	            headers: {
	                "Content-Type": "application/json"
	            },
	            body: JSON.stringify({
	                "password": oldPasswordInput.value,
	                "newPassword": newPasswordInput.value
	            })
	        }).then(response => {
				return response.json();
			}).then(result => {
				showConfirm2(result.message,"",
					() => {
						if(result.status === "success") {					
						    location.href = "/mpg/mif/inq/selectMyInquiryView.do";
						} else {
						    oldPasswordInput.focus();
						}
					}
				);

			}).catch(error => {
				console.error("비밀번호 변경 중 에러 발생 : ", error);
				showConfirm2("비밀번호 변경 중 오류가 발생했습니다.","", 
				   () => {
						return;
				    }
				);
			});
		} else {
			showConfirm2("입력 내용을 다시 확인해주세요.","",
				() => {
					return;
				}
			);
		}
	});

    const validateNewPassword = () => {
        const newPassword = newPasswordInput.value;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
		
		newErrorMsg.classList.remove("success");

        if (newPassword === "" && newPassword === null) {
            newErrorMsg.textContent = "비밀번호를 입력해주세요.";
            isNewValidate = false;
            return;
        } else if (!passwordRegex.test(newPassword)) {
            newErrorMsg.textContent = "비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.";
            isNewValidate = false;
            return;
        } else {
            newErrorMsg.textContent = "사용가능한 비밀번호 입니다.";
            newErrorMsg.classList.add("success");
            isNewValidate = true;
        }
    }

    const validateConfirmPassword = () => {
        const confirmPassword = confirmPasswordInput.value;
        const newPassword = newPasswordInput.value;
		
		confirmErrorMsg.classList.remove("success");

        if (confirmPassword === "" || confirmPassword === null || confirmPassword === undefined) {
            confirmErrorMsg.textContent = "";
            isConfirmValidate = false;
            return;
        } else if (newPassword !== confirmPassword) {
            confirmErrorMsg.textContent = "비밀번호가 일치하지 않습니다.";
            isConfirmValidate = false;
            return;
        } else {
            confirmErrorMsg.textContent = "비밀번호가 일치합니다.";
            confirmErrorMsg.classList.add("success");
            isConfirmValidate = true;
        }
    }
})