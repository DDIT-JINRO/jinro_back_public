/**
 *
 */

document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.getElementById('search-filter-toggle');

	// 필터 패널
	const panel = document.getElementById('search-filter-panel');

	// 필터 입력 요소들
	const filterInputs = document.querySelectorAll('.search-filter__option input[type="checkbox"], .search-filter__option input[type="radio"]');
	const allCheckboxes = document.querySelectorAll('.search-filter__option input[type="checkbox"]');
	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"]');

	// 선택된 필터 태그가 표시될 컨테이너
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');

	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');

	// 아코디언 기능
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
	        contestTypeFilter: { label: '모집 분야' },
	        contestStatusFilter: { label: '모집 상태' },
	        contestTargetFilter: { label: '모집 대상' },
			sortOrder : { label: '정렬' },
	    };

		// 3. 필터 input에 변경 이벤트 리스너 추가
		allCheckboxes.forEach(checkbox => {
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
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="sortOrder" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
	};

	// 라디오 이벤트
	orderByRadios.forEach(radio => {
		radio.addEventListener('change', updateSelectedFiltersDisplay);
		radio.addEventListener('click', function(e){
			if(radio.dataset.preChecked == 'true'){
				radio.dataset.preChecked = '';
				radio.checked = false;
				updateSelectedFiltersDisplay();
			}
		})
	});

	// 체크박스 변경 이벤트
	allCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedFiltersDisplay));




	// '선택된 필터' 영역에서 X 버튼 클릭 시 이벤트 처리 (이벤트 위임)
	if (selectedFiltersContainer) {
		selectedFiltersContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('search-filter__tag-remove')) {
				const tag = e.target.closest('.search-filter__tag');
				const filterText = tag.dataset.filter;

				const inputToUncheck = Array.from(filterInputs).find(
					input => input.nextElementSibling.textContent.trim() === filterText.trim()
				);

				if (inputToUncheck) {
					inputToUncheck.checked = false;
				}

				tag.remove();
			}
		});
	}

	// 초기화 버튼 클릭 시 이벤트 처리
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			filterInputs.forEach(input => {
				input.checked = false;
			});
			if (selectedFiltersContainer) selectedFiltersContainer.innerHTML = '';
		});
	}

	// 페이지가 로드될 때 URL을 분석하여 필터를 복원하는 함수
	function restoreFiltersFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);

		filterInputs.forEach(input => {
			const paramName = input.name;
			const paramValue = input.value;
			let isSelected = false;

			if (input.type === 'checkbox') {
				if (urlParams.getAll(paramName).includes(paramValue)) {
					isSelected = true;
				}
			} else if (input.type === 'radio') {
				if (urlParams.get(paramName) === paramValue) {
					isSelected = true;
				}
			}

			if (isSelected) {
				input.checked = true;
			}

			updateSelectedFiltersDisplay()
		});
	}

	// 페이지가 처음 로드될 때 필터 복원 함수를 실행합니다.
	restoreFiltersFromUrl();

	// 페이지에 있는 모든 D-Day 항목들을 선택합니다.
	const dDayItems = document.querySelectorAll('.d-day-item');

	dDayItems.forEach(item => {
		const endDateStr = item.dataset.endDate; // 'yyyy-MM-dd' 형식의 문자열
		const dDayTextElement = item.querySelector('.d-day-text');

		if (endDateStr && dDayTextElement) {
			const endDate = new Date(endDateStr);
			const today = new Date();

			// 시간 정보를 제거하고 날짜만 비교하기 위해 자정 기준으로 설정
			endDate.setHours(23, 59, 59, 999); // 마감일 자정까지 포함
			today.setHours(0, 0, 0, 0);

			const diffTime = endDate.getTime() - today.getTime();
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays < 0) {
				dDayTextElement.textContent = '마감';
				dDayTextElement.classList.add('finished');
			} else if (diffDays === 0) {
				dDayTextElement.textContent = 'D-Day';
			} else {
				dDayTextElement.textContent = `D-${diffDays}`;
			}
		}
	});
});