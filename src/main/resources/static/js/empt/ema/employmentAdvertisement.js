document.addEventListener('DOMContentLoaded', function() {
	const accordionHeaders = document.querySelectorAll('.accordion-list__item-header');

	accordionHeaders.forEach(header => {
		header.addEventListener('click', function() {
			toggleAccordionItem(this);
		});
	});

	// 아코디언 토글 함수
	function toggleAccordionItem(header) {
		const currentItem = header.closest('.accordion-list__item');
		const currentContent = currentItem.querySelector('.accordion-list__item-content');
		const currentToggle = header.querySelector('.accordion-list__toggle-icon');
		const isOpening = !currentContent.classList.contains('is-active');

		// 다른 열린 아코디언 모두 닫기
		document.querySelectorAll('.accordion-list__item').forEach(item => {
			if (item !== currentItem) {
				item.querySelector('.accordion-list__item-content').classList.remove('is-active');
				item.querySelector('.accordion-list__item-header').classList.remove('is-active');
				item.querySelector('.accordion-list__toggle-icon').classList.remove('is-active');
			}
		});

		// 현재 아코디언 토글
		if (isOpening) {
			currentContent.classList.add('is-active');
			header.classList.add('is-active');
			currentToggle.classList.add('is-active');

			// 하이픈 줄바꿈 로직 적용
			const descriptionSection = currentItem.querySelector('.hire-description-section p');
			if (descriptionSection && !descriptionSection.dataset.isProcessed) {
				const originalText = descriptionSection.textContent;
				const newHtml = originalText.replace(/-/g, '<br>-');
				descriptionSection.innerHTML = newHtml;
				descriptionSection.dataset.isProcessed = true;
			}
		} else {
			currentContent.classList.remove('is-active');
			header.classList.remove('is-active');
			currentToggle.classList.remove('is-active');
		}
	}
})

// 기존 필터 관련 코드를 다음으로 교체:

