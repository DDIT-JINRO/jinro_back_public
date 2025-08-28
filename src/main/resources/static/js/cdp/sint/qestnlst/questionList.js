// 1) 페이지 로드 시 sessionStorage에서 복원
let selectedQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
	const currentRaw = window.currentMemId || '';   // JSP에서 넘어온 문자열
	// Spring Security 익명 사용자는 "anonymousUser"로 찍힐 수 있으므로
	const currentMemId = (currentRaw === 'anonymousUser') ? '' : currentRaw;
	let storedRaw = sessionStorage.getItem('memId');
	const storedMemId = (storedRaw === 'anonymousUser') ? '' : (storedRaw || null);

	// 1) 첫 방문: storedMemId === null
	if (storedMemId === null) {
		sessionStorage.setItem('memId', currentMemId);
	}
	// 2) 로그인 → 로그아웃: storedMemId non-empty && currentMemId empty
	else if (storedMemId !== '' && currentMemId === '') {
		sessionStorage.clear();
		sessionStorage.setItem('memId', '');
	}
	// 3) 익명 → 로그인: storedMemId empty && currentMemId non-empty
	else if (storedMemId === '' && currentMemId !== '') {
		sessionStorage.setItem('memId', currentMemId);
	}
	// 4) 그 외 (익명→익명, 로그인→동일 사용자) → 아무 동작 없음

	// --- 이제 선택 질문 복원 로직 실행 ---
	const saved = sessionStorage.getItem('selectedQuestions');
	if (saved) {
		selectedQuestions = JSON.parse(saved);
		selectedQuestions.forEach(q => {
			const chk = document.querySelector(
				`input[type="checkbox"][data-id="${q.id}"]`
			);
			if (chk) chk.checked = true;
		});
	}
	updateCartSidebar();
	updateQuestionIdsInput();

	const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
	const selectedFiltersContainer = document.getElementById('selected-filters');

	restoreFiltersFromUrl();

	// 아코디언 토글 기능
	const accordionHeader = document.querySelector('.search-filter__accordion-header');
	const accordionPanel = document.querySelector('.search-filter__accordion-panel');

	if (accordionHeader && accordionPanel) {
		accordionHeader.addEventListener('click', function() {
			const isOpen = accordionPanel.classList.contains('is-open');

			if (isOpen) {
				accordionPanel.classList.remove('is-open');
				accordionHeader.classList.remove('is-active');
			} else {
				accordionPanel.classList.add('is-open');
				accordionHeader.classList.add('is-active');
			}
		});
	}

	// 체크박스를 클릭할 때마다 필터 조건을 업데이트
	filterCheckboxes.forEach(function(checkbox) {
		checkbox.addEventListener('change', function() {
			const filterName = this.getAttribute('data-name');
			const filterId = this.getAttribute('data-id');

			if (this.checked) {
				addFilterToConditions(filterName, filterId);
			} else {
				removeFilter(filterId);
			}
		});

	});

	// 필터를 선택했을 때, 필터 조건에 추가
	function addFilterToConditions(name, id) {
		const filterItem = document.createElement('div');
		filterItem.classList.add('search-filter__tag');
		filterItem.setAttribute('data-id', id);
		filterItem.innerHTML = `${name} <button type="button" class="search-filter__tag-remove" onclick="removeFilter('${id}')">×</button>`;
		selectedFiltersContainer.appendChild(filterItem);

		// ✅ 해당하는 체크박스의 부모 .search-filter__option에 'checked' 클래스 추가
		const checkbox = document.querySelector(`.filter-checkbox[data-id="${id}"]`);
		if (checkbox) {
			const parent = checkbox.closest('.search-filter__option');
			if (parent) {
				parent.classList.add('checked');
			}
		}
	}

	// 필터를 제거할 때, 필터 조건에서 삭제
	window.removeFilter = function(id) {
		const filterItem = document.querySelector(`.search-filter__tag[data-id="${id}"]`);
		if (filterItem) {
			filterItem.remove();

			const checkbox = document.querySelector(`.filter-checkbox[data-id="${id}"]`);
			if (checkbox) {
				checkbox.checked = false; // 체크박스 해제

				// ✅ 상단 필터에서 .checked 클래스 제거
				const parent = checkbox.closest('.search-filter__option');
				if (parent) {
					parent.classList.remove('checked');
				}
			}
		}
	}

	function restoreFiltersFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const selectedJobFilters = urlParams.getAll('siqJobFilter');

		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

		if (selectedJobFilters.length > 0) {
			filterCheckboxes.forEach(checkbox => {
				// URL 파라미터에 현재 체크박스의 value 값 (id)이 포함되어 있다면
				if (selectedJobFilters.includes(checkbox.value)) {
					checkbox.checked = true; // 실제 체크박스 상태를 'checked'로 만듦

					// '선택된 필터' 영역에 태그를 추가하고 상단 필터에 'checked' 클래스를 적용
					// addFilterToConditions 함수가 이 두 가지 작업을 모두 수행하도록 수정했으므로 호출합니다.
					addFilterToConditions(checkbox.dataset.name, checkbox.dataset.id);
				}
			});
		}
	}

	// 직무 필터 초기화 함수
	window.resetJobFilters = function() {
		const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
		const selectedFiltersContainer = document.getElementById('selected-filters');

		// 모든 체크박스 해제
		filterCheckboxes.forEach(checkbox => {
			checkbox.checked = false;
			const parent = checkbox.closest('.search-filter__option');
			if (parent) {
				parent.classList.remove('checked');
			}
		});

		// 선택된 필터 태그 모두 제거
		selectedFiltersContainer.innerHTML = '';
	}

	const submitCart = document.querySelector(".submitCartForm");

	if (!memId || memId == 'anonymousUser') {
		if (submitCart) { // 버튼이 존재하는지 확인 (에러 방지)
			submitCart.textContent = '로그인 하러 가기';
			submitCart.addEventListener('click', function() {
				window.location.href = '/login';
			});
		}
	} else

		// 6) 폼 제출
		submitCart.addEventListener("click", function() {

			if (selectedQuestions.length === 0) {
				showConfirm2('자기소개서 작성을 위해 질문을 선택해주세요.',"",
					() => {
					}
				);
				return;
			}
			// 필요하다면 여기서 sessionStorage.removeItem('selectedQuestions');
			document.getElementById('cartForm').submit();
			uncheckAllQuestionCheckboxes();
			sessionStorage.removeItem('selectedQuestions');
		})
});

