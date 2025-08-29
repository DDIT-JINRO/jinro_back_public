document.addEventListener("DOMContentLoaded", function() {
	//다음 주소 가져오기
	document.querySelector(".icon-search").addEventListener("click", function() {
		new daum.Postcode({
			oncomplete: function(data) {
				// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

				// 각 주소의 노출 규칙에 따라 주소를 조합한다.
				// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
				var addr = ''; // 주소 변수
				var extraAddr = ''; // 참고항목 변수

				//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
				if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
					addr = data.roadAddress;
				} else { // 사용자가 지번 주소를 선택했을 경우(J)
					addr = data.jibunAddress;
				}

				// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
				if (data.userSelectedType === 'R') {
					// 법정동명이 있을 경우 추가한다. (법정리는 제외)
					// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
					if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
						extraAddr += data.bname;
					}
					// 건물명이 있고, 공동주택일 경우 추가한다.
					if (data.buildingName !== '' && data.apartment === 'Y') {
						extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
					}
					// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
					if (extraAddr !== '') {
						extraAddr = ' (' + extraAddr + ')';
					}
					// 조합된 참고항목을 해당 필드에 넣는다.
					document.getElementById("address").value = addr;

				} else {
					document.getElementById("address").value = '';
				}

			}
		}).open();
	})

	//이미지 미리보기
	let lastFile = null;  // 마지막 파일을 저장할 변수

	// 파일 선택 시
	document.querySelector("#photo-upload").addEventListener("input", function(event) {
		const file = event.target.files[0];  // 선택된 파일
		const preview = document.querySelector("#photo-preview");
		const placeholder = document.querySelector(".upload-placeholder");
		// 파일이 선택된 경우에만 처리

		// 이전에 선택된 파일과 비교
		if (file != null && file !== lastFile) {
			const reader = new FileReader();
			reader.onload = function(e) {
				preview.src = e.target.result;  // 미리보기 이미지
				preview.style.display = "block";  // 이미지 표시

				// 아이콘/텍스트 숨기기
				if (placeholder) {
					placeholder.classList.add("hidden");
				}
			};
			reader.readAsDataURL(file);

			lastFile = file;  // 마지막 파일 업데이트
		}
	});

	document.querySelector("#photo-delete-btn").addEventListener("click", function(event) {
		let file = document.querySelector("#photo-upload");
		const preview = document.querySelector("#photo-preview");
		const placeholder = document.querySelector(".upload-placeholder");
		preview.src = "";
		preview.style.display = "none";  // 미리보기 숨기기
		if (placeholder) {
			placeholder.classList.remove("hidden");  // 아이콘/텍스트 다시 보이기
		}
		file = null;
	})

	// 파일 입력 취소 시 기존 파일 값 유지
	document.querySelector("#photo-upload").addEventListener("click", function() {
		// 클릭 시 파일 값이 null로 초기화되는 문제 해결
		const photoInput = document.querySelector("#photo-upload");
		if (!photoInput.files[0] && lastFile) {
			// 취소 후 기존 파일 유지
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(lastFile);
			photoInput.files = dataTransfer.files;
		}
	});


	const loadButtons = document.querySelectorAll(".load-button-group button");

	// 버튼 클릭 시 항목 추가
	loadButtons.forEach(button => {
		button.addEventListener("click", function(e) {
			// Your code to handle the click event
			let rsId = e.target.dataset.id;

			// 콘텐츠가 이미 추가되어 있는지 확인
			const form = document.querySelector(".personal-info-form");
			const existingElement = form.querySelector(`[data-id="${rsId}"]`);

			if (existingElement) {
				// 이미 추가된 콘텐츠가 있으면 해당 콘텐츠를 삭제
				existingElement.remove();
			} else {
				// 추가된 콘텐츠가 없으면 서버에서 HTML 데이터를 받아옴
				axios.get('/cdp/rsm/rsm/getElement?rsId=' + rsId)
					.then(function(response) {
						const lastDiv = form.lastElementChild; // 폼의 마지막 div를 찾음

						// 새로 받은 HTML 데이터를 마지막 div 밑에 추가
						lastDiv.insertAdjacentHTML('afterend', response.data);

						// 추가된 콘텐츠에 data-id를 추가하여 나중에 확인할 수 있도록 설정
						const newElement = form.lastElementChild;
						newElement.setAttribute("data-id", rsId);

						// DOM이 추가된 후, 이벤트 리스너를 한 번만 등록하도록 처리
						addEventListeners();
					});
			}
		});
	});



	document.getElementById("add-job").addEventListener("click", function() {
		// 'job-input-group' div를 찾기
		const jobInputGroup = document.querySelector(".job-input-group");

		// 새로운 input 요소 생성
		const newInput = document.createElement('input');
		newInput.type = 'text';
		newInput.name = 'desired-job';
		newInput.className = 'desired-job';
		newInput.placeholder = '희망 직무를 입력하세요..';
		newInput.value = '';
		newInput.required = true;

		// 삭제 버튼 생성
		const deleteButton = createDeleteButton(newInput);

		// 새로 생성된 input과 삭제 버튼을 div에 추가
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container');
		inputContainer.appendChild(newInput);
		inputContainer.appendChild(deleteButton);

		// 새로 생성된 input과 버튼을 기존 input 아래에 추가
		jobInputGroup.appendChild(inputContainer);
	});

	document.getElementById("add-skill").addEventListener("click", function() {
		const skillsInputGroup = document.querySelector(".skills-input-group");

		// 새로운 input 요소 생성
		const newInput = document.createElement('input');
		newInput.type = 'text';
		newInput.name = 'skills';
		newInput.placeholder = '스킬을 입력하세요';
		newInput.value = '';
		newInput.required = true;

		// 삭제 버튼 생성
		const deleteButton = createDeleteButton(newInput);

		// 새로 생성된 input과 삭제 버튼을 div에 추가
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container');
		inputContainer.appendChild(newInput);
		inputContainer.appendChild(deleteButton);

		// 새로 생성된 input과 버튼을 기존 input 아래에 추가
		skillsInputGroup.appendChild(inputContainer);
	});

	const deleteButton = document.querySelector("#btn-resume-delete");
	if (deleteButton) {
		deleteButton.addEventListener("click", function() {
			const resumeId = document.querySelector("#resumeId").value;

			if (!resumeId || resumeId === "0") {
				showConfirm2("삭제할 이력서가 없습니다.","",
					() => {
					}
				);
				return;
			}

			showConfirm("정말 삭제하시겠습니까?", "",
				() => {
					axios.post("/cdp/rsm/rsm/deleteResume.do", { resumeId: resumeId })
						.then(response => {
							if (response.data.status === 'success') {
								showConfirm2("이력서가 삭제되었습니다.","",
									() => {
										location.href = "/cdp/rsm/rsm/resumeList.do";
									}
								);

							} else {
								showConfirm2("삭제에 실패했습니다.","",
									() => {
									}
								);
							}
						})
						.catch(err => {
							console.error("삭제 중 오류 발생:", err);
						});
				},
				() => {
				}
			);
		})
	}
	
	document.querySelectorAll("#btn-submit-Temp, #btn-submit")
		.forEach(button => {
			button.addEventListener("click", function(event) {
				const target = event.target;
				const allElementDiv = document.querySelector(".personal-info-form");
				const resumeTitle = document.querySelector("#resumeTitle");
				const resumeTitleVal = document.querySelector("#resumeTitle").value;
				const resumeId = document.querySelector("#resumeId").value;
				const fileGroupId = document.querySelector("#fileGroupId").value;
				const objs = allElementDiv.querySelectorAll('input, select, textarea');  // 모든 입력 요소를 선택

				//제목 검사
				if (resumeTitle.hasAttribute("required") && !resumeTitleVal.trim()) {
					showConfirm2("제목을 입력해주세요.","",
						() => {
							resumeTitle.focus();
						}
					);
					return;
				}

				for (let i = 0; i < objs.length; i++) {

					// 'value'가 반영된 상태로 outerHTML을 가져오기
					const updatedInput = objs[i];  // 해당 input 요소
					const value = updatedInput.value.trim();

					// 동적으로 업데이트된 값을 반영
					if (updatedInput.tagName === "INPUT" || updatedInput.tagName === "TEXTAREA"
						|| updatedInput.tagName === "SELECT") {
						updatedInput.setAttribute("value", updatedInput.value);  // 동적으로 변경된 값을 반영
					}

					// 'required'가 있고 값이 비어 있다면
					if (updatedInput.hasAttribute("required") && !value) {
						showConfirm2("필수 입력 항목을 입력해주세요.","",
							() => {
								updatedInput.focus();
							}
						);						
						return;
					}


					// 포맷 검사
					if (updatedInput.name === "email") {
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if (!emailRegex.test(value)) {
							showConfirm2("이메일 형식이 올바르지 않습니다.","",
								() => {
									updatedInput.focus();
								}
							);
							return;
						}
					}

					if (updatedInput.name === "phone" || updatedInput.name === "mobile-phone") {
						const phoneRegex = /^010\d{4}\d{4}$/; // 예: 010-1234-5678
						if (value && !phoneRegex.test(value)) {
							showConfirm2("전화번호 형식이 올바르지 않습니다.","예: 01012345678",
								() => {
									updatedInput.focus();
								}
							);
							return;	
						}
					}

				}
				let resumeIsTemp = null

				if (target.id === "btn-submit-Temp") {
					resumeIsTemp = 'Y'
					// 임시 저장 로직 실행
				} else if (target.id === "btn-submit") {
					resumeIsTemp = 'N'
					// 정식 저장 로직 실행
				}

				// 실제 이미지 input에서 파일 추출
				const photoInput = document.querySelector("#photo-upload");
				const photoFile = photoInput.files[0];

				applySelectedToOptions();
				resumeContent = allElementDiv.outerHTML;  // value가 반영된 상태의 outerHTML

				submitResume(resumeTitleVal, resumeContent, resumeId, photoFile, fileGroupId, resumeIsTemp);

			})

			const delectBtn = document.getElementsByClassName("delete-button");

			for (let i = 0; i < delectBtn.length; i++) {
				delectBtn[i].addEventListener("click", function(e) {
					e.target.parentElement.remove();
				});
			}
			addEventListeners();
		});

		

		document.querySelector("#btn-preview").addEventListener("click", async () => {
			
			  const originalForm = document.querySelector(".public-wrapper-main");
			  const clonedForm = originalForm.cloneNode(true)
			  
			  const buttonsToRemove = clonedForm.querySelectorAll("button, .delete-button"); // 모든 버튼과 삭제 버튼
		  		buttonsToRemove.forEach(btn => {
		  			btn.remove();
		  		});
	
		  		spanRemove = clonedForm.querySelectorAll("span");
		  		spanRemove.forEach(span => {
		  			span.remove();
		  		})
	
		  		// 이력서 제목 입력 필드 제거 (만약 `.resume-title`이 미리보기에 포함되면 안 된다면)
		  		const resumeTitleInput = clonedForm.querySelector(".resume-title");
		  		if (resumeTitleInput) {
		  			resumeTitleInput.remove();
		  		}
				
				const iconSearch = clonedForm.querySelector(".icon-search");
				if (iconSearch) {
					iconSearch.remove();
				}
			  const opt = {
				margin: 5,
			    filename: 'resume.pdf',
			    image: { type: 'jpeg', quality: 0.98 },
			    html2canvas: { 
			      scale: 2, 
			      useCORS: true, 
			      scrollX: 0,   // 스크롤 보정
			      scrollY: 0
			    },
			    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
			    pagebreak: { mode: ['css', 'legacy'] } // 페이지 나눔 보정
			  };
			  html2pdf().from(clonedForm).set(opt).output('dataurlnewwindow'); 
			  
		});

	const photoUploadArea = document.querySelector('.photo-upload-area');
	    const photoInput = document.getElementById('photo-upload');

	    // 기본 드래그 이벤트 방지
	    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	        photoUploadArea.addEventListener(eventName, preventDefaults, false);
	    });

	    function preventDefaults(e) {
	        e.preventDefault();
	        e.stopPropagation();
	    }

	    // 드래그 중인 상태 스타일 변경
	    ['dragenter', 'dragover'].forEach(eventName => {
	        photoUploadArea.addEventListener(eventName, highlight, false);
	    });

	    ['dragleave', 'drop'].forEach(eventName => {
	        photoUploadArea.addEventListener(eventName, unhighlight, false);
	    });

	    function highlight(e) {
	        photoUploadArea.classList.add('dragover');
	    }

	    function unhighlight(e) {
	        photoUploadArea.classList.remove('dragover');
	    }
		
		// 문서 전체에 드래그 이벤트 기본 동작 방지
		document.addEventListener('dragenter', function(e) {
		    e.preventDefault();
		});

		document.addEventListener('dragover', function(e) {
		    e.preventDefault();
			e.dataTransfer.dropEffect = 'none'; // 드래그 시 아이콘 숨기기
		});

		document.addEventListener('drop', function(e) {
		    e.preventDefault();
		});

		// photoUploadArea에만 드롭을 허용하고 효과를 변경
		photoUploadArea.addEventListener('dragover', function(e) {
		    e.preventDefault();
		    e.dataTransfer.dropEffect = 'copy'; // 사진 영역에서는 'copy' 아이콘 표시
		});

		photoUploadArea.addEventListener('drop', handleDrop);

	    function handleDrop(e) {
	        const dt = e.dataTransfer;
	        const files = dt.files;

	        if (files.length > 0) {
	            const file = files[0];
	            // 드롭된 파일이 이미지인지 확인
	            if (file.type.startsWith('image/')) {
	                const dataTransfer = new DataTransfer();
	                dataTransfer.items.add(file);
	                photoInput.files = dataTransfer.files;

	                // 미리보기 이미지 업데이트
	                const reader = new FileReader();
	                reader.onload = function(event) {
	                    const photoPreview = document.getElementById('photo-preview');
	                    photoPreview.src = event.target.result;
	                    photoPreview.style.display = 'block';
	                    photoUploadArea.querySelector('.upload-placeholder').classList.add('hidden'); 
	                };
	                reader.readAsDataURL(file);
	            } else {
					showConfirm2("이미지 파일만 드래그할 수 있습니다.","",
						() => {
						}
					);
	            }
	        }
	    }

});

