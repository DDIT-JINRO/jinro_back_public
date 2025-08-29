/**
 *
 */

document.addEventListener('DOMContentLoaded', function() {
	const channelSection = document.querySelector(".channel");
	if (channelSection) {
	    const errorMessage = channelSection.dataset.errorMessage;
	    if (errorMessage) {
			showConfirm2(errorMessage,"",
   			   () => {
					history.back();
   			    }
   			);
			return;
		}
	}

	document.getElementById('btnWrite').addEventListener('click', function() {
		if (!memId || memId == 'anonymousUser') {
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

		location.href = "/ertds/univ/uvivfb/insertInterviewFeedbackView.do";
	})

	const cardHeaders = document.querySelectorAll(".accordion-list__item-header");
	cardHeaders.forEach((cardHeader) => {
		cardHeader.addEventListener("click", function() {
			toggleCard(this);
		})
	})

	const deleteBtns = document.querySelectorAll(".card-actions__button--delete");
	deleteBtns.forEach((deleteBtn) => {
		deleteBtn.addEventListener("click", function() {
			const irId = this.dataset.irId;
			deleteInterviewFeedback(irId);
		})
	})

	const editBtns = document.querySelectorAll(".card-actions__button--edit");
	editBtns.forEach((editBtn) => {
		editBtn.addEventListener("click", function() {
			const dataMemId = this.dataset.memId;
			const irId = this.dataset.irId;
			if (dataMemId != memId) {
				showConfirm2("허용되지 않은 접근입니다.","",
					() => {
					}
				);
				return;
			}
			location.href = `/ertds/univ/uvivfb/updateInterviewFeedbackView.do?irId=${irId}`;
		})
	})

	/* 정렬용 상세검색패널추가 */
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
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="sortOrder" dta-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
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
				const filterText = tag.dataset.filter;

				// 연결된 라디오 찾아서 해제
				const radioToUncheck = Array.from(orderByRadios).find(
					cb => cb.nextElementSibling.textContent === filterText
				);
				console.log(radioToUncheck);
				if (radioToUncheck) {
					radioToUncheck.checked = false;
				}

				// 태그 삭제
				tag.remove();
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

function toggleCard(header) {
	const currentCard = header.closest('.accordion-list__item');
	const currentContent = currentCard.querySelector('.accordion-list__item-content');
	const currentToggle = header.querySelector('.accordion-list__toggle-icon');
	const isOpening = !currentContent.classList.contains('is-active');

	document.querySelectorAll('.accordion-list__item').forEach(item => {
	    if (item !== currentCard) {
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
}

// 면접 후기 삭제 기능
function deleteInterviewFeedback(irId) {
	showConfirm("정말로 이 면접 후기를 삭제하시겠습니까?", "삭제된 후기는 복구할 수 없습니다.",
		() => {
			fetch('/ertds/univ/uvivfb/deleteInterviewFeedback.do', {
			           method: 'POST',
			           headers: {
			               'Content-Type': 'application/x-www-form-urlencoded',
			           },
			           body: 'irId=' + encodeURIComponent(irId)
			       })
			       .then(response => {
			           if (response.ok) {
			               return response.json();
			           }
			           throw new Error('삭제 요청이 실패했습니다.');
			       })
			       .then(data => {
			           if (data.success) {
						showConfirm2('면접 후기가 성공적으로 삭제되었습니다.',"",
							() => {
								location.reload(); // 페이지 새로고침
							}
						);
			           } else {
						showConfirm2("삭제 중 오류가 발생했습니다.","잠시 후 다시 시도해주세요.",
			   			   () => {
			   			    }
			   			);
			           }
			       })
			       .catch(error => {
			           console.error('Error:', error);
					   showConfirm2("삭제 중 오류가 발생했습니다.","잠시 후 다시 시도해주세요.",
			   			   () => {
			   			    }
			   			);
			       });
		},
		() => {
			return;
		}
	);

}

// 페이지 로드 시 모든 카드 닫힌 상태로 초기화
document.addEventListener('DOMContentLoaded', function() {
	const allContents = document.querySelectorAll('.accordion-list__item-content');
	const allHeaders = document.querySelectorAll('.accordion-list__item-header');
	const allToggles = document.querySelectorAll('.accordion-list__toggle-icon');

	allContents.forEach(content => content.classList.remove('is-active'));
	allHeaders.forEach(header => header.classList.remove('is-active'));
	allToggles.forEach(toggle => toggle.classList.remove('is-active'));
});