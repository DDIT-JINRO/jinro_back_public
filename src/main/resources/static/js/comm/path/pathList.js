document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인 및 리다이렉션 로직을 함수로 분리
    function handleLoginRequiredAction(actionCallback) {
        if (!memId || memId == 'anonymousUser') {
            showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
                () => {
                    sessionStorage.setItem("redirectUrl", location.href);
                    location.href = "/login";
                },
                () => {
                    // 취소 시 아무것도 하지 않음
                }
            );
        } else {
            actionCallback();
        }
    }

    const cardList = document.querySelectorAll('.content-list__item');
    cardList.forEach(card => {
        card.addEventListener('click', function() {
            const boardId = this.dataset.tbdId;
            handleLoginRequiredAction(() => {
                location.href = '/comm/path/pathDetail.do?boardId=' + boardId;
            });
        });
    });

    const btnWrite = document.getElementById('btnWrite');
    if (btnWrite) {
        btnWrite.addEventListener('click', function() {
            handleLoginRequiredAction(() => {
                location.href = "/comm/path/pathInsert.do";
            });
        });
    }

    // 필터 및 정렬 관련 코드
    const toggleButton = document.querySelector('.search-filter__accordion-header');
    const panel = document.querySelector('.search-filter__accordion-panel');
    const allCheckboxes = document.querySelectorAll('.search-filter__option input[type="checkbox"]');
    const selectedFiltersContainer = document.querySelector('.search-filter__selected-tags');
    const resetButton = document.querySelector('.search-filter__reset-button');
    const orderByRadios = document.querySelectorAll('.search-filter__option input[type="radio"][name="sortOrder"]');
    
    // 아코디언 토글은 올바르므로 그대로 둡니다.
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            this.classList.toggle('is-active');
            panel.classList.toggle('is-open');
        });
    }

    // 선택된 필터 태그를 업데이트하는 함수
    const updateSelectedFiltersDisplay = () => {
        if (!selectedFiltersContainer) return;
        selectedFiltersContainer.innerHTML = '';

        const allFilters = Array.from(allCheckboxes).concat(Array.from(orderByRadios));

        allFilters.forEach(input => {
            if (input.checked) {
                const groupName = input.name;
                const groupLabel = (groupName === 'sortOrder') ? '정렬' : '필터'; // 그룹명에 따른 라벨 설정
                const labelText = input.nextElementSibling.textContent;

                const tagHTML = `<span class="search-filter__tag" data-name="${groupName}" data-value="${input.value}">${groupLabel} > ${labelText}<button type="button" class="search-filter__tag-remove">×</button></span>`;
                selectedFiltersContainer.insertAdjacentHTML('beforeend', tagHTML);
            }
        });
    };

    // 필터 및 정렬 input에 변경 이벤트 리스너 추가
    allCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedFiltersDisplay));
    orderByRadios.forEach(radio => radio.addEventListener('change', updateSelectedFiltersDisplay));

    // 라디오 버튼 클릭 시 선택 해제 기능
    orderByRadios.forEach(radio => {
        radio.addEventListener('click', function() {
            const currentCheckedRadio = document.querySelector('.search-filter__option input[type="radio"][name="sortOrder"][data-pre-checked="true"]');
            
            // 이전에 선택된 라디오가 현재 클릭된 라디오와 같으면
            if (currentCheckedRadio === this) {
                this.checked = false;
                this.dataset.preChecked = 'false';
                updateSelectedFiltersDisplay();
            } else {
                // 다른 라디오를 선택하면 preChecked 상태 업데이트
                if (currentCheckedRadio) {
                    currentCheckedRadio.dataset.preChecked = 'false';
                }
                this.dataset.preChecked = 'true';
            }
        });
    });

    // 선택된 필터 태그 제거 이벤트 위임
    if (selectedFiltersContainer) {
        selectedFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-filter__tag-remove')) {
                const tag = e.target.closest('.search-filter__tag');
                const tagName = tag.dataset.name;
                const tagValue = tag.dataset.value;

                const inputToUncheck = document.querySelector(`input[name="${tagName}"][value="${tagValue}"]`);
                if (inputToUncheck) {
                    inputToUncheck.checked = false;
                }
                updateSelectedFiltersDisplay();
            }
        });
    }

    // 초기화 버튼 이벤트
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            allCheckboxes.forEach(checkbox => checkbox.checked = false);
            orderByRadios.forEach(radio => {
                radio.checked = false;
                radio.dataset.preChecked = 'false';
            });
            updateSelectedFiltersDisplay();
        });
    }
    
    // 페이지 로드 시 초기 태그 표시
    updateSelectedFiltersDisplay();
});