// 자동완성 기능 추가
document.addEventListener('DOMContentLoaded', function() {
	//자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}
})

// `sanitizeHtmlToXHTML` 함수는 이 이벤트 리스너 밖에 정의되어 있어야 합니다.
function sanitizeHtmlToXHTML(html) {
	return html
		.replace(/<meta([^>]*?)(?<!\/)>/gi, '<meta$1 />')
		.replace(/<link([^>]*?)(?<!\/)>/gi, '<link$1 />')
		.replace(/<input([^>]*?)(?<!\/)>/gi, '<input$1 />')
		.replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />')
		.replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />')
		.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
}


//select selected 해주는 함수
function applySelectedToOptions() {
	const selects = document.querySelectorAll("select");

	selects.forEach(select => {
		const selectedValue = select.value;

		Array.from(select.options).forEach(option => {
			option.removeAttribute("selected");
		});

		const selectedOption = Array.from(select.options).find(
			option => option.value === selectedValue
		);
		if (selectedOption) {
			selectedOption.setAttribute("selected", "selected");
		}
	});
}


//form형태로 전송하는 함수
function submitResume(resumeTitle, resumeContent, resumeId, photoFile, fileGroupId, resumeIsTemp) {
	const formData = new FormData();
	formData.append('resumeTitle', resumeTitle);
	formData.append('resumeContent', resumeContent);
	formData.append('fileGroupId', fileGroupId);
	formData.append('resumeIsTemp', resumeIsTemp);
	if (resumeId !== undefined && resumeId !== null) {
		formData.append('resumeId', resumeId);
	}
	if (photoFile) {
		formData.append('files', photoFile);
	}

	// FormData는 form.submit과 달리 비동기 전송
	fetch('/cdp/rsm/rsm/insertResume.do', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				location.href = `/cdp/rsm/rsm/resumeList.do`;//resumeWriter?resumeId=${data.resumeId}`;
			} else {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					() => {

					}
				);
			}
		})
		.catch(err => console.error('에러 발생:', err));
}

