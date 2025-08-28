document.addEventListener("DOMContentLoaded", function() {
	document.querySelector('.file-uploader__input').addEventListener('change', function(e) {
		const fileName = e.target.files[0]?.name || '';
		const fileNameDisplay = document.querySelector('.file-uploader__filename b');
		const fileNameContainer = document.querySelector('.file-uploader__filename');

		if (fileName) {
			fileNameDisplay.textContent = fileName;
			fileNameContainer.classList.add('is-active');
		} else {
			fileNameContainer.classList.remove('is-active');
		}
	});

	document.querySelector("#submit-btn").addEventListener("click", async function() {
		const univNameInput = document.querySelector("#targetName");

		const univId = univNameInput.dataset.univId;
		const interviewPosition = document.querySelector("#application").value.trim();
		const interviewDate = document.querySelector("#interviewDate").value.trim();
		const interviewDetail = document.querySelector("#interviewContent").value.trim();
		const interviewRating = window.getInterviewRating();
		const files = document.querySelector("#file-input").files;

		if (!univId) {
			showConfirm2("대학을 선택해 주세요.","", 
   			   () => {
   			    }
   			);
			return;
		}
		
		if (!interviewDate) {
			showConfirm2("면접 일자를 입력해 주세요.", "",
			    () => {
			    }
			);
			return;
		}

		if (interviewRating === 0) {
			showConfirm2("대학 평가를 선택해 주세요.","", 
			    () => {
			    }
			);
			return;
		}

		if (!interviewDetail) {
			showConfirm2("면접 후기를 입력해 주세요.","", 
			    () => {
			    }
			);
			return;
		}

		if (files.length === 0) {
			showConfirm2("증빙자료를 첨부해 주세요.","", 
			    () => {
			    }
			);
			return;	
		}

		if (files.length > 1) {
			showConfirm2("증빙자료는 1장만 첨부해 주세요.","", 
			    () => {
			    }
			);
			return;
		}

		// FormData 생성
		const formData = new FormData();
		formData.append('irType', 'G02001');
		formData.append('targetId', univId);
		formData.append('irContent', interviewDetail);
		formData.append('irRating', interviewRating);
		formData.append('irApplication', interviewPosition);
		formData.append('irInterviewAt', new Date(interviewDate));
		formData.append('file', files[0]);

		try {
			const response = await fetch("/ertds/univ/uvivfb/insertInterViewFeedback.do", {
				method: "POST",
				body: formData
			});

			if (response.ok) {
				const result = await response.json();

				if (result.success) {
					showConfirm2("후기 등록 요청이 완료되었습니다","", 
					    () => {
							window.location.href = "/ertds/univ/uvivfb/selectInterviewList.do";
					    }
					);
				} else {
					showConfirm2("등록에 실패했습니다.","", 
		   			   () => {
		   			    }
		   			);
				}
			} else {
				throw new Error(`서버 응답 오류: ${response.status}`);
			}
		} catch (error) {
			console.error("등록 중 오류:", error);
			showConfirm2("등록에 실패했습니다.","", 
   			   () => {
   			    }
   			);
		}
	});

	document.querySelector("#back-btn").addEventListener("click", function() {
		window.location.href = "/ertds/univ/uvivfb/selectInterviewList.do";
	});
});

// 별점 평가 기능
document.addEventListener('DOMContentLoaded', function() {
	const starRating = document.getElementById('rating');
	const ratingText = starRating.querySelector('.rating-input__text');
	const stars = starRating.querySelectorAll('.rating-input__star');

	// 별점 설명 텍스트
	const ratingTexts = {
		0: '평가해주세요',
		1: '매우 불만족',
		2: '불만족',
		3: '보통',
		4: '만족',
		5: '매우 만족'
	};

	let currentRating = 0;

	// 별 클릭 이벤트
	stars.forEach((star) => {
		star.addEventListener('click', function() {
			const rating = parseInt(this.dataset.value);
			setRating(rating);
		});
		star.addEventListener('mouseenter', function() {
			const rating = parseInt(this.dataset.value);
			highlightStars(rating, true);
			updateRatingText(rating, true);
		});
	});

	// 별점 컨테이너에서 마우스가 나갔을 때
	starRating.addEventListener('mouseleave', function() {
		highlightStars(currentRating, false);
		updateRatingText(currentRating, false);
	});

	// 별점 설정 함수
	function setRating(rating) {
		currentRating = rating;
		starRating.dataset.rating = rating;
		highlightStars(rating, false);
		updateRatingText(rating, false);
	}

	// 별 하이라이트 함수
	function highlightStars(rating, isHover) {
		stars.forEach((star, index) => {
			star.classList.remove('is-active', 'is-hover');

			if (index < rating) {
				if (isHover) {
					star.classList.add('is-hover');
				} else {
					star.classList.add('is-active');
				}
			}
		});
	}

	// 평가 텍스트 업데이트 함수
	function updateRatingText(rating, isHover) {
		ratingText.textContent = ratingTexts[rating];

		if (rating > 0) {
			ratingText.classList.add('is-selected');
		} else {
			ratingText.classList.remove('is-selected');
		}
	}

	// 별점 값을 가져오는 함수 (폼 제출 시 사용)
	window.getInterviewRating = function() {
		return currentRating;
	};
});

