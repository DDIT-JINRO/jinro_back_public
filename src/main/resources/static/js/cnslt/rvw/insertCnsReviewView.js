document.addEventListener("DOMContentLoaded", function() {
	document.querySelector("#submit-btn").addEventListener("click", async function() {
	    const crId = document.querySelector("#counsel-name").dataset.crId;
	    const crRate = window.getCounselReviewRating();
	    const crContent = document.querySelector("#cr-content").value.trim();
		const crPublic = document.querySelector("input[name='cr-public']:checked").value.trim();

		if (!crId) {
			showConfirm2("과거상담내역을 선택해 주세요.","",
				() => {
					return;
				}
			);
		}

		if (crRate === 0) {
			showConfirm2("상담 평가를 선택해 주세요.","",
				() => {
					return;
				}
			);
		}

	    if (!crContent) {
			showConfirm2("상담 후기를 입력해 주세요.","",
				() => {
					return;
				}
			);
	    }

	    // FormData 생성
	    const formData = new FormData();
		formData.append('crId', crId)
	    formData.append('crRate', crRate);
	    formData.append('crContent', crContent);
		formData.append('crPublic', crPublic);

	    try {
	        const response = await fetch("/cnslt/rvw/insertCnsReview.do", {
	            method: "POST",
	            body: formData
	        });

	        if (response.ok) {
	            const result = await response.json();

	            if (result.success) {
					showConfirm2("후기 등록이 완료되었습니다","",
						() => {
							window.location.href = "/cnslt/rvw/cnsReview.do";
						}
					);
	            } else {
					showConfirm2("등록에 실패했습니다.","",
							() => {
						    return;
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
				    return;
				}
			);
	    }
	});

	document.querySelector("#back-btn").addEventListener("click", function() {
		window.location.href = "/cnslt/rvw/cnsReview.do";
	});
});

// 별점 평가 기능
document.addEventListener('DOMContentLoaded', function() {

	const starRating = document.getElementById('counsel-rating');
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
			setRating(parseInt(this.dataset.value));
		});
		star.addEventListener('mouseenter', function() {
			highlightStars(parseInt(this.dataset.value), true);
			updateRatingText(parseInt(this.dataset.value));
		});
	});

	// 별점 컨테이너에서 마우스가 나갔을 때
	starRating.addEventListener('mouseleave', function() {
		highlightStars(currentRating, false);
		updateRatingText(currentRating);
	});

	// 별점 설정 함수
	function setRating(rating) {
		currentRating = rating;
		starRating.dataset.rating = rating;
		highlightStars(rating, false);
		updateRatingText(rating);
	}

	// 별 하이라이트 함수
	function highlightStars(rating, isHover) {
		stars.forEach((star, index) => {
			star.classList.remove('is-active', 'is-hover');
			if (index < rating) {
				star.classList.add(isHover ? 'is-hover' : 'is-active');
			}
		});
	}

	// 평가 텍스트 업데이트 함수
	function updateRatingText(rating) {
		ratingText.textContent = ratingTexts[rating];
		ratingText.classList.toggle('is-selected', rating > 0);
	}

	// 별점 컨테이너에서 마우스가 나갔을 때
	starRating.addEventListener('mouseleave', function() {
		highlightStars(currentRating, false);
		updateRatingText(currentRating);
	});

	// 별점 설정 함수
	function setRating(rating) {
		currentRating = rating;
		starRating.dataset.rating = rating;
		highlightStars(rating, false);
		updateRatingText(rating);
	}

	// 별 하이라이트 함수
	function highlightStars(rating, isHover) {
		stars.forEach((star, index) => {
			star.classList.remove('is-active', 'is-hover');
			if (index < rating) {
				star.classList.add(isHover ? 'is-hover' : 'is-active');
			}
		});
	}
	// 별점 값을 가져오는 함수 (폼 제출 시 사용)
	window.getCounselReviewRating = function() {
		return currentRating;
	};
});

// textarea 글자수 카운터 기능
document.addEventListener('DOMContentLoaded', function() {
	const textarea = document.getElementById('cr-content');
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
		const currentCount = parentDiv.querySelector('.char-counter__current');

	    // 글자수 업데이트 함수
		const updateCounter = () => {
			currentCount.textContent = textarea.value.length;
		};
	
		textarea.addEventListener('input', updateCounter);
		updateCounter();
	}

	// 이벤트 리스너 등록
	textarea.addEventListener('paste', function() {
		// paste 이벤트는 약간의 지연 후 실행
		setTimeout(updateCounter, 10);
	});
});

// 상담 내역 검색 모달 관련 JavaScript
document.addEventListener('DOMContentLoaded', function() {
	const url = "/cnslt/rvw/selectCounselingHistory.do";

	const modal = document.querySelector('#search-modal');
	const closeBtn = document.querySelector('.search-modal__close-button');
	const cancelBtn = document.querySelector('#modal-cancel-btn');
	const confirmBtn = document.querySelector('#modal-confirm-btn');
	const searchInput = document.querySelector('#modal-search-input');
	const searchButton = document.querySelector('#counsel-history-search');
	const counselList = document.querySelector('#modal-list');
	const prevPageBtn = document.querySelector('#prev-page');
	const nextPageBtn = document.querySelector('#next-page');
	const pageInfo = document.querySelector('#page-info');
	const counselNameInput = document.querySelector('#counsel-name');
	const counselCategoryInput = document.querySelector('#counsel-category');
	const counselMethodInput = document.querySelector('#counsel-method');
	const counselReqDatetimeInput = document.querySelector('#counsel-req-datetime');

	let currentPage = 1;
	let totalPages = 1;
	let selectedCounsel = null;
	let counselings = []; // 전체 상담 데이터
	const itemsPerPage = 5;

	// 모달 열기
	searchButton.addEventListener('click', function() {
		modal.classList.add('is-active');
		searchInput.focus();
		loadCounselings('');
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
		selectedCounsel = null;
		confirmBtn.disabled = true;
		currentPage = 1;
	}

	// 상담사 검색
	const searchCounselings = async (keyword) => {
		try {
			const response = await fetch(url + "?crName=" + keyword, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				}
			});

			if (!response.ok) {
				throw new Error(`서버 응답 오류: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && Array.isArray(result.counselingList)) {
				return result.counselingList;
			} else {
				console.error("API 응답에 문제가 있습니다.", result.message);

				showConfirm2(data.message,"",
					() => {
						closeModal();
						return;
					}
				);
				
			}
		} catch (error) {
			console.error("기업 정보를 불러오는 중 에러가 발생하였습니다.", error.message);
			closeModal();
			return [];
		}
	}

	// 상담 목록 로드
	const loadCounselings = async (keyword) => {
		// 로딩 표시
		counselList.innerHTML = '<li class="loading-message">검색 중...</li>';

		counselings = await searchCounselings(keyword);

		totalPages = Math.ceil(counselings.length / itemsPerPage);
		if (totalPages === 0) totalPages = 1;

		currentPage = 1;
		renderCounselings();
		updatePagination();
	}

	// 상담 목록 렌더링
	function renderCounselings() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const pageCounselings = counselings.slice(startIndex, endIndex);

		if (pageCounselings.length === 0) {
			counselList.innerHTML = '<li class="empty-message">검색 결과가 없습니다.</li>';
			return;
		}

		counselList.innerHTML = pageCounselings.map(counsel => `
            <li class="search-modal__list-item"
				data-counsel-id="${counsel.counselId}"
				data-counsel-name="${counsel.counselName}"
				data-counsel-category="${counsel.counselCategory}"
				data-counsel-method="${counsel.counselMethod}"
				data-counsel-req-datetime="${counsel.counselReqDatetime}"
				>
                <div class="search-modal__list-item-name">${counsel.counselName}</div>
                <div class="search-modal__list-item-info">${counsel.counselCategory} · ${counsel.counselMethod} · 상담시간 : ${counsel.counselReqDatetime}</div>
            </li>
        `).join('');

		// 상담 선택 이벤트 추가
		document.querySelectorAll('.search-modal__list-item').forEach(item => {
			item.addEventListener('click', function() {
				// 이전 선택 제거
				document.querySelectorAll('.search-modal__list-item').forEach(i => i.classList.remove('is-selected'));

				// 현재 항목 선택
				this.classList.add('is-selected');
				selectedCounsel = {
					counselId: this.dataset.counselId,
					counselName: this.dataset.counselName,
					counselCategory: this.dataset.counselCategory,
					counselMethod: this.dataset.counselMethod,
					counselReqDatetime: this.dataset.counselReqDatetime
				};

				confirmBtn.disabled = false;
			});
		});
	}

	// 페이징 업데이트
	function updatePagination() {
		pageInfo.textContent = `${currentPage} / ${totalPages}`;
		prevPageBtn.disabled = currentPage === 1;
		nextPageBtn.disabled = currentPage === totalPages || counselings.length === 0;
	}

	// 검색 이벤트
	searchButton.addEventListener('click', function() {
		loadCounselings(searchInput.value.trim());
	});

	searchInput.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') {
			loadCounselings(searchInput.value.trim());
		}
	});

	// 페이징 이벤트
	prevPageBtn.addEventListener('click', function() {
		if (currentPage > 1) {
			currentPage--;
			renderCounselings();
			updatePagination();
		}
	});

	nextPageBtn.addEventListener('click', function() {
		if (currentPage < totalPages) {
			currentPage++;
			renderCounselings();
			updatePagination();
		}
	});

	// 확인 버튼
	confirmBtn.addEventListener('click', function() {

		if (selectedCounsel) {
			counselNameInput.value = selectedCounsel.counselName;
			counselNameInput.dataset.crId = selectedCounsel.counselId;
			counselCategoryInput.value = selectedCounsel.counselCategory;
			counselMethodInput.value = selectedCounsel.counselMethod;
			counselReqDatetimeInput.value = selectedCounsel.counselReqDatetime;
			closeModal();
		}
	});

	// 모달 외부 클릭시 닫기
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			closeModal();
		}
	});
});



// 자동완성 추가 기능
document.addEventListener('DOMContentLoaded', function() {
	// 자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}
})

// 자동완성 핸들러
function autoCompleteHandler() {
	// 1. 과거 상담내역 검색 버튼을 클릭하여 모달을 엽니다
	document.getElementById('counsel-history-search').click();

	// 2. 모달이 열리는 데 약간의 시간이 필요하므로 setTimeout을 사용
	setTimeout(function() {
		//모달에서 '최미혜' 상담 내역을 찾아서 클릭
		const counselorListItems = document.querySelectorAll('.search-modal__list-item');
		let selectedItem = null;
		// 목록에 항목이 있는지 확인하고 첫 번째 항목을 선택합니다.
		if (counselorListItems.length > 0) {
			selectedItem = counselorListItems[0];
			selectedItem.click(); // 첫 번째 상담 내역 선택
		}

		if (selectedItem) {
			// '선택' 버튼을 클릭하여 선택한 정보를 본문 폼으로 옮깁니다.
			document.getElementById('modal-confirm-btn').click();
		}

		// 3. 모달이 닫히고 폼 필드가 채워지는 데 약간의 시간이 필요 
		setTimeout(function() {
			//별점 자동선택 (5점 만점)
			const ratingStars = document.querySelectorAll('.rating-input__star');
			if (ratingStars.length > 4) {
				ratingStars[4].click();
			}

			//후기내용 자동완성
			const reviewContent = `상담사님과 함께 진로에 대한 깊이 있는 대화를 나누며 명확한 목표를 세울 수 있었습니다.\n제 강점과 약점을 객관적으로 파악하고, 앞으로 나아가야 할 방향을 구체적으로 설정하는 데 큰 도움이 되었습니다. \n상담 내내 편안한 분위기를 조성해주셔서 감사드립니다.`;
			document.getElementById('cr-content').value = reviewContent;

			//공개여부 '공개'로 선택
			document.querySelector('input[name="cr-public"][value="Y"]');


		}, 500); // 500ms 지연

	}, 500); // 500ms 지연
}