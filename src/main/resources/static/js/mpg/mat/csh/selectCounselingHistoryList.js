document.addEventListener('DOMContentLoaded', function() {
	const toggleButton = document.getElementById('search-filter-toggle');
	const panel = document.getElementById('search-filter-panel');
	const filterOrder = ['counselStatus', 'counselCategory', 'counselMethod', 'sortOrder'];
	const allRadioGroups = {
	    counselStatus: document.querySelectorAll('.search-filter__option input[type="radio"][name="counselStatus"]'),
	    counselCategory: document.querySelectorAll('.search-filter__option input[type="radio"][name="counselCategory"]'),
	    counselMethod: document.querySelectorAll('.search-filter__option input[type="radio"][name="counselMethod"]'),
	    sortOrder: document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]')
	};
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');
	const resetButton = document.querySelector('.search-filter__reset-button');


	// 아코디언 기능
	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			const isOpen = this.classList.toggle('is-active');
			panel.classList.toggle('is-open', isOpen);
		});
	}

	// 선택된 필터 태그를 업데이트하는 함수
	const updateSelectedFiltersDisplay = () => {
		if (!selectedFiltersContainer) return;
		selectedFiltersContainer.innerHTML = '';

		allRadioGroups['counselCategory'].forEach(r => {
			if (!r.checked) {
				r.dataset.preChecked = '';
			}
		})
		allRadioGroups['counselMethod'].forEach(r => {
			if (!r.checked) {
				r.dataset.preChecked = '';
			}
		})
		allRadioGroups['counselStatus'].forEach(r => {
			if (!r.checked) {
				r.dataset.preChecked = '';
			}
		})
		allRadioGroups['sortOrder'].forEach(r => {
			if (!r.checked) {
				r.dataset.preChecked = '';
			}
		})

		// 정렬 라디오
		const checkedcounselCategory = Array.from(allRadioGroups['counselCategory']).find(r => r.checked && r.name=='counselCategory');
		if (checkedcounselCategory) {
			checkedcounselCategory.dataset.preChecked = 'true';
			const labelText = checkedcounselCategory.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="sortOrder" data-value="${checkedcounselCategory.value}">상태 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
		// 상태 라디오
		const checkedcounselMethod = Array.from(allRadioGroups['counselMethod']).find(r => r.checked && r.name=='counselMethod');
		if (checkedcounselMethod) {
			checkedcounselMethod.dataset.preChecked = 'true';
			const labelText = checkedcounselMethod.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="status" data-value="${checkedcounselMethod.value}">분류 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
		const checkedcounselStatus = Array.from(allRadioGroups['counselStatus']).find(r => r.checked && r.name=='counselStatus');
		if (checkedcounselStatus) {
			checkedcounselStatus.dataset.preChecked = 'true';
			const labelText = checkedcounselStatus.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="status" data-value="${checkedcounselStatus.value}">방법 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
		const checkedsortOrder = Array.from(allRadioGroups['sortOrder']).find(r => r.checked && r.name=='sortOrder');
		if (checkedsortOrder) {
			checkedsortOrder.dataset.preChecked = 'true';
			const labelText = checkedsortOrder.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="status" data-value="${checkedsortOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
		// 라디오 이벤트
		allRadioGroups['counselCategory'].forEach(radio => {
			radio.addEventListener('change', updateSelectedFiltersDisplay);
			radio.addEventListener('click', function(e){
				if(radio.dataset.preChecked == 'true' && radio.name == 'counselCategory'){
					radio.dataset.preChecked = '';
					radio.checked = false;
					updateSelectedFiltersDisplay();
				}
			})
		});
		// 라디오 이벤트
		allRadioGroups['counselMethod'].forEach(radio => {
			radio.addEventListener('change', updateSelectedFiltersDisplay);
			radio.addEventListener('click', function(e){
				if(radio.dataset.preChecked == 'true' && radio.name == 'counselMethod'){
					radio.dataset.preChecked = '';
					radio.checked = false;
					updateSelectedFiltersDisplay();
				}
			})
		});
		// 라디오 이벤트
		allRadioGroups['counselStatus'].forEach(radio => {
			radio.addEventListener('change', updateSelectedFiltersDisplay);
			radio.addEventListener('click', function(e){
				if(radio.dataset.preChecked == 'true' && radio.name == 'counselStatus'){
					radio.dataset.preChecked = '';
					radio.checked = false;
					updateSelectedFiltersDisplay();
				}
			})
		});
		// 라디오 이벤트
		allRadioGroups['sortOrder'].forEach(radio => {
			radio.addEventListener('change', updateSelectedFiltersDisplay);
			radio.addEventListener('click', function(e){
				if(radio.dataset.preChecked == 'true' && radio.name == 'sortOrder'){
					radio.dataset.preChecked = '';
					radio.checked = false;
					updateSelectedFiltersDisplay();
				}
			})
		});


	};

	// '선택된 필터' 영역의 X 버튼 클릭 이벤트 (이벤트 위임)
	if (selectedFiltersContainer) {
		selectedFiltersContainer.addEventListener('click', (e) => {
			// [수정] 클릭된 요소의 클래스명 변경
			if (e.target.classList.contains('search-filter__tag-remove')) {
				const tag = e.target.closest('.search-filter__tag');
				const groupName = tag.dataset.group;

				const radioToUncheck = Array.from(allRadioGroups[groupName]).find(radio => radio.checked);
				if (radioToUncheck) {
					radioToUncheck.dataset.preChecked = '';
					radioToUncheck.checked = false;
				}
				updateSelectedFiltersDisplay();
			}
		});
	}

	// 초기화 버튼 클릭 이벤트
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			Object.values(allRadioGroups).forEach(radioList => {
				radioList.forEach(radio => {
					radio.checked = false;
				});
			});
			updateSelectedFiltersDisplay();
		});
	}

	// 페이지 로드 시 초기 필터 상태 표시
	updateSelectedFiltersDisplay();
});