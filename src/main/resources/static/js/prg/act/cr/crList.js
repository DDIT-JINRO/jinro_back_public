/**
 * 
 */

document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.getElementById('com-accordion-toggle');

	// 필터 패널 
	const panel = document.getElementById('com-accordion-panel');

	// 필터 키워드
	const filterInputs = document.querySelectorAll('.com-filter-item input[type="checkbox"], .com-filter-item input[type="radio"]');
	const filterCheckboxes = document.querySelectorAll('.com-filter-item input[type="checkbox"]');
	const filterRadios = document.querySelectorAll('.com-filter-item input[type="radio"]'); // 라디오 버튼 추가

	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.com-selected-filters');

	// 초기화 버튼
	const resetButton = document.querySelector('.com-filter-reset-btn');

	// 아코디언 코드
	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			this.classList.toggle('active');
			panel.classList.toggle('open');
		});
	}

	// 필터 태그 추가
	const createFilterTag = (text, inputName) => {
		const filterTag = `<span class="com-selected-filter" data-filter="${text}" data-name="${inputName}">${text}<button type="button" class="com-remove-filter">×</button></span>`;
		selectedFiltersContainer.innerHTML += filterTag;
	};

	// 필터 태그 삭제
	const removeFilterTag = (text) => {
		const tagToRemove = selectedFiltersContainer.querySelector(`[data-filter="${text}"]`);
		if (tagToRemove) {
			tagToRemove.remove();
		}
	};

	//라디오 버튼처럼 그룹 내에서 하나만 존재하는 태그를 지우기 위한 함수
	const removeFilterTagByInputName = (inputName) => {
		const tagToRemove = selectedFiltersContainer.querySelector(`[data-name="${inputName}"]`);
		if (tagToRemove) {
			tagToRemove.remove();
		}
	}

	// 체크박스 변경 시 이벤트 처리
	filterCheckboxes.forEach(checkbox => {
		checkbox.addEventListener('change', (e) => {
			const labelText = e.target.nextElementSibling.textContent;
			if (e.target.checked) {
				createFilterTag(labelText, e.target.name);
			} else {
				removeFilterTag(labelText);
			}
		});
	});

	//라디오 버튼 변경 시 이벤트 처리
	filterRadios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			// 1. 같은 그룹의 기존 태그를 먼저 삭제
			removeFilterTagByInputName(e.target.name);

			// 2. 새로 선택된 항목의 태그를 추가 (기본값은 제외)
			if (e.target.checked) {
				const labelText = e.target.nextElementSibling.textContent;
				createFilterTag(labelText, e.target.name);
			}
		});
	});

	// '선택된 필터' 영역에서 X 버튼 클릭 시 이벤트 처리 (이벤트 위임)
	selectedFiltersContainer.addEventListener('click', (e) => {
		if (e.target.classList.contains('com-remove-filter')) {
			const tag = e.target.closest('.com-selected-filter');
			const filterText = tag.dataset.filter;

			// 연결된 체크박스 또는 라디오 버튼을 찾아서 해제
			const inputToUncheck = Array.from(filterInputs).find(
				input => input.nextElementSibling.textContent.trim() === filterText.trim()
			);
			if (inputToUncheck) {
				inputToUncheck.checked = false;
			}

			tag.remove();
		}
	});

	// 초기화 버튼 클릭 시 이벤트 처리
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			filterCheckboxes.forEach(input => {
				input.checked = false;
			});

			selectedFiltersContainer.innerHTML = '';
		});

		// 페이지가 로드될 때 URL을 분석하여 필터를 복원하는 함수
		function restoreFiltersFromUrl() {
			// 1. 현재 페이지의 URL에서 모든 파라미터를 읽어옵니다.
			const urlParams = new URLSearchParams(window.location.search);

			// 2. 모든 필터 입력(체크박스 + 라디오)을 하나씩 확인합니다.
			filterInputs.forEach(input => {
				const paramName = input.name;   // <input>의 name 속성
				const paramValue = input.value; // <input>의 value 속성

				let isSelected = false;

				// 3. 입력 타입에 따라 URL 파라미터와 비교합니다.
				if (input.type === 'checkbox') {
					// 체크박스는 같은 name으로 여러 값이 올 수 있으므로 getAll, includes로 확인
					const paramValues = urlParams.getAll(paramName);
					if (paramValues.includes(paramValue)) {
						isSelected = true;
					}
				} else if (input.type === 'radio') {
					// 라디오 버튼 그룹은 하나의 값만 가지므로 get으로 확인
					if (urlParams.get(paramName) === paramValue) {
						isSelected = true;
					}
				}

				// 4. URL 파라미터와 일치하는 입력 요소를 선택 상태로 만듭니다.
				if (isSelected) {
					input.checked = true;

					// 5. '선택된 필터' 영역에 태그도 함께 생성합니다. (단, 기본 정렬값은 제외)
					if (!(input.name === 'sortOrder')) {
						const labelText = input.nextElementSibling.textContent;
						createFilterTag(labelText, input.name);
					}
				}
			});
		}

		// 페이지가 처음 로드될 때 필터 복원 함수를 실행합니다.
		restoreFiltersFromUrl();
	}

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