// 이벤트 리스너 추가하는 함수
function addEventListeners() {
	// 학력 항목 추가 이벤트
	const containerEducation = document.querySelector('.form-Education');
	if (containerEducation) {  // 요소가 존재할 때만 이벤트 리스너를 추가
		containerEducation.removeEventListener('click', handleEducationClick);  // 기존 이벤트 리스너 제거
		containerEducation.addEventListener('click', handleEducationClick); // 이벤트 리스너 추가
	}

	// 자격증 항목 추가 이벤트
	const containerCertificate = document.querySelector('.form-certificate');
	if (containerCertificate) {  // 요소가 존재할 때만 이벤트 리스너를 추가
		containerCertificate.removeEventListener('click', handleCertificateClick);  // 기존 이벤트 리스너 제거
		containerCertificate.addEventListener('click', handleCertificateClick);  // 이벤트 리스너 추가
	}

	// 대외 활동 항목 추가 이벤트
	const containerActivities = document.querySelector('.form-activities');
	if (containerActivities) {  // 요소가 존재할 때만 이벤트 리스너를 추가
		containerActivities.removeEventListener('click', handleActivitiesClick);  // 기존 이벤트 리스너 제거
		containerActivities.addEventListener('click', handleActivitiesClick); // 이벤트 리스너 추가
	}
}

