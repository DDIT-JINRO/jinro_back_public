document.addEventListener('DOMContentLoaded', function() {

	// 디테일 페이지로 이동
	document.querySelectorAll('.content-list__item').forEach(exam => {
		exam.addEventListener('click', () => {
			location.href = '/ertds/qlfexm/selectQlfexmDetail.do?examId=' + exam.dataset.examId;
		});
	});

	const toggleButton = document.querySelector('.search-filter__accordion-header');
	const panel = document.querySelector('.search-filter__accordion-panel');
	const allCheckboxes = document.querySelectorAll('.search-filter__option input[type="checkbox"]');
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');
	const resetButton = document.querySelector('.search-filter__reset-button');

	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 1. 상세검색 토글 기능
	toggleButton.addEventListener('click', function() {
		this.classList.toggle('is-active');
		panel.classList.toggle('is-open');
	});


	// 2. 선택된 필터 태그를 업데이트하는 함수
	const updateSelectedFiltersDisplay = () => {
		if (!selectedFiltersContainer) return;
	    selectedFiltersContainer.innerHTML = '';

	    const filterGroups = {
			sortOrder : { label: '정렬' },
	    };

		// 3. 필터 input에 변경 이벤트 리스너 추가
		allCheckboxes.forEach(checkbox => {
		    if (checkbox.checked) {
		        const groupName = checkbox.name;
		        const groupLabel = filterGroups[groupName]?.label || '';
		        const labelText = checkbox.nextElementSibling.textContent;

		        const tagHTML = `<span class="search-filter__tag" data-name="${groupName}" data-value="${checkbox.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
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
			const tagHTML = `<span class="search-filter__tag" data-name="sortOrder" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
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
	allCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedFiltersDisplay));

	// 초기화 버튼 이벤트
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			allCheckboxes.forEach(checkbox => checkbox.checked = false);
			orderByRadios.forEach(radio => radio.checked = false);
			updateSelectedFiltersDisplay();
		});
	}

	// 페이지 로드 시 초기 태그 표시
	updateSelectedFiltersDisplay();
});
