let selectedInterviewType = 'saved';
let questionList = [];

/**
 * 서버에서 개인 질문 리스트를 가져오는 함수
 */
function loadCustomQuestionList() {
    const select = document.getElementById('questionSelect');
    
    if(!memId || memId =='anonymousUser') {
        return;
    }
    
    // 로딩 상태 표시
    select.classList.add('loading');
    select.innerHTML = '<option value="" disabled selected class="loading-text">질문 리스트를 불러오는 중...</option>';
    
    // AJAX 요청
    fetch('/cdp/imtintrvw/aiimtintrvw/getCustomQuestionList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        questionList = data;
        populateQuestionSelect(data, 'custom');
        select.classList.remove('loading');
    })
    .catch(error => {
        console.error('질문 리스트 로딩 오류:', error);
        select.classList.remove('loading');
        select.innerHTML = '<option value="" disabled selected>질문 리스트를 불러올 수 없습니다. 새로고침 후 다시 시도해주세요.</option>';
        updateStartButton();
    });
}

/**
 * 업종별 질문 리스트를 가져오는 함수
 */
function loadIndustryList() {
    const select = document.getElementById('questionSelect');
    
    if(!memId || memId =='anonymousUser') {
        return;
    }
    
    // 로딩 상태 표시
    select.classList.add('loading');
    select.innerHTML = '<option value="" disabled selected class="loading-text">업종 리스트를 불러오는 중...</option>';
    
    // AJAX 요청
    fetch('/cdp/imtintrvw/aiimtintrvw/getIndustryList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        questionList = data;
        populateQuestionSelect(data, 'industry');
        select.classList.remove('loading');
    })
    .catch(error => {
        console.error('업종 리스트 로딩 오류:', error);
        select.classList.remove('loading');
        select.innerHTML = '<option value="" disabled selected>업종 리스트를 불러올 수 없습니다. 새로고침 후 다시 시도해주세요.</option>';
        updateStartButton();
    });
}

/**
 * Select 옵션 채우기 (placeholder 문제 해결)
 * @param {Array} data - 질문 데이터
 * @param {string} type - 타입 ('custom' | 'industry')
 */
function populateQuestionSelect(data, type) {
    const select = document.getElementById('questionSelect');
    
    // 현재 선택값 저장 (있다면)
    const currentValue = select.value;
    
    // placeholder 텍스트 결정
    const placeholder = type === 'industry' ? '업종을 선택하세요.' : '면접 질문 리스트를 선택하세요.';
    
    // 기존 옵션 모두 제거
    select.innerHTML = '';
    
    // placeholder 옵션 추가 (항상 첫 번째)
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);
    
    // 데이터가 없는 경우
    if (!data || data.length === 0) {
        const noDataText = type === 'industry' ? '등록된 업종이 없습니다.' : '등록된 질문 리스트가 없습니다.';
        placeholderOption.textContent = noDataText;
        placeholderOption.classList.add('no-data');
        
        select.value = '';
        updateStartButton();
        return;
    }
    
    // 데이터로 옵션 생성
    data.forEach(item => {
        const option = document.createElement('option');
        
        if (type === 'industry') {
            option.value = item.iqGubun;
            option.textContent = item.industryName;
        } else {
            option.value = item.idlId;
            option.textContent = item.idlTitle;
            
            if (item.questionCount) {
                option.textContent += ` (${item.questionCount}개 질문)`;
            }
        }
        
        select.appendChild(option);
    });
    
    // 이전에 선택된 값이 새 데이터에 있다면 복원, 없다면 placeholder 유지
    if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
        select.value = currentValue;
    } else {
        select.selectedIndex = 0;
        select.value = '';
    }
    
    updateStartButton();
}

/**
 * 면접 타입에 따른 질문 리스트 업데이트
 * @param {string} type - 면접 타입 ('saved' | 'random')
 */
function updateQuestionListByType(type) {    
    selectedInterviewType = type;
    const select = document.getElementById('questionSelect');
    const sectionTitle = document.querySelector('.section-title');
    
    // 현재 선택값 초기화
    select.value = '';
    select.selectedIndex = 0;
    
    if (type === 'random') {
        select.disabled = false;
        sectionTitle.textContent = '업종 선택';
        loadIndustryList();
    } else {
        select.disabled = false;
        sectionTitle.textContent = '사용 질문 리스트';
        loadCustomQuestionList();
    }
    
    updateStartButton();
}

/**
 * 모든 체크박스가 체크되었는지 확인하는 함수
 * @returns {boolean} 모든 체크박스가 체크되었는지 여부
 */
function checkAllChecked() {
    const checkboxes = document.querySelectorAll('.checkbox');
    let allChecked = true;
    
    checkboxes.forEach(function(checkbox) {
        if (!checkbox.classList.contains('checked')) {
            allChecked = false;
        }
    });
    
    return allChecked;
}

/**
 * 질문 리스트가 선택되었는지 확인하는 함수
 * @returns {boolean} 질문이 선택되었는지 여부
 */
function checkQuestionListSelected() {
    const select = document.getElementById('questionSelect');
    const selectedValue = select.value;
    
    const isSelected = selectedValue && selectedValue.trim() !== '';
    
    return isSelected && !select.disabled;
}

/**
 * 시작 버튼 상태 업데이트 함수
 */
function updateStartButton() {
    const button = document.getElementById('startButton');
    const allChecked = checkAllChecked();
    const questionSelected = checkQuestionListSelected();
        
    if (allChecked && questionSelected) {
        button.classList.remove('disabled');
        button.disabled = false;
    } else {
        button.classList.add('disabled');
        button.disabled = true;
    }
}

/**
 * 면접 설정 검증 함수
 * @param {string} selectedValue - 선택된 값
 * @returns {Promise} 검증 결과
 */
function validateInterviewSettings(selectedValue) {
    return new Promise((resolve, reject) => {
        
        const params = new URLSearchParams({
            type: selectedInterviewType
        });
        
        if (selectedInterviewType === 'saved') {
            if (!selectedValue) {
                reject(new Error('질문 리스트를 선택해주세요.'));
                return;
            }
            params.append('questionListId', selectedValue);
        } else {
            if (!selectedValue) {
                reject(new Error('업종을 선택해주세요.'));
                return;
            }
            params.append('industryCode', selectedValue);
            params.append('questionCount', '10');
        }
        
        let url = "/cdp/imtintrvw/aiimtintrvw/getInterviewQuestions?" + params.toString();
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.questions && data.questions.length > 0) {
                resolve({
                    type: selectedInterviewType,
                    selectedValue: selectedValue,
                    totalCount: data.totalCount
                });
            } else {
                reject(new Error(data.message || '질문 데이터가 없습니다.'));
            }
        })
        .catch(error => {
            console.error('❌ 검증 실패:', error);
            reject(error);
        });
    });
}

/**
 * 모의면접 시작 함수
 */
function startMockInterview() {
    // 버튼이 비활성화 상태면 실행하지 않음
    if (document.getElementById('startButton').classList.contains('disabled')) {
        return;
    }
    
    const select = document.getElementById('questionSelect');
    const selectedValue = select.value;
        
    const button = document.getElementById('startButton');
    const spinner = document.getElementById('loadingSpinner');
    
    // 버튼 로딩 상태로 변경
    button.disabled = true;
    button.style.opacity = '0.7';
    spinner.style.display = 'block';
    
    // 미디어 장치 확인
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showConfirm2('이 브라우저는 카메라/마이크 기능을 지원하지 않습니다.', " 최신 브라우저를 사용해주세요.", () => {
            resetButton();
        });
        return;
    }
    
    // 카메라/마이크 권한 확인
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            // 권한 허용됨 - 스트림 정리
            stream.getTracks().forEach(track => track.stop());
            
            // 간단한 설정 검증 후 팝업 열기
            validateInterviewSettings(selectedValue)
                .then(interviewSettings => {
                    openMockInterviewPopup(interviewSettings);
                    // 정상적으로 팝업 오픈 후에 로그찍기
                    axios.post('/admin/las/aiImitaionInterviewVisitLog.do');
                })
                .catch(error => {
                    console.error('❌ 면접 설정 검증 실패:', error);
                    showConfirm2("면접 설정을 확인할 수 없습니다.", "", () => {
                        // 필요시 UI 처리
                    });
                    resetButton();
                });
        })
        .catch(function(error) {
            console.error('미디어 장치 접근 오류:', error);
            
            let errorMessage1 = '카메라와 마이크 접근 권한이 필요합니다.\n\n';
            let errorMessage2 = "";
            if (error.name === 'NotAllowedError') {
                errorMessage2 += '브라우저에서 카메라/마이크 권한을 허용해주세요.';
            } else if (error.name === 'NotFoundError') {
                errorMessage2 += '카메라 또는 마이크가 연결되어 있지 않습니다.';
            } else if (error.name === 'NotReadableError') {
                errorMessage2 += '카메라 또는 마이크가 다른 애플리케이션에서 사용 중입니다.';
            } else {
                errorMessage2 += '미디어 장치에 접근할 수 없습니다.';
            }
            showConfirm2(errorMessage1, errorMessage2, () => {
                resetButton();
            });
        });
}

/**
 * Mock Interview 팝업 열기
 * @param {Object} interviewSettings - 면접 설정 정보
 */
function openMockInterviewPopup(interviewSettings) {
    try {
        // React 애플리케이션 URL 생성
        let popupUrl = FRONT_URL +'/mock-interview';
        const params = new URLSearchParams({
            type: interviewSettings.type,
            totalCount: interviewSettings.totalCount
        });
        
        if (interviewSettings.type === 'saved') {
            params.append('questionListId', interviewSettings.selectedValue);
        } else {
            params.append('industryCode', interviewSettings.selectedValue);
            params.append('questionCount', '10');
        }
        
        popupUrl += '?' + params.toString();
        
        // 팝업 창 열기
        const popup = window.open(
            popupUrl,
            'mockInterview',
            'width=1400,height=900,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no'
        );
        
        if (!popup) {
            showConfirm2('팝업이 차단되었습니다.', "팝업 차단을 해제한 후 다시 시도해주세요.", () => {
                resetButton();
            });
            return;
        }
        
        popup.focus();
        
        // 팝업 창 모니터링
        const checkClosed = setInterval(function() {
            if (popup.closed) {
                clearInterval(checkClosed);
                resetButton();
            }
        }, 1000);
        
        resetButton();
        
    } catch (error) {
        console.error('❌ 팝업 열기 실패:', error);
        showConfirm2("면접을 시작할 수 없습니다.", "다시 시도해주세요.", () => {
            // 필요시 UI 처리
        });
        resetButton();
    }
}

/**
 * 버튼 상태 리셋 함수
 */
function resetButton() {
    const button = document.getElementById('startButton');
    const spinner = document.getElementById('loadingSpinner');
    
    updateStartButton();
    button.style.opacity = '1';
    spinner.style.display = 'none';
}

/**
 * 이벤트 리스너 초기화 함수
 */
function initializeEventListeners() {    
    // 체크박스 클릭 이벤트
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            if (this.classList.contains('checked')) {
                this.classList.remove('checked');
            } else {
                this.classList.add('checked');
            }
            
            updateStartButton();
        });
    });
    
    // 태그 클릭 이벤트
    const tags = document.querySelectorAll('.tag');
    tags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                return;
            }
            
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            updateQuestionListByType(type);
        });
    });
    
    // Select 변경 이벤트
    const questionSelect = document.getElementById('questionSelect');
    if (questionSelect) {
        questionSelect.addEventListener('change', function() {
            updateStartButton();
        });
    }
}

/**
 * 페이지 초기화 함수
 */
function initializeAiInterviewPage() {    
    // 미디어 장치 지원 여부 확인
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const button = document.getElementById('startButton');
        if (button) {
            button.disabled = true;
            button.querySelector('.start-button-text').innerHTML = '이 브라우저는 모의면접을 지원하지 않습니다';
            button.style.background = '#6b7280';
            button.style.cursor = 'not-allowed';
        }
        return;
    }
    
    loadCustomQuestionList();
    updateStartButton();
    initializeEventListeners();
}

// DOM 로드 완료 시 초기화 실행
document.addEventListener('DOMContentLoaded', initializeAiInterviewPage);