// textarea 글자수 카운터 기능
document.addEventListener('DOMContentLoaded', function() {
	const textarea = document.getElementById('interviewContent');
	const maxLength = 300; // 최대 글자수 설정

	// 글자수 카운터 HTML 생성
	const counterHTML = `
        <div class="char-counter">
            <span class="char-counter__current">0</span><span class="unit">자</span>
            <span class="separator">/</span>
            <span>최대&nbsp;</span><span class="max-count">${maxLength}</span><span class="unit">자</span>
        </div>
    `;

	// textarea 부모 요소에 textarea-container 클래스 추가
	const parentDiv = textarea.closest('.input-group--textarea');
	if (parentDiv) {
		parentDiv.insertAdjacentHTML('beforeend', counterHTML);
	}

	// 글자수 카운터 요소들 선택
	const counter = parentDiv.querySelector('.char-counter');
	const currentCount = counter.querySelector('.char-counter__current');

	// 글자수 업데이트 함수
	function updateCounter() {
		const currentLength = textarea.value.length;
		currentCount.textContent = currentLength;
	}

	// 이벤트 리스너 등록
	textarea.addEventListener('input', updateCounter);
	textarea.addEventListener('paste', () => setTimeout(updateCounter, 10));

	// 초기 글자수 설정
	updateCounter();
});