// 학력 항목 클릭 이벤트 처리
function handleEducationClick(event) {
	if (event.target && event.target.closest('.form-Education #add-education')) {
		const educationInputGroupContainer = event.target.closest('.form-Education').querySelector('.education-input-container');

		const newSelect = document.createElement('select');
		newSelect.name = 'education-level';
		newSelect.innerHTML = `
                <option value="">학력 종류 선택</option>
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="대학교">대학교</option>
                <option value="대학원">대학원</option>
            `;

		const newInput = document.createElement('input');
		newInput.type = 'text';
		newInput.name = 'education';
		newInput.placeholder = '학교명을 입력하세요';
		newInput.value = '';
		newInput.required = true;

		// 삭제 버튼 생성
		const deleteButton = createDeleteButton(newInput);

		// 새로 생성된 input과 삭제 버튼을 함께 추가
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container', 'education');
		inputContainer.appendChild(newSelect);
		inputContainer.appendChild(newInput);
		inputContainer.appendChild(deleteButton);

		educationInputGroupContainer.appendChild(inputContainer);
	}
}

// 자격증 항목 클릭 이벤트 처리
function handleCertificateClick(event) {
	if (event.target && event.target.closest('.form-certificate #add-certificate')) {
		const certificateInputGroup = event.target.closest('.form-certificate').querySelector('.certificate-input-container');

		// 1개씩만 추가
		const newInput = document.createElement('input');
		newInput.type = 'text';
		newInput.name = 'certificate';
		newInput.classList.add('certificate-input');
		newInput.placeholder = '자격증을 입력하세요';
		newInput.value = '';

		// 삭제 버튼 생성
		const deleteButton = createDeleteButton(newInput);

		// 새로 생성된 input과 삭제 버튼을 함께 추가
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container');
		inputContainer.appendChild(newInput);
		inputContainer.appendChild(deleteButton);

		certificateInputGroup.appendChild(inputContainer);
	}
}

