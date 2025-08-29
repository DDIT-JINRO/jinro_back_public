document.addEventListener('DOMContentLoaded', function() {
	const channelSection = document.querySelector(".breadcrumb-container-space");
		
	if (channelSection) {
	    const errorMessage = channelSection.dataset.errorMessage;
	    const serverError = channelSection.dataset.serverError;
	    if (errorMessage) {
			showConfirm2(errorMessage,"", 
			   () => {
					history.back();
			    }
			);
			return;
		}
		if (serverError) {
			showConfirm2(serverError,"", 
			   () => {
					history.back();
			    }
			);
			return;
		}
	}

	// 필터 정렬 순서
	const filterOrder = ['jobLclCategory', 'jobSalCategory'];

	// 토글 버튼
	const toggleButton = document.querySelector('.search-filter__accordion-header');

	// 필터 패널
	const panel = document.querySelector('.search-filter__accordion-panel');

	// 필터 키워드
	const allCheckboxGroups = {
	    jobLclCategory: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="jobLcls"]'),
	    jobSalCategory: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="jobSals"]'),
	    //jobOrderBy: document.querySelectorAll('.search-filter__option input[type="checkbox"][name="sortOrder"]'),
	};

	// 선택 필터 영역
	const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');

	// 초기화 버튼
	const resetButton = document.querySelector('.search-filter__reset-button');

	// 라디오 타입의 정렬기능 input요소들
	const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');

	// 아코디언 코드
	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			this.classList.toggle('is-active');
			panel.classList.toggle('is-open');
		});
	}

	// 선택된 필터 업데이트
	const updateSelectedFiltersDisplay = () => {

        selectedFiltersContainer.innerHTML = ''

	    // 정의된 순서(filterOrder)대로 각 필터 그룹을 확인합니다.
	    filterOrder.forEach(groupName => {
	        const checkboxList = allCheckboxGroups[groupName];

	        const selectedCheckboxes = Array.from(checkboxList).filter(checkBox => checkBox.checked);

            // 선택된 모든 체크박스에 대해 반복 실행
            selectedCheckboxes.forEach(checkbox => {
                let text = checkbox.nextElementSibling.textContent;

                if (groupName === "jobSalCategory") {
                    text = "연봉 > " + text;
                } else if (groupName === "jobLclCategory") {
                    text = "직업 대분류 > " + text;
                }

				const filterTagHTML = `<span class="search-filter__tag" data-filter="${text}" data-group="${groupName}" data-value="${checkbox.value}">${text}<button type="button" class="search-filter__tag-remove">×</button></span>`;
                selectedFiltersContainer.innerHTML += filterTagHTML;
            });
	    });

		// 라디오 정렬 추가
		// 정렬 라디오
		orderByRadios.forEach(r=>{
			r.dataset.preChecked = '';
		})
		const checkedOrder = Array.from(orderByRadios).find(r => r.checked);
		if (checkedOrder) {
			checkedOrder.dataset.preChecked = 'true';
			const labelText = checkedOrder.nextElementSibling.textContent;
			const tagHTML = `<span class="search-filter__tag" data-filter="${labelText}" data-name="sortOrder" data-value="${checkedOrder.value}">정렬 > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
			selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
		}
	};

	// 체크 박스 선택 시 이벤트
	const handleCheckboxChange = () => {
		updateSelectedFiltersDisplay();
	}


    // 이벤트 등록
    Object.values(allCheckboxGroups).forEach(checkboxList => {
        checkboxList.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });
    });

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
			const filterText = tag.dataset.filter;
			const value = tag.dataset.value;
			const groupName = tag.dataset.group;

			// 연결된 체크박스 찾아서 해제
			const checkboxToUncheck = allCheckboxGroups[groupName] ? Array.from(allCheckboxGroups[groupName]).find(checkbox => checkbox.value === value) : null;
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

	document.querySelectorAll('.content-list__item').forEach(jobs => {
		jobs.addEventListener('click', (e) => {
			if (e.target.closest('.bookmark-button') || e.target.closest('.compare-button')) {
				return;
			}
			location.href = '/pse/cr/crl/selectCareerDetail.do?jobCode=' + jobs.dataset.jobId;
		});
	});
});

document.addEventListener('DOMContentLoaded', function() {

    const bookmarkButtons = document.querySelectorAll('.bookmark-button');

    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            handleBookmarkToggle(this);
        });
    });
});

const handleBookmarkToggle = (button) => {
    if (memId == "" || memId == "anonymousUser") {
		showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
			() => {},() => {}
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
        console.error('북마크 처리 중 오류 발생:', error);
		showConfirm2("오류가 발생했습니다.","잠시 후 다시 시도해주세요.", 
		   () => {
		    }
		);
    });
}

// 비교 팝업
document.addEventListener('DOMContentLoaded', function() {
	const popup = document.querySelector(".compare-popup");
	const compareListContainer = document.querySelector(".compare-popup__list");
	const closeBtn = document.querySelector(".compare-popup__close-button");
	const resetBtn = document.querySelector(".compare-popup__button--clear");
	const submitBtn = document.querySelector(".compare-popup__button--submit");
	const selectButtons = document.querySelectorAll(".compare-button input");
	const floatingBar = document.querySelector(".floating-bar");

	if (!floatingBar) return;

    const popupOpenBtn = `<button type="button" class="compare-float-button__button">비교</button>`;

    floatingBar.insertAdjacentHTML('beforeend', popupOpenBtn);

    // 기존 데이터 가져오기
    const initialCompareList = getCompareList();

    // 다시 출력
    if (Object.keys(initialCompareList).length > 0) {
        compareListContainer.innerHTML = '';
        for (const jobCode in initialCompareList) {
            const jobData = initialCompareList[jobCode];
            renderCompareItem(jobData, compareListContainer);
            const checkbox = document.querySelector(`#compare-btn${jobCode}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    }

    // 비교 체크 박스 클릭
    selectButtons.forEach(button => {
        button.addEventListener('change', function(event) {
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
	        const jobCode = target.dataset.removeItem;
	        deleteCompareCard(jobCode);
	    }
	})

    // 초기화 버튼
	resetBtn.addEventListener('click', function() {
	    const currentCompareList = getCompareList();
	    for (const jobCode in currentCompareList)  {
	        const checkbox = document.querySelector(`#compare-btn${jobCode}`);
	        if (checkbox) { checkbox.checked = false; }
	    }
	    compareListContainer.innerHTML = "";
	    sessionStorage.removeItem("jobCompareList");
	    popup.classList.remove('is-open');
	});

    // 비교 페이지 이동
	submitBtn.addEventListener('click', function() {
	    const currentCompareList = getCompareList();
	    const jobCodes = Object.keys(currentCompareList);
	    if (jobCodes.length < 2) {
			showConfirm2("비교할 직업을 2개 이상 선택해주세요.","", 
			   () => {
			    }
			);
			return;
	    }
		for (const jobCode in currentCompareList)  {
	        const checkbox = document.querySelector(`#compare-btn${jobCode}`);
	        if (checkbox) { checkbox.checked = false; }
	    }
		sessionStorage.removeItem("jobCompareList");
	    const queryString = jobCodes.map(code => `jobCodes=${code}`).join('&');
	    window.location.href = `/pse/cr/cco/careerComparisonView.do?${queryString}`;
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
    const compareList = sessionStorage.getItem('jobCompareList');
    return compareList ? JSON.parse(compareList) : {};
}

// 세션에 저장하기
const saveCompareList = (compareList) => {
    sessionStorage.setItem('jobCompareList', JSON.stringify(compareList));
}

// 비교 카드 생성하기
const createCompareCard = (button, compareListContainer) => {
	const jobData = {
	    jobCode: button.value,
	    jobName: button.dataset.jobName,
	    jobSalaly: button.dataset.jobSal,
	    jobProspect: button.dataset.jobProspect,
	    jobSatis: button.dataset.jobSatis
	}
	const compareList = getCompareList();
	if (Object.keys(compareList).length >= 5) {
		showConfirm2("직업 비교는 최대 5개 까지만 가능합니다.","", 
		   () => {
		    }
		);
	    button.checked = false;
		return;
	}
	compareList[jobData.jobCode] = jobData;
	saveCompareList(compareList);
	renderCompareItem(jobData, compareListContainer);
}

const renderCompareItem = (jobData, container) => {
	const compareItemHtml = `
	    <div class="compare-card" id="compare-card-${jobData.jobCode}" data-job-code=${jobData.jobCode}>
	        <div class="compare-card__header">
	            <h3 class="compare-card__title">${jobData.jobName}</h3>
	            <button type="button" class="compare-card__remove-button" aria-label="삭제" data-remove-item="${jobData.jobCode}">
					×
	            </button>
	        </div>
	        <div class="compare-card__metrics">
	            <div class="compare-card__metric">
	                <img src="/images/jobAverageImg.png" alt="연봉 아이콘" class="compare-card__metric-icon">
	                <div class="compare-card__metric-text">
	                    <span class="compare-card__metric-label">평균 연봉</span>
	                    <span class="compare-card__metric-value">${jobData.jobSalaly}</span>
	                </div>
	            </div>
	            <div class="compare-card__metric">
	                <img src="/images/jobProspectImg.png" alt="전망 아이콘" class="compare-card__metric-icon">
	                <div class="compare-card__metric-text">
	                    <span class="compare-card__metric-label">미래 전망</span>
	                    <span class="compare-card__metric-value">${jobData.jobProspect}</span>
	                </div>
	            </div>
	            <div class="compare-card__metric">
	                <img src="/images/jobSatisImg.png" alt="만족도 아이콘" class="compare-card__metric-icon">
	                <div class="compare-card__metric-text">
	                    <span class="compare-card__metric-label">만족도</span>
	                    <span class="compare-card__metric-value">${jobData.jobSatis}점</span>
	                </div>
	            </div>
	        </div>
	    </div>
	`;
	container.insertAdjacentHTML('beforeend', compareItemHtml);
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

    if (Object.keys(compareList).length === 0) {
        document.querySelector(".compare-popup").classList.remove('is-open');
    };
}

// 추천 직업
document.addEventListener('DOMContentLoaded', () => {
	const data = document.getElementById('goToRkJob');

	if (data) {
		data.addEventListener('click', e => {
			e.preventDefault(); // 기본 링크 이동 막기
			const url = data.getAttribute('href'); // card → data로 수정

			if (!memId || memId === 'anonymousUser') {
				// showConfirm가 로드되어 있어야 함
				if (typeof showConfirm === 'function') {
					showConfirm(
						"로그인 후 이용 가능합니다.",
						"로그인하시겠습니까?",
						() => {
							sessionStorage.setItem("redirectUrl", location.href);
							location.href = "/login";
						},
						() => { }
					);
				}
			} else {
				location.href = url;
			}
		});
	}
});
