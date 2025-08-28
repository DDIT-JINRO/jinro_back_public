document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.querySelector('.search-filter__accordion-header');

	// 필터 패널
	const panel = document.querySelector('.search-filter__accordion-panel');

	// 필터 그룹 객체
	const allCheckboxGroups = {
	    regionIds: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="regionIds"]'),
	    typeIds: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="typeIds"]'),
	    gubunIds: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="gubunIds"]'),
		sortOrder : document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]'),
	};

	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');

	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');

	// 라디오 타입의 정렬기능 input요소들
	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 디테일 페이지로 이동
	document.querySelectorAll('.content-list__item').forEach(univ => {
		univ.addEventListener('click', (e) => {
			// 북마크 버튼 눌렀을 때에는 디테일 페이지로 넘어가지 않도록 방지
			if (e.target.closest('.bookmark-button')) {
				return;
			}
			location.href = '/ertds/univ/uvsrch/selectDetail.do?univId=' + univ.dataset.univId;
		});
	});

	// 아코디언 코드
	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			this.classList.toggle('is-active');
			panel.classList.toggle('is-open');
		});
	}

	// 필터 태그 추가
	const updateSelectedFiltersDisplay = () => {
		if (!selectedFiltersContainer) return;
	    selectedFiltersContainer.innerHTML = '';

	    Object.keys(allCheckboxGroups).forEach(groupName => {
	        const checkboxList = allCheckboxGroups[groupName];
	        const selectedCheckboxes = Array.from(checkboxList).filter(checkBox => checkBox.checked);

			orderByRadios.forEach(r=>{
				r.dataset.preChecked = '';
			})
			const checkedOrder = Array.from(orderByRadios).find(r => r.checked);
			if (checkedOrder) {
				checkedOrder.dataset.preChecked = 'true';
			}
	        selectedCheckboxes.forEach(checkbox => {
	            const labelText = checkbox.nextElementSibling.textContent;
	            let groupLabel = '';
	            if (groupName === 'regionIds') groupLabel = '대학 지역';
	            if (groupName === 'typeIds') groupLabel = '대학 유형';
	            if (groupName === 'gubunIds') groupLabel = '설립 유형';
				if (groupName === 'sortOrder') groupLabel = '정렬';

	            const tagHTML = `<span class="search-filter__tag" data-group="${groupName}" data-value="${checkbox.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
	            selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
	        });

	    });

	};

	const handleCheckboxChange = () => {
		updateSelectedFiltersDisplay();
	};

	// 이벤트 등록 (기존 로직 유지)
	Object.values(allCheckboxGroups).forEach(checkboxList => {
	    checkboxList.forEach(checkbox => {
	        checkbox.addEventListener('change', handleCheckboxChange);
    	});
	});
	// 정렬라디오 도 등록
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

	// '선택된 필터' 영역에서 X 버튼 클릭 시 이벤트 처리 (이벤트 위임)
	selectedFiltersContainer.addEventListener('click', (e) => {
		if (e.target.classList.contains('search-filter__tag-remove')) {
			const tag = e.target.closest('.search-filter__tag');
			const groupName = tag.dataset.group;
	        const value = tag.dataset.value;

	        const checkboxToUncheck = Array.from(allCheckboxGroups[groupName]).find(checkbox => checkbox.value === value);
			if (checkboxToUncheck) checkboxToUncheck.checked = false;

			// (추가) 정렬 라디오도 해제
		  	const radioToUncheck = Array.from(orderByRadios).find(r => r.value === value);
		  	if (radioToUncheck) radioToUncheck.checked = false;

			updateSelectedFiltersDisplay();
		}
	});

	// 초기화 버튼 클릭 시 이벤트 처리
	if (resetButton) {
		resetButton.addEventListener('click', () => {
			Object.values(allCheckboxGroups).forEach(checkboxList => {
				checkboxList.forEach(checkbox => {
					checkbox.checked = false;
				});
			});
			// 라디오도 체크해제 추가
			orderByRadios.forEach(r => {r.checked = false; r.preChecked = ''});

			selectedFiltersContainer.innerHTML = '';
		});
	}

	// 이벤트 추가
	document.querySelectorAll('.bookmark-button').forEach(button => {
		button.addEventListener('click', function(event) {
			event.preventDefault();
			// 함수 전달
			handleBookmarkToggle(this);
		});
	});

	updateSelectedFiltersDisplay();
});

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
						return;
				    }
				);
			}
		})
		.catch(error => {
			// 네트워크 오류나 서버 응답 실패 시
			console.error('북마크 처리 중 오류 발생:', error);
			showConfirm2("오류가 발생했습니다.","잠시 후 다시 시도해주세요.", 
			   () => {
					return;
			    }
			);
		});
}