// 대외활동 항목 클릭 이벤트 처리
function handleActivitiesClick(event) {
	if (event.target && event.target.closest('.form-activities #add-activities')) {
		const activitiesInputGroup = event.target.closest('.form-activities').querySelector('.activities-input-container');

		// 1개씩만 추가
		const newInput = document.createElement('input');
		newInput.type = 'text';
		newInput.name = 'activities';
		newInput.classList.add('activities-input');
		newInput.placeholder = '활동 내용';
		newInput.value = '';

		// 삭제 버튼 생성
		const deleteButton = createDeleteButton(newInput);

		// 새로 생성된 input과 삭제 버튼을 함께 추가
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container');
		inputContainer.appendChild(newInput);
		inputContainer.appendChild(deleteButton);

		activitiesInputGroup.appendChild(inputContainer);
	}
}

// 삭제 버튼 생성 함수
function createDeleteButton(inputElement) {
	const deleteButton = document.createElement('button');
	deleteButton.textContent = '삭제';
	deleteButton.type = 'button';
	deleteButton.classList.add('delete-button');

	// 삭제 버튼 클릭 시 해당 input 필드를 삭제
	deleteButton.addEventListener('click', function() {
		inputElement.parentElement.remove(); // 해당 input과 삭제 버튼을 포함하는 div를 삭제
	});

	return deleteButton;
}


