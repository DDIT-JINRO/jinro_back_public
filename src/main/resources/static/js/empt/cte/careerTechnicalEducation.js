document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.getElementById('search-filter-toggle');

	// 필터 패널
	const panel = document.getElementById('search-filter-panel');

	// 필터 키워드
	const filterCheckboxes = document.querySelectorAll('.search-filter__option input[type="checkbox"]');

	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');

	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');

	// 정렬 라디오
	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 아코디언 코드
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
			region: { label: '지역' },
			sortOrder: { label: '정렬' },
		};

		// 3. 필터 input에 변경 이벤트 리스너 추가
		filterCheckboxes.forEach(checkbox => {
			if (checkbox.checked) {
				const groupName = checkbox.name;
				const groupLabel = filterGroups[groupName]?.label || '';
				const labelText = checkbox.nextElementSibling.textContent;

				const tagHTML = `<span class="search-filter__tag" data-name="${groupName}" data-value="${checkbox.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
				selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
			}
		});

		// 정렬 라디오
		orderByRadios.forEach(r => {
			r.dataset.preChecked = '';
		})
		const checkedOrder = Array.from(orderByRadios).find(r => r.checked);
		if (checkedOrder) {
			checkedOrder.dataset.preChecked = 'true';
			const labelText = checkedOrder.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-name="sortOrder" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
	};

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

	if (selectedFiltersContainer) {
		selectedFiltersContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('search-filter__tag-remove')) {
				const tag = e.target.closest('.search-filter__tag');
				const checkbox = document.querySelector(`input[name="${tag.dataset.name}"][value="${tag.dataset.value}"]`);
				if (checkbox) checkbox.checked = false;
				updateSelectedFiltersDisplay();
			}
		});
	}

	// 체크박스 변경 이벤트
	filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedFiltersDisplay));

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
				orderByRadios.forEach(radio => radio.checked = false);
				updateSelectedFiltersDisplay();
			});

			selectedFiltersContainer.innerHTML = '';
		});
	}

	updateSelectedFiltersDisplay();

	//페이지 리로드 후에도 필터 유지
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


	//내용 아코디언
	const accordionHeaders = document.querySelectorAll('.accordion-list__item-header');

	accordionHeaders.forEach(header => {
		header.addEventListener('click', function() {
			const currentItem = header.closest('.accordion-list__item');
			const currentContent = currentItem.querySelector('.accordion-list__item-content');
			const currentToggle = header.querySelector('.accordion-list__toggle-icon');
			const isOpening = !currentContent.classList.contains('is-active');

			// 이미 열려있는 다른 아코디언 닫기
			document.querySelectorAll('.accordion-list__item').forEach(item => {
				if (item !== currentItem) {
					item.querySelector('.accordion-list__item-content').classList.remove('is-active');
					item.querySelector('.accordion-list__item-header').classList.remove('is-active');
					item.querySelector('.accordion-list__toggle-icon').classList.remove('is-active');
				}
			});

			if (isOpening) {
				currentContent.classList.add('is-active');
				header.classList.add('is-active');
				currentToggle.classList.add('is-active');
			} else {
				currentContent.classList.remove('is-active');
				header.classList.remove('is-active');
				currentToggle.classList.remove('is-active');
			}
		});
	});

});
