document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.querySelector('.search-filter__accordion-header');

	// 필터 패널
	const panel = document.querySelector('.search-filter__accordion-panel');

	// 필터 키워드
	const allCheckboxGroups = {
	    lClassIds: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="lClassIds"]'),
	};

	const allRadioGroups = {
		sortOrder: document.querySelectorAll('.search-filter__option input[name="sortOrder"]')
	};

	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');

	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');

	// 정렬 라디오
	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 디테일 페이지로 이동
	document.querySelectorAll('.content-list__item').forEach(dept => {
		dept.addEventListener('click', (e) => {
			// 북마크 버튼 눌렀을 때에는 디테일 페이지로 넘어가지 않도록 방지
			if (e.target.closest('.bookmark-button') || e.target.closest('.compare-button')) {
				return;
			}
			location.href = '/ertds/univ/dpsrch/selectDetail.do?uddId=' + dept.dataset.univdeptId;
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

	        selectedCheckboxes.forEach(checkbox => {
	            const labelText = checkbox.nextElementSibling.textContent;
	            let groupLabel = '계열';

	            const tagHTML = `<span class="search-filter__tag" data-group="${groupName}" data-value="${checkbox.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
	            selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
	        });

			// 정렬 라디오
			orderByRadios.forEach(r=>{
				r.dataset.preChecked = '';
			})
			const checkedOrder = Array.from(orderByRadios).find(r => r.checked);
			if (checkedOrder) {
				checkedOrder.dataset.preChecked = 'true';
				const labelText = checkedOrder.nextElementSibling.textContent;
				const tagHTML = `<span class="search-filter__tag" data-name="sortOrder" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
				selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
			}

	    });
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


	Object.values(allCheckboxGroups).forEach(checkboxList => {
	    checkboxList.forEach(checkbox => {
	        checkbox.addEventListener('change', updateSelectedFiltersDisplay);
	    });
	});

	// '선택된 필터' 영역에서 X 버튼 클릭 시 이벤트 처리 (이벤트 위임)
	selectedFiltersContainer.addEventListener('click', (e) => {
		if (e.target.classList.contains('search-filter__tag-remove')) {
			const tag = e.target.closest('.search-filter__tag');
			const groupName = tag.dataset.group || '' ;
	        const value = tag.dataset.value;

			if(tag.dataset.name == 'sortOrder'){
				orderByRadios.forEach(r => {
					if(r.value == value){
						r.dataset.preChecked = '';
						r.checked = false;
					}
				})
				tag.remove();
				return;
			}

	        const checkboxToUncheck = Array.from(allCheckboxGroups[groupName]).find(checkbox => checkbox.value === value);

	        if (checkboxToUncheck) {
	            checkboxToUncheck.checked = false;
	        }

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
			orderByRadios.forEach(r =>{r.checked = false})

			updateSelectedFiltersDisplay();
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
		showConfirm("로그인 후 이용 가능합니다.","로그인하시겠습니까?", 
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

// 비교 팝업
document.addEventListener('DOMContentLoaded', function() {
	const popup = document.querySelector(".compare-popup--dept");
	const compareListContainer = document.querySelector(".compare-popup__list");
	const closeBtn = document.querySelector(".compare-popup__close-button");
	const resetBtn = document.querySelector(".compare-popup__button--clear");
	const submitBtn = document.querySelector(".compare-popup__button--submit");
	const selectButtons = document.querySelectorAll(".compare-button input");

    // 기존 데이터 가져오기
    const initialCompareList = getCompareList();

    // 다시 출력
    if (Object.keys(initialCompareList).length > 0) {
        compareListContainer.innerHTML = '';
        for (const uddId in initialCompareList) {
            const deptData = initialCompareList[uddId];
            renderCompareItem(deptData, compareListContainer);
            const checkbox = document.querySelector(`#compare-btn${uddId}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    }
	
	updateCompareButtonState();

    // 비교 체크 박스 클릭
    selectButtons.forEach(button => {
        button.addEventListener('change', function(event) {
			event.preventDefault();
            if (event.target.checked) {
                createCompareCard(this, compareListContainer);
            } else {
                deleteCompareCard(this.value);
            }
        });
    })

    // 팝업 닫기
    closeBtn.addEventListener('click', function() {
        popup.classList.remove('is-open');
    });

    // 직업 카드 삭제
    compareListContainer.addEventListener('click', function(event) {
        const target = event.target.closest(".compare-card__remove-button");
        if (target) {
            const uddId = target.dataset.removeItem;
            deleteCompareCard(uddId);
        }
    })

    // 초기화 버튼
    resetBtn.addEventListener('click', function() {
        const currentCompareList = getCompareList();
        for (const uddId in currentCompareList)  {
            const checkbox = document.querySelector(`#compare-btn${uddId}`);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
        compareListContainer.innerHTML = "";
        sessionStorage.removeItem("deptCompareList");
        popup.classList.remove('is-open');
    });

    // 비교 페이지 이동
    submitBtn.addEventListener('click', function() {
        const currentCompareList = getCompareList();
        const uddIds = Object.keys(currentCompareList);

        if (uddIds.length < 2) {
			showConfirm2("비교할 학과를 2개 이상 선택해주세요.","",
				() => {
				}
			);
			return;
        }

		for (const uddId in currentCompareList)  {
            const checkbox = document.querySelector(`#compare-btn${uddId}`);
            if (checkbox) {
                checkbox.checked = false;
            }
        }

		sessionStorage.removeItem("deptCompareList");
        const queryString = uddIds.map(id => `uddIds=${id}`).join('&');
        window.location.href = `/ertds/univ/dpsrch/selectCompare.do?${queryString}`;
    });

    // 팝업 열기 버튼
    document.addEventListener('click', function(event) {
        const target = event.target.closest(".compare-float-button__button");

        if (target) {
            popup.classList.add('is-open');
        }
    })
});

// 세션에 비교 목록 가져오기
const getCompareList = () => {
    const compareList = sessionStorage.getItem('deptCompareList');
    return compareList ? JSON.parse(compareList) : {};
}

// 세션에 저장하기
const saveCompareList = (compareList) => {
    sessionStorage.setItem('deptCompareList', JSON.stringify(compareList));
}

const updateCompareButtonState = () => {
    const floatingBar = document.querySelector(".floating-bar");
    if (!floatingBar) return;

    const compareList = getCompareList();
    const count = Object.keys(compareList).length;
    let compareButton = document.querySelector(".compare-float-button__button");

    if (count > 0) {
        if (!compareButton) {
            const popupOpenBtnHTML = `
                <button type="button" class="floating-bar__button compare-float-button__button">
                    비교
                    <span id="deptCompareBtn" class="compare-float-button__badge">${count}</span>
                </button>
            `;
            floatingBar.insertAdjacentHTML('beforeend', popupOpenBtnHTML);
        } else {
		    const badge = compareButton.querySelector('.compare-float-button__badge');
            if (badge) {
                badge.textContent = count;
            }
        }
    } else {
        if (compareButton) {
            compareButton.classList.add('is-hiding');
			
			setTimeout(() => {
			    compareButton.remove();
			}, 400);
        }
    }
};

// 비교 카드 생성하기
const createCompareCard = (button, compareListContainer) => {
    const deptData = {
        uddId: button.value,
        deptName: button.dataset.deptName,
        deptSalary: button.dataset.deptSal,
        deptEmp: button.dataset.deptEmp,
        deptAdmission: button.dataset.deptAdmission
    }

    const compareList = getCompareList();

    if (Object.keys(compareList).length >= 5) {
       
		showConfirm2("학과 비교는 최대 5개 까지만 가능합니다.","",
			() => {
			}
		);
        button.checked = false;
		return;
    }

    compareList[deptData.uddId] = deptData;
    saveCompareList(compareList);
    renderCompareItem(deptData, compareListContainer);
	updateCompareButtonState();
}

const renderCompareItem = (deptData, container) => {
	const compareItemHtml = `
	    <div class="compare-card" id="compare-card-${deptData.uddId}" data-dept-id="${deptData.uddId}">
	        <div class="compare-card__header">
	            <h3 class="compare-card__title">${deptData.deptName}</h3>
	            <button type="button" class="compare-card__remove-button" aria-label="삭제" data-remove-item="${deptData.uddId}">×</button>
	        </div>
	        <div class="compare-card__metrics">
	            <div class="compare-card__metric">
	                <span class="compare-card__metric-label">입학경쟁률</span>
	                <span class="compare-card__metric-value">${deptData.deptAdmission}</span>
	            </div>
	            <div class="compare-card__metric">
	                <span class="compare-card__metric-label">취업률</span>
	                <span class="compare-card__metric-value">${deptData.deptEmp}%</span>
	            </div>
	            <div class="compare-card__metric">
	                <span class="compare-card__metric-label">첫월급 평균</span>
	                <span class="compare-card__metric-value">${deptData.deptSalary}만원</span>
	            </div>
	        </div>
	    </div>
	`;
    container.innerHTML += compareItemHtml;
}

const deleteCompareCard = (itemId) => {
    const removeItem = document.querySelector(`#compare-card-${itemId}`);
    if (removeItem) {
        removeItem.remove();
    }

    const removeItemCheckbox = document.querySelector(`#compare-btn${itemId}`);
    if (removeItemCheckbox) {
        removeItemCheckbox.checked = false;
    }

    const compareList = getCompareList();
    delete compareList[itemId];
    saveCompareList(compareList);
	updateCompareButtonState();

    if (Object.keys(compareList).length === 0) {
        document.querySelector(".compare-popup--dept").classList.remove('is-open');
    };
}