// 자동완성 핸들러
function autoCompleteHandler() {
	// 1. 일반 텍스트 입력 필드 자동 완성
	document.getElementById('resumeTitle').value = 'AI 이력서 초안 (개발 직무)';
	document.getElementById('name').value = '홍길동';
	document.getElementById('dob').value = '2000-01-01';
	document.getElementById('email').value = 'hong.gildong@example.com';
	document.getElementById('mobile-phone').value = '01012345678';

	// 2. 주소 필드 자동 완성
	document.getElementById('address').value = '대전광역시 유성구 대학로 99';
	document.getElementById('address-detail').value = '카이스트로 234';

	// 3. 성별 필드 자동 선택
	document.getElementById('gender').value = 'male';

	// 4. 사진 미리보기 자동 적용 (파일을 직접 로드하는 방식)
	const photoInput = document.getElementById('photo-upload');
	const photoPreview = document.getElementById('photo-preview');
	const uploadPlaceholder = document.querySelector('.upload-placeholder');

	// 서버에 있는 이미지의 경로를 직접 지정합니다.
	const imageUrl = '/images/main/charactor4.png'; // .jpg 파일 경로

	// 이미지를 가져와서 File 객체로 변환
	fetch(imageUrl)
		.then(response => response.blob())
		.then(blob => {
			// 파일명과 MIME 타입을 .jpg에 맞춰서 수정
			const file = new File([blob], 'charactor4.png', { type: 'image/png' });

			// File 객체를 photo-upload input에 할당
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			photoInput.files = dataTransfer.files;

			// 미리보기 업데이트
			const reader = new FileReader();
			reader.onload = function(e) {
				photoPreview.src = e.target.result;
				photoPreview.style.display = 'block';
				if (uploadPlaceholder) {
					uploadPlaceholder.classList.add('hidden');
				}
			};
			reader.readAsDataURL(file);
		})
		.catch(error => console.error('이미지 로드 중 오류 발생:', error));

	// 5. 추가 항목 (학력, 자격증, 대외활동) 자동 완성

	// 학력 항목 불러오기
	document.getElementById('load-education').click();
	setTimeout(() => { document.getElementById('add-education').click(); }, 100);

	// 자격증 항목 불러오기
	document.getElementById('load-certificate').click();
	setTimeout(() => { document.getElementById('add-certificate').click(); }, 100);

	// 대외활동 항목 불러오기
	document.getElementById('load-activities').click();
	setTimeout(() => { document.getElementById('add-activities').click(); }, 100);

	// 희망 직무 및 스킬 추가 버튼을 한 번씩 더 누르기
	setTimeout(() => {
		document.getElementById('add-job').click();
		document.getElementById('add-skill').click();
	}, 500);

	setTimeout(() => {
		// 학력 필드 채우기
		const educationLevels = document.querySelectorAll('.education-input-container select');
		const educationSchools = document.querySelectorAll('.education-input-container input[name="education"]');

		// 첫 번째 항목 (초기 렌더링된 항목)
		if (educationLevels[0]) educationLevels[0].value = '대학교';
		if (educationSchools[0]) educationSchools[0].value = '서울대학교';

		// 두 번째 항목 (자동완성으로 추가된 항목)
		if (educationLevels[1]) educationLevels[1].value = '고등학교';
		if (educationSchools[1]) educationSchools[1].value = '대덕고등학교';

		// 자격증 필드 채우기
		const certificateInputs = document.querySelectorAll('.form-certificate input[name="certificate"]');
		if (certificateInputs[0]) certificateInputs[0].value = '정보처리기사';
		if (certificateInputs[1]) certificateInputs[1].value = '정보보안기사';

		// 대외활동 필드 채우기
		const activitiesInputs = document.querySelectorAll('.form-activities input[name="activities"]');
		if (activitiesInputs[0]) activitiesInputs[0].value = 'AI 컨퍼런스 서포터즈 활동';
		if (activitiesInputs[1]) activitiesInputs[1].value = '캡스톤 디자인 프로젝트';

		// 희망 직무 및 스킬 내용 채우기 (기존 로직 유지)
		const desiredJobs = document.querySelectorAll('.desired-job');
		if (desiredJobs[0]) desiredJobs[0].value = '웹 개발자';
		if (desiredJobs[1]) desiredJobs[1].value = '백엔드 개발자';

		const skills = document.querySelectorAll('input[name="skills"]');
		if (skills[0]) skills[0].value = 'JavaScript, React, Spring Framework';
		if (skills[1]) skills[1].value = 'Java, Python';
	}, 500);
}