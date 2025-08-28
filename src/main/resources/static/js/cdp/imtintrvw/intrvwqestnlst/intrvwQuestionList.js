let selectedInterviewQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
	// 1. JSP에서 직접 전달한 memId를 사용하도록 로직 간소화
	const currentMemId = (window.currentMemId === 'anonymousUser') ? '' : window.currentMemId;

	const saved = sessionStorage.getItem('selectedInterviewQuestions');
	if (saved) {
		selectedInterviewQuestions = JSON.parse(saved);
		selectedInterviewQuestions.forEach(q => {
			const chk = document.querySelector(`input[type="checkbox"][data-id="${q.id}"]`);
			if (chk) chk.checked = true;
		});
	}
	updateCartSidebar();
	updateQuestionIdsInput();

	const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

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

	// 체크박스 클릭 시 필터 조건 업데이트
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

	// 2. 폼 제출 로직 수정 (버튼 클릭 -> 폼 제출 이벤트)
	const cartForm = document.getElementById('cartForm');
	if (cartForm) {
		cartForm.addEventListener('submit', function(event) {
			event.preventDefault(); // 기본 제출 동작을 막습니다.

			if (!currentMemId) {
				
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?", 
				    () => {
				        sessionStorage.setItem("redirectUrl", location.href);
				        location.href = "/login";
				    },
				    () => {
				        
				    }
				);
			}

			if (selectedInterviewQuestions.length === 0) {
				// 3. 알림 메시지 수정
				showConfirm2('면접 질문을 하나 이상 선택해주세요.',"", 
				    () => {
						return;	
				    }
				);
			}

			sessionStorage.removeItem('selectedInterviewQuestions');
			uncheckAllQuestionCheckboxes();
			this.submit(); // 유효성 검사 통과 후 폼 제출
		});
	}

	const submitButton = document.querySelector('.submitCartForm');
	if (submitButton && cartForm) {
		submitButton.addEventListener('click', function() {
			cartForm.dispatchEvent(new Event('submit', { cancelable: true }));
		});
	}
});

// 필터를 선택했을 때, 필터 조건에 추가
function addFilterToConditions(name, id) {
	const selectedFiltersContainer = document.getElementById('selected-filters');
	const filterItem = document.createElement('div');
	filterItem.classList.add('search-filter__tag');
	filterItem.setAttribute('data-id', id);
	filterItem.innerHTML = `${name} <button type="button" class="search-filter__tag-remove" onclick="removeFilter('${id}')">×</button>`;
	selectedFiltersContainer.appendChild(filterItem);

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
			checkbox.checked = false;
			const parent = checkbox.closest('.search-filter__option');
			if (parent) {
				parent.classList.remove('checked');
			}
		}
	}
}

// URL로부터 필터 복원
function restoreFiltersFromUrl() {
	const urlParams = new URLSearchParams(window.location.search);
	const selectedJobFilters = urlParams.getAll('siqJobFilter');
	if (selectedJobFilters.length > 0) {
		document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
			if (selectedJobFilters.includes(checkbox.value)) {
				checkbox.checked = true;
				addFilterToConditions(checkbox.dataset.name, checkbox.dataset.id);
			}
		});
	}
}

// 직무 필터 초기화
window.resetJobFilters = function() {
	document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
		checkbox.checked = false;
		const parent = checkbox.closest('.search-filter__option');
		if (parent) {
			parent.classList.remove('checked');
		}
	});
	document.getElementById('selected-filters').innerHTML = '';
}

// 선택 토글 함수
function toggleQuestion(checkbox, id, content) {
	const existing = selectedInterviewQuestions.find(q => q.id === id);
	if (checkbox.checked) {
		if (!existing) selectedInterviewQuestions.push({ id, content });
	} else {
		selectedInterviewQuestions = selectedInterviewQuestions.filter(q => q.id !== id);
	}
	updateCartSidebar();
	updateQuestionIdsInput();
	sessionStorage.setItem('selectedInterviewQuestions', JSON.stringify(selectedInterviewQuestions));
}

// 사이드바 렌더링
function updateCartSidebar() {
	const cartSidebar = document.getElementById('cartSidebar');
	cartSidebar.innerHTML = '';

	if (selectedInterviewQuestions.length === 0) {
		cartSidebar.innerHTML = '<div class="empty-cart-message">선택된 질문이 없습니다.</div>';
		return;
	}

	selectedInterviewQuestions.forEach(q => {
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

// × 버튼 클릭 시 제거
function removeQuestionFromCart(id) {
	selectedInterviewQuestions = selectedInterviewQuestions.filter(q => q.id !== id);
	const chk = document.querySelector(`input[type="checkbox"][data-id="${id}"]`);
	if (chk) chk.checked = false;
	updateCartSidebar();
	updateQuestionIdsInput();
	sessionStorage.setItem('selectedInterviewQuestions', JSON.stringify(selectedInterviewQuestions));
}

// 숨겨진 input 갱신
function updateQuestionIdsInput() {
	document.getElementById('questionIds').value = selectedInterviewQuestions.map(q => q.id).join(',');
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

window.toggleQuestion = toggleQuestion;