// 기업 검색 모달 관련 JavaScript
document.addEventListener('DOMContentLoaded', function() {
	const url = "/ertds/univ/uvivfb/selectUniversityList.do";

	const modal            = document.querySelector('#searchModal');
	const searchBtn        = document.querySelector('#open-search-modal');
	const closeBtn         = modal.querySelector('.search-modal__close-button');
	const cancelBtn        = modal.querySelector('#modalCancelBtn');
	const confirmBtn       = modal.querySelector('#modalConfirmBtn');
	const searchInput      = modal.querySelector('#searchInput');
	const searchButton     = modal.querySelector('#searchBtn');
	const universityList   = modal.querySelector('#searchResultList');
	const prevPageBtn      = modal.querySelector('#prevPage');
	const nextPageBtn      = modal.querySelector('#nextPage');
	const pageInfo         = modal.querySelector('#pageInfo');
	const universityNameInput = document.querySelector('#targetName');

	let currentPage = 1;
	let totalPages = 1;
	let selectedUniversity = null;
	let allUniversities = []; // 전체 대학 데이터 (한번만 로드)
	let filteredUniversities = []; // 필터링된 대학 데이터
	let searchTimeout;
	const itemsPerPage = 5;

	// 한글 검색 유틸리티 클래스
	class HangulSearchUtil {
		// 한글 자음/초성 검색 매칭
		static matches(text, query) {
			if (!text || typeof text !== 'string') {
			    return false;
			}
			
			const searchTerm = query.toLowerCase().trim();
			if (!searchTerm) return true;

			// 1. 일반 텍스트 매칭
			if (text.toLowerCase().includes(searchTerm)) {
				return true;
			}

			// Hangul.js가 로드되지 않았으면 일반 검색만 수행
			if (typeof Hangul === 'undefined') {
				return false;
			}

			try {
				// 2. 자음만 입력한 경우 (예: "ㅅㅇ", "ㅎㅇ")
				const consonantOnlyPattern = /^[ㄱ-ㅎ]+$/;
				if (consonantOnlyPattern.test(searchTerm)) {
					// 초성 검색
					const initials = this.getInitials(text);
					if (initials.includes(searchTerm)) {
						return true;
					}

					// 모든 자음 검색
					const allConsonants = this.getAllConsonants(text);
					if (allConsonants.includes(searchTerm)) {
						return true;
					}
				}

				// 3. 부분 조합 검색 (예: "서울", "서ㅇ", "한ㅇ")
				return this.matchesPartial(text, searchTerm);

			} catch (error) {
				console.error('Hangul 검색 오류:', error);
				return false;
			}
		}

		// 초성 추출
		static getInitials(text) {
			try {
				const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
				let initials = '';

				for (let i = 0; i < text.length; i++) {
					const char = text[i];
					const code = char.charCodeAt(0);

					// 한글 완성형 범위
					if (code >= 0xAC00 && code <= 0xD7A3) {
						const syllableIndex = code - 0xAC00;
						const choIndex = Math.floor(syllableIndex / (21 * 28));
						initials += CHO[choIndex];
					}
					// 한글 자음
					else if (code >= 0x3131 && code <= 0x314E) {
						initials += char;
					}
				}

				return initials;
			} catch (error) {
				return '';
			}
		}

		// 모든 자음 추출
		static getAllConsonants(text) {
			try {
				return Hangul.disassemble(text)
					.filter(char => /[ㄱ-ㅎ]/.test(char))
					.join('');
			} catch (error) {
				return '';
			}
		}

		// 부분 조합 매칭
		static matchesPartial(text, query) {
			try {
				const queryDisassembled = Hangul.disassemble(query);
				const textDisassembled = Hangul.disassemble(text);

				const queryStr = queryDisassembled.join('');
				const textStr = textDisassembled.join('');

				return textStr.includes(queryStr);
			} catch (error) {
				return false;
			}
		}
	}

	universityNameInput.addEventListener('click', async function() {
		modal.classList.add('is-active');
		searchInput.focus();

		if (allUniversities.length === 0) {
			await loadAllUniversities();
		}

		filterAndRenderUniversities('');
	})
	
	// 모달 열기
	searchBtn.addEventListener('click', async function() {
		modal.classList.add('is-active');
		searchInput.focus();

		if (allUniversities.length === 0) {
			await loadAllUniversities();
		}

		filterAndRenderUniversities('');
	});

	// 모달 닫기
	function closeModal() {
		modal.classList.remove('is-active');
		resetModal();
	}

	closeBtn.addEventListener('click', closeModal);
	cancelBtn.addEventListener('click', closeModal);

	// 모달 초기화
	function resetModal() {
		searchInput.value = '';
		selectedUniversity = null;
		confirmBtn.disabled = true;
		currentPage = 1;
	}

	// 기업 검색
	const loadAllUniversities = async () => {
		try {
			const response = await fetch(url + "?univName=", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			});

			if (!response.ok) {
				throw new Error(`서버 응답 오류: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && Array.isArray(result.universityList)) {
				allUniversities = result.universityList;
			} else {
				console.error("API 응답에 문제가 있습니다.", result.message);
				allUniversities = [];
			}
		} catch (error) {
			console.error("대학 정보를 불러오는 중 에러가 발생하였습니다.", error.message);
			universityList.innerHTML = '<li class="error-message">대학 정보를 불러오는데 실패했습니다.</li>';
			allUniversities = [];
		}
	};

	// 기업 목록 로드
	function filterAndRenderUniversities(keyword) {
	    if (!keyword.trim()) {
	        filteredUniversities = [...allUniversities];
	    } else {
	        filteredUniversities = allUniversities.filter(university => {
	            const univName = university.univName || '';
	            return HangulSearchUtil.matches(univName, keyword);
	        });
	    }

	    totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
	    if (totalPages === 0) totalPages = 1;

	    currentPage = 1;
	    renderUniversities();
	    updatePagination();
	}

	// 선택된 대학을 입력 필드에 설정하고 모달 닫기
	function selectUniversityAndClose(university) {
		universityNameInput.value = university.univName;
		universityNameInput.dataset.univId = university.univId;
		closeModal();
	}

	// 기업 목록 렌더링
	function renderUniversities() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const pageUniversities = filteredUniversities.slice(startIndex, endIndex);

		if (pageUniversities.length === 0) {
			const message = allUniversities.length === 0 ?
				'대학 정보를 불러오는 중입니다...' :
				'검색 결과가 없습니다.';
			universityList.innerHTML = `<li class="empty-message">${message}</li>`;
			return;
		}

		universityList.innerHTML = pageUniversities.map(university => `
			<li class="search-modal__list-item" data-univ-id="${university.univId}" data-univ-name="${university.univName}">
				<div class="search-modal__list-item-name">${university.univName}</div>
				<div class="search-modal__list-item-info">${university.univCampus} · ${university.univRegion}</div>
			</li>
		`).join('');

		// 대학 선택 이벤트 추가
		document.querySelectorAll('.search-modal__list-item').forEach(item => {
			// 단일 클릭 이벤트
			item.addEventListener('click', function() {
				document.querySelectorAll('.search-modal__list-item').forEach(i => i.classList.remove('is-selected'));
				this.classList.add('is-selected');

				selectedUniversity = {
					univId: this.dataset.univId,
					univName: this.dataset.univName
				};
				confirmBtn.disabled = false;
			});

			// 더블클릭 이벤트 (즉시 선택)
			item.addEventListener('dblclick', function() {
				const university = {
					univId: this.dataset.univId,
					univName: this.dataset.univName
				};
				selectUniversityAndClose(university);
			});
		});
	}

	// 페이징 업데이트
	function updatePagination() {
		pageInfo.textContent = `${currentPage} / ${totalPages}`;
		prevPageBtn.disabled = currentPage === 1;
		nextPageBtn.disabled = currentPage === totalPages || filteredUniversities.length === 0;
	}
	
	function debounceFilter(keyword) {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			filterAndRenderUniversities(keyword);
		}, 150);
	}

	// 검색 이벤트
	searchButton.addEventListener('click', function() {
		clearTimeout(searchTimeout);
		filterAndRenderUniversities(searchInput.value.trim());
	});

	// 실시간 검색
	searchInput.addEventListener('input', function(e) {
		debounceFilter(e.target.value);
	});
	
	// 한글 조합 완료시 즉시 검색
	searchInput.addEventListener('compositionend', function(e) {
		clearTimeout(searchTimeout);
		filterAndRenderUniversities(e.target.value);
	});

	searchInput.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			clearTimeout(searchTimeout);
			filterAndRenderUniversities(searchInput.value.trim());
		}
	});

	// 페이징 이벤트
	prevPageBtn.addEventListener('click', function() {
		if (currentPage > 1) {
			currentPage--;
			renderUniversities();
			updatePagination();
		}
	});

	nextPageBtn.addEventListener('click', function() {
		if (currentPage < totalPages) {
			currentPage++;
			renderUniversities();
			updatePagination();
		}
	});

	// 확인 버튼
	confirmBtn.addEventListener('click', function() {
		if (selectedUniversity) {
			selectUniversityAndClose(selectedUniversity);
		}
	});

	// 모달 외부 클릭시 닫기
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			closeModal();
		}
	});
});

document.addEventListener('DOMContentLoaded', function() {
	//자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}
})
// 자동완성 핸들러
function autoCompleteHandler() {
	// 1. '입학지원 대학 검색' 버튼 클릭 
	document.getElementById('open-search-modal').click();

	// 2. 모달이 열리는 것을 기다린 후, 대학을 선택
	setTimeout(function() {
		//모달에서 국립한밭대학교
		const univListItems = document.querySelectorAll('.search-modal__list-item');
		let selectedItem = null;

		// 목록에 항목이 있는지 확인
		if (univListItems.length > 0) {
			// 첫 번째 항목을 선택
			selectedItem = univListItems[0];
			selectedItem.click();
		}

		if (selectedItem) {
			// '선택' 버튼을 클릭하여 메인 폼에 데이터 적용
			document.getElementById('modalConfirmBtn').click();
		} else {
			showConfirm2("자동완성할 대학을 찾지 못했습니다.", "목록을 다시 확인해주세요.", 
			    () => {
			    }
			);
			return;					
		}

		setTimeout(async function() {
			//학과 채우기
			document.getElementById('application').value = '컴퓨터공학과';

			//면접일자 채우기
			document.getElementById('interviewDate').value = '2025-08-04';

			// 별점 자동 선택 (5점 만점)
			const ratingStars = document.querySelectorAll('.rating-input__star');
			if (ratingStars.length > 4) {
				ratingStars[4].click();
			}

			// 면접 후기 내용 자동 완성
			const reviewContent = `면접관님께서 편안한 분위기를 만들어주셔서 긴장하지 않고 답변할 수 있었습니다. \n특히 전공 관련 질문에 대해 심도 있는 대화를 나누며 제 지식을 어필할 수 있었고, \n대학의 교육 목표와 비전에 대해 자세히 들을 수 있어 매우 유익했습니다. \n면접 이후에도 좋은 인상을 받았습니다.`;
			document.getElementById('interviewContent').value = reviewContent;

			// 파일 첨부
			const fileInput = document.getElementById('file-input');
			const fileNameDisplay = document.querySelector('.file-uploader__filename b');
			const fileNameContainer = document.querySelector('.file-uploader__filename');
			//서버에 있는 더미 파일
			const fileUrl = '/images/main/charactor4.png';

			try {
				// 파일을 가져와서 Blob으로 변환
				const response = await fetch(fileUrl);
				const blob = await response.blob();

				//Blob으로 File 객체 생성
				const file = new File([blob], 'charactor4.png', { type: 'image/png' });

				// DataTransfer 객체를 사용하여 input[type="file"]에 파일 할당
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				fileInput.files = dataTransfer.files;

				// 파일 이름 미리보기 UI 업데이트
				fileNameDisplay.textContent = file.name;
				fileNameContainer.style.display = 'block';
			} catch (error) {
				console.error('파일 첨부 자동완성 실패:', error);
				showConfirm2("파일 첨부 중 오류가 발생했습니다.","", 
	   			   () => {
	   			    }
	   			);
			}
		}, 500); // 모달 열림 지연 시간
	}, 500); // 모달 열림 지연 시간
}