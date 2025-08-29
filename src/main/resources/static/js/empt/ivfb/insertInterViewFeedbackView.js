document.addEventListener("DOMContentLoaded", function() {
	document.querySelector('#file-input').addEventListener('change', function(e) {
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
		const cpNameInput = document.querySelector("#company-name");

		const cpId = cpNameInput.dataset.cpId;
		const interviewPosition = document.querySelector("#interview-position").value.trim();
		const interviewDate = document.querySelector("#interview-date").value.trim();
		const interviewDetail = document.querySelector("#interview-detail").value.trim();
		const interviewRating = window.getInterviewRating();
		const files = document.querySelector("#file-input").files;

		if (!cpId) {
			showConfirm2("기업명을 선택해 주세요.","",
				() => {
				}
			);
		    return;
		}
		
		if (!interviewDate) {
			showConfirm2("면접 일자를 입력해 주세요.","", 
			    () => {
			    }
			);
			return;
		}

		if (interviewRating === 0) {
			showConfirm2("기업 평가를 선택해 주세요.","", 
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
			return ;
		}

		if (files.length === 0) {
			showConfirm2("증빙자료를 첨부해 주세요.", "",
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
		formData.append('irType', 'G02002')
		formData.append('targetId', cpId);
		formData.append('irContent', interviewDetail);
		formData.append('irRating', interviewRating);
		formData.append('irApplication', interviewPosition);
		formData.append('irInterviewAt', new Date(interviewDate));

		// 파일 추가
		formData.append('file', files[0]);

		try {
			const response = await fetch("/empt/ivfb/insertInterViewFeedback.do", {
				method: "POST",
				body: formData
			});

			if (response.ok) {
				const result = await response.json();

				if (result.success) {
					showConfirm2("후기 등록 요청이 완료되었습니다", "",
					    () => {
							window.location.href = "/empt/ivfb/interViewFeedback.do";
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
		window.location.href = "/empt/ivfb/interViewFeedback.do";
	});
});

// 별점 평가 기능
document.addEventListener('DOMContentLoaded', function() {
	const starRating = document.getElementById('company-rating');
	const ratingText = document.getElementById('rating-text');
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
	const textarea = document.getElementById('interview-detail');
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
	updateCounter();
});

// 기업 검색 모달 관련 JavaScript
document.addEventListener('DOMContentLoaded', function() {
	const url = "/empt/ivfb/selectCompanyList.do";

	const modal = document.querySelector('#search-modal');
	const searchBtn = document.querySelector('#company-search');
	const closeBtn = modal.querySelector('.search-modal__close-button');
	const cancelBtn = modal.querySelector('#modal-cancel-btn');
	const confirmBtn = modal.querySelector('#modal-confirm-btn');
	const searchInput = modal.querySelector('#company-search-input');
	const searchButton = modal.querySelector('#search-btn');
	const companyList = modal.querySelector('#company-list');
	const prevPageBtn = modal.querySelector('#prev-page');
	const nextPageBtn = modal.querySelector('#next-page');
	const pageInfo = modal.querySelector('#page-info');
	const companyNameInput = document.querySelector('#company-name');

	let currentPage = 1;
	let totalPages = 1;
	let selectedCompany = null;
	let allCompanies = []; // 전체 기업 데이터
	let filteredCompanies = []; // 필터링된 기업 데이터
	let searchTimeout;
	const itemsPerPage = 5;

	// Hangul.js 사용 한글 검색 유틸리티
	class HangulSearchUtil {
		// 한글 자음/초성 검색 매칭
		static matches(text, query) {
			const searchTerm = query.toLowerCase().trim();
			if (!searchTerm) return true;

			// 1. 일반 텍스트 매칭
			if (text.toLowerCase().includes(searchTerm)) {
				return true;
			}

			// Hangul.js가 로드되지 않았으면 일반 검색만 수행
			if (typeof Hangul === 'undefined') {
				console.warn('Hangul.js가 로드되지 않았습니다.');
				return false;
			}

			try {
				// 2. 자음만 입력한 경우 (예: "ㅅㅅ", "ㅎㄷ", "ㅂㅈㅅㅁㅋ")
				const consonantOnlyPattern = /^[ㄱ-ㅎ]+$/;
				if (consonantOnlyPattern.test(searchTerm)) {
					// 초성 검색 (정확한 매칭)
					const initials = this.getInitials(text);
					if (initials.startsWith(searchTerm) || initials.includes(searchTerm)) {
						return true;
					}

					// 모든 자음 검색 (중성, 종성 포함)
					const allConsonants = this.getAllConsonants(text);
					if (allConsonants.includes(searchTerm)) {
						return true;
					}
				}

				// 3. 부분 조합 검색 (예: "삼", "삼ㅅ", "현ㄷ")
				return this.matchesPartial(text, searchTerm);

			} catch (error) {
				console.error('Hangul 검색 오류:', error);
				return false;
			}
		}

		// 초성만 추출 (수정된 버전)
		static getInitials(text) {
			try {
				const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
				let initials = '';
				
				for (let i = 0; i < text.length; i++) {
					const char = text[i];
					const code = char.charCodeAt(0);
					
					// 한글 완성형 범위 (가-힣)
					if (code >= 0xAC00 && code <= 0xD7A3) {
						const syllableIndex = code - 0xAC00;
						const choIndex = Math.floor(syllableIndex / (21 * 28));
						initials += CHO[choIndex];
					}
					// 한글 자음 (ㄱ-ㅎ)
					else if (code >= 0x3131 && code <= 0x314E) {
						initials += char;
					}
				}
				
				return initials;
			} catch (error) {
				console.error('초성 추출 오류:', error);
				return '';
			}
		}

		// 모든 자음 추출 (Hangul.js 사용)
		static getAllConsonants(text) {
			try {
				return Hangul.disassemble(text)
					.filter(char => /[ㄱ-ㅎ]/.test(char))
					.join('');
			} catch (error) {
				console.error('자음 추출 오류:', error);
				return '';
			}
		}

		// 부분 조합 매칭 (예: "삼ㅅ"으로 "삼성" 찾기)
		static matchesPartial(text, query) {
			try {
				// 검색어를 분해
				const queryDisassembled = Hangul.disassemble(query);
				const textDisassembled = Hangul.disassemble(text);

				// 부분 일치 검사
				const queryStr = queryDisassembled.join('');
				const textStr = textDisassembled.join('');

				return textStr.includes(queryStr);
			} catch (error) {
				console.error('부분 매칭 오류:', error);
				return false;
			}
		}
	}
	
	companyNameInput.addEventListener('click', async function() {
		modal.classList.add('is-active');
		searchInput.focus();

		if (allCompanies.length === 0) {
			await loadAllCompanies();
		}

		filterAndRenderCompanies('');
	});

	// 모달 열기
	searchBtn.addEventListener('click', async function() {
		modal.classList.add('is-active');
		searchInput.focus();

		if (allCompanies.length === 0) {
			await loadAllCompanies();
		}

		filterAndRenderCompanies('');
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
		selectedCompany = null;
		confirmBtn.disabled = true;
		currentPage = 1;
	}

	// 기업 검색
	const loadAllCompanies = async () => {
		try {
			const response = await fetch(url + "?cpName=", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			});

			if (!response.ok) {
				throw new Error(`서버 응답 오류: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && Array.isArray(result.companyList)) {
				allCompanies = result.companyList;
				
				if (typeof Hangul !== 'undefined') {
				} else {
					console.warn('Hangul.js 미로드 - 일반 검색만 가능');
				}
			} else {
				console.error("API 응답에 문제가 있습니다.", result.message);
				allCompanies = [];
			}
		} catch (error) {
			console.error("기업 정보를 불러오는 중 에러가 발생하였습니다.", error.message);
			companyList.innerHTML = '<li class="error-message">기업 정보를 불러오는데 실패했습니다.</li>';
			allCompanies = [];
		}
	};

	// 4. 클라이언트 사이드 필터링 함수 추가
	function filterAndRenderCompanies(keyword) {
		if (!keyword.trim()) {
			filteredCompanies = [...allCompanies];
		} else {
			filteredCompanies = allCompanies.filter(company =>
				HangulSearchUtil.matches(company.cpName, keyword) ||
				HangulSearchUtil.matches(company.cpScale, keyword) ||
				HangulSearchUtil.matches(company.cpRegion, keyword)
			);
		}

		// 페이징 계산
		totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
		if (totalPages === 0) totalPages = 1;

		// 검색 결과가 변경되면 첫 페이지로 이동
		currentPage = 1;

		renderCompanies();
		updatePagination();
	}

	// 선택된 기업을 입력 필드에 설정하고 모달 닫기
	function selectCompanyAndClose(company) {
		companyNameInput.value = company.cpName;
		companyNameInput.dataset.cpId = company.cpId;
		closeModal();
	}

	// 기업 목록 렌더링
	function renderCompanies() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const pageCompanies = filteredCompanies.slice(startIndex, endIndex);
		const query = searchInput.value;

		if (pageCompanies.length === 0) {
			const message = allCompanies.length === 0 ? '기업 정보를 불러오는 중입니다...' : '검색 결과가 없습니다.';
			companyList.innerHTML = `<li class="empty-message">${message}</li>`;
			return;
		}

		companyList.innerHTML = pageCompanies.map(company => `
		    <li class="search-modal__list-item" data-company-id="${company.cpId}" data-company-name="${company.cpName}">
		        <div class="search-modal__list-item-name">${company.cpName}</div>
		        <div class="search-modal__list-item-info">${company.cpScale} · ${company.cpRegion}</div>
		    </li>
		`).join('');

		// 기업 선택 이벤트 추가
		document.querySelectorAll('.search-modal__list-item').forEach(item => {
			// 단일 클릭 이벤트
			item.addEventListener('click', function() {
				document.querySelectorAll('.search-modal__list-item').forEach(i => i.classList.remove('is-selected'));
				this.classList.add('is-selected');

				selectedCompany = {
					cpId: this.dataset.companyId,
					cpName: this.dataset.companyName
				};
				confirmBtn.disabled = false;
			});

			// 더블클릭 이벤트 (즉시 선택)
			item.addEventListener('dblclick', function() {
				const company = {
					cpId: this.dataset.companyId,
					cpName: this.dataset.companyName
				};
				selectCompanyAndClose(company);
			});
		});
	}

	// 페이징 업데이트
	function updatePagination() {
		pageInfo.textContent = `${currentPage} / ${totalPages}`;
		prevPageBtn.disabled = currentPage === 1;
		nextPageBtn.disabled = currentPage === totalPages || filteredCompanies.length === 0;
	}

	// 실시간 검색 기능을 위한 디바운스 타이머
	function debounceFilter(keyword) {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			filterAndRenderCompanies(keyword);
		}, 150); // 더 빠른 반응을 위해 200ms로 단축
	}

	// 검색 이벤트
	searchButton.addEventListener('click', function() {
		clearTimeout(searchTimeout);
		filterAndRenderCompanies(searchInput.value.trim());
	});

	// 실시간 검색 - input 이벤트로 변경
	searchInput.addEventListener('input', function(e) {
		debounceFilter(e.target.value);
	});
	
	searchInput.addEventListener('compositionend', function(e) {
		clearTimeout(searchTimeout);
		filterAndRenderCompanies(e.target.value);
	});
	
	searchInput.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			clearTimeout(searchTimeout);
			filterAndRenderCompanies(searchInput.value.trim());
		}
	});

	// 페이징 이벤트
	prevPageBtn.addEventListener('click', function() {
		if (currentPage > 1) {
			currentPage--;
			renderCompanies();
			updatePagination();
		}
	});

	nextPageBtn.addEventListener('click', function() {
		if (currentPage < totalPages) {
			currentPage++;
			renderCompanies();
			updatePagination();
		}
	});

	// 확인 버튼
	confirmBtn.addEventListener('click', function() {
		if (selectedCompany) {
			selectCompanyAndClose(selectedCompany);
		}
	});

	// 모달 외부 클릭시 닫기
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			closeModal();
		}
	});
});