// 2) 선택 토글 함수
function toggleQuestion(checkbox, id, content) {
	const existing = selectedQuestions.find(q => q.id === id);
	if (checkbox.checked) {
		if (!existing) selectedQuestions.push({ id, content });
	} else {
		selectedQuestions = selectedQuestions.filter(q => q.id !== id);
	}
	updateCartSidebar();
	updateQuestionIdsInput();
	// 변경된 목록 저장
	sessionStorage.setItem(
		'selectedQuestions',
		JSON.stringify(selectedQuestions)
	);
}

// 3) 사이드바 렌더링
function updateCartSidebar() {
	const cartSidebar = document.getElementById('cartSidebar');
	cartSidebar.innerHTML = '';

	if (selectedQuestions.length === 0) {
		cartSidebar.innerHTML =
			'<div class="empty-cart-message">선택된 질문이 없습니다.</div>';
		return;
	}

	selectedQuestions.forEach(q => {
		const item = document.createElement('div');
		item.className = 'question-panel-item';
		item.setAttribute('data-id', q.id);

		const contentDiv = document.createElement('div');
		contentDiv.className = 'question-panel-content';
		contentDiv.textContent = q.content;

		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'remove-question-btn';
		btn.innerHTML = '&times;';
		btn.addEventListener('click', () => removeQuestionFromCart(q.id));

		item.append(contentDiv, btn);
		cartSidebar.appendChild(item);
	});
}

// 4) × 버튼 클릭 시 제거
function removeQuestionFromCart(id) {
	selectedQuestions = selectedQuestions.filter(q => q.id !== id);
	const chk = document.querySelector(
		`input[type="checkbox"][data-id="${id}"]`
	);
	if (chk) chk.checked = false;
	updateCartSidebar();
	updateQuestionIdsInput();
	sessionStorage.setItem(
		'selectedQuestions',
		JSON.stringify(selectedQuestions)
	);
}

// 5) 숨겨진 input 갱신
function updateQuestionIdsInput() {
	document.getElementById('questionIds').value =
		selectedQuestions.map(q => q.id).join(',');
}

// 질문 checkbox 초기화
function uncheckAllQuestionCheckboxes() {
  // 클래스가 'question-item__checkbox'인 모든 체크박스를 선택합니다.
  const checkboxes = document.querySelectorAll('.question-item__checkbox');

  // 반복문을 돌면서 모든 체크박스의 'checked' 속성을 false로 만듭니다.
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// 전역 함수로 노출 (JSP에서 onclick으로 호출하기 위해)
window.toggleQuestion = toggleQuestion;