document.addEventListener('DOMContentLoaded', function() {
	// 필터 아코디언 토글 버튼
	const toggleButton = document.getElementById('search-filter-toggle');
	// 필터 패널
	const panel = document.getElementById('search-filter-panel');
	// 필터 키워드
	const filterCheckboxes = document.querySelectorAll('.search-filter__option input[type="checkbox"]');
	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');
	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');


	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 아코디언 토글 기능
	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			this.classList.toggle('is-active');
			panel.classList.toggle('is-open');
		});
	}

	// 2. 선택된 필터 태그를 업데이트하는 함수
	const updateSelectedFiltersDisplay = () => {
		if (!selectedFiltersContainer) return;
	    selectedFiltersContainer.innerHTML = '';

	    const filterGroups = {
	        hireClassCodeNames: { label: '직무' },
	        regions: { label: '지역' },
	        hireTypeNames: { label: '채용유형' },
			hiringStatus : { label: '채용상태' },
			sortOrder : { label: '정렬' },
	    };

		// 3. 필터 input에 변경 이벤트 리스너 추가
		filterCheckboxes.forEach(checkbox => {
		    if (checkbox.checked) {
		        const groupName = checkbox.name;
		        const groupLabel = filterGroups[groupName]?.label || '';
		        const labelText = checkbox.nextElementSibling.textContent;

		        const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="${groupName}" data-value="${checkbox.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
		        selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		    }
		});
		orderByRadios.forEach( r =>{
			r.dataset.preChecked = '';
		})
		// 정렬 라디오
		const checkedOrder = Array.from(orderByRadios).find(r => r.checked);
		if (checkedOrder) {
			checkedOrder.dataset.preChecked = 'true';
			const labelText = checkedOrder.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-name="sortOrder" data-filter="${labelText}" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
	};

	// 체크박스 변경 이벤트
	filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedFiltersDisplay));
	// 라디오 이벤트
	orderByRadios.forEach(radio => {
		radio.addEventListener('change', updateSelectedFiltersDisplay);
		radio.addEventListener('click', function(e) {
			if (radio.dataset.preChecked == 'true') {
				radio.dataset.preChecked = '';
				radio.checked = false;
				updateSelectedFiltersDisplay();
			}
		})
	});

	// '선택된 필터' 영역에서 X 버튼 클릭 시 이벤트 처리 (이벤트 위임)
	selectedFiltersContainer.addEventListener('click', (e) => {
		if (e.target.classList.contains('search-filter__tag-remove')) {
			const tag = e.target.closest('.search-filter__tag');
			const filterText = tag.dataset.filter;

			// 연결된 체크박스 찾아서 해제
			const checkboxToUncheck = Array.from(filterCheckboxes).find(
				cb => cb.nextElementSibling.textContent === filterText
			);
			if (checkboxToUncheck) {
				checkboxToUncheck.checked = false;
			}
			// 연결된 라디오 찾아서 해제
			const radioToUncheck = Array.from(orderByRadios).find(
				cb => cb.nextElementSibling.textContent === filterText
			);
			if (radioToUncheck) {
				radioToUncheck.dataset.preChecked = '';
				radioToUncheck.checked = false;
			}

			// 태그 삭제
			tag.remove();
		}
	});

	// 초기화 버튼 클릭 시 이벤트 처리
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			filterCheckboxes.forEach(checkbox => {
				checkbox.checked = false;
			});
			orderByRadios.forEach(radio => {
				radio.checked = false;
			})
			selectedFiltersContainer.innerHTML = '';
		});
	}

	// 페이지 리로드 후에도 필터 유지
	const urlParams = new URLSearchParams(window.location.search);
	const firstLoad = () => {
		filterCheckboxes.forEach(checkbox => {
			const paramName = checkbox.name;
			const paramValue = checkbox.value;
			const paramValues = urlParams.getAll(paramName);

			if (paramValues.includes(paramValue)) {
				checkbox.checked = true;
			}
		});
		updateSelectedFiltersDisplay();
	}
	firstLoad();// 쿼리파라미터에서 떼오는 로직이 js에 작성되어있음. 쿼리파라미터 챙겨서 checked상태 만든후 필터업데이트 호출

	// 검색창 키워드 자동 채우기
	const keywordInput = document.querySelector('input[name="keyword"]');
	if (keywordInput) {
		const keyword = urlParams.get('keyword');
		if (keyword) {
			keywordInput.value = decodeURIComponent(keyword);
		}
	}

	// 북마크
	// 모든 북마크 버튼
	const bookmarkButtons = document.querySelectorAll('.bookmark-button');

	// 이벤트 추가
	bookmarkButtons.forEach(button => {
		button.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			// 함수 전달
			handleBookmarkToggle(this);
		});
	});

});

//북마크
const handleBookmarkToggle = (button) => {
	if (memId == "" || memId == "anonymousUser") {
		showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
			() => {
				sessionStorage.setItem("redirectUrl", location.href);
				location.href = "/login";
			},
			() => {

			}
		);
		return;
	}

	const bmCategoryId = button.dataset.categoryId;
	const bmTargetId = button.dataset.targetId;

	// 현재 버튼이 'active' 클래스를 가지고 있는지 확인
	const isBookmarked = button.classList.contains('is-active');

	const data = {
		bmCategoryId: bmCategoryId,
		bmTargetId: bmTargetId
	};

	const apiUrl = isBookmarked ? '/mpg/mat/bmk/deleteBookmark.do' : '/mpg/mat/bmk/insertBookmark.do';

	fetch(apiUrl, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('서버 응답에 실패했습니다.');
			}
			return response.json();
		})
		.then(data => {
			if (data.success) {
				showConfirm2(data.message,"",
					() => {
					}
				);
				button.classList.toggle('is-active');
			} else {
				showConfirm2("북마크 처리에 실패했습니다.","",
					() => {
					}
				);
			}
		})
		.catch(error => {
			// 네트워크 오류나 서버 응답 실패 시
			console.error('북마크 처리 중 오류 발생:', error);
			showConfirm2("오류가 발생했습니다.","잠시 후 다시 시도해주세요.",
				() => {
				}
			);
		});
}