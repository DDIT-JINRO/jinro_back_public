document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 가져오기
    const deptSearchInput = document.getElementById('deptSearchInput');
    const deptSearchBtn = document.getElementById('deptSearchBtn');
    const deptListContainer = document.getElementById('deptListContainer');

    // 검색 함수
    function searchDepartments() {
        const searchTerm = deptSearchInput.value.toLowerCase().trim();
        const deptItems = deptListContainer.querySelectorAll('.dept-item');
        let visibleCount = 0;

        // 각 학과 아이템에 대해 검색 수행
        deptItems.forEach(item => {
            const deptName = item.dataset.deptName.toLowerCase();

            if (searchTerm === '' || deptName.includes(searchTerm)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // 검색 결과가 없을 때 메시지 표시/숨김
        handleSearchResults(visibleCount, searchTerm);
        
        // 검색 후 경쟁률 비교 다시 처리
        processCompetitionRates();
    }

    // 검색 결과 메시지 처리 함수
    function handleSearchResults(visibleCount, searchTerm) {
        let noResultsMessage = deptListContainer.querySelector('.no-search-results');

        if (visibleCount === 0 && searchTerm !== '') {
            // 검색 결과가 없을 때 메시지 생성/표시
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-search-results no-data-message search-no-result';
                noResultsMessage.innerHTML = `<p>"${deptSearchInput.value}"에 대한 검색 결과가 없습니다.</p>`;
                deptListContainer.appendChild(noResultsMessage);
            } else {
                noResultsMessage.innerHTML = `<p>"${deptSearchInput.value}"에 대한 검색 결과가 없습니다.</p>`;
            }
            noResultsMessage.style.display = 'block';
        } else {
            // 검색 결과가 있을 때 메시지 숨김
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
        }
    }

    // 검색 이벤트 리스너 등록
    function initializeSearchListeners() {
        // 검색 버튼 클릭 이벤트
        if (deptSearchBtn) {
            deptSearchBtn.addEventListener('click', searchDepartments);
        }

        if (deptSearchInput) {
            // 엔터키 이벤트
            deptSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    searchDepartments();
                }
            });

            // 검색창 포커스 시 전체 텍스트 선택
            deptSearchInput.addEventListener('focus', function() {
                this.select();
            });
        }
    }

    // 북마크 기능 초기화
    document.querySelectorAll('.bookmark-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            handleBookmarkToggle(this);
        });
    });
	
	// 학과 아이템 클릭 이벤트 (전체 행 클릭 가능)
	document.querySelectorAll('.dept-item.clickable-item').forEach(item => {
        // 커서 스타일 추가
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function(e) {
            const href = this.dataset.href;
            
            if (href) {
                window.location.href = href;
            }
        });
        
        // 호버 효과 추가
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // 초기화 함수들 실행
    initializeSearchListeners();
	processCompetitionRates();

    // 페이지 로드 완료 시 검색창에 포커스 (선택사항)
    if (deptSearchInput) {
        // 약간의 지연을 두어 다른 스크립트와의 충돌 방지
        setTimeout(() => {
            deptSearchInput.focus();
        }, 500);
    }
});

// 북마크 토글 함수
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
    const isBookmarked = button.classList.contains('active');

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
            button.classList.toggle('active');
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
};

// 경쟁률 비교 처리 함수
function processCompetitionRates() {
    const competitionItems = document.querySelectorAll('.dept-competition .value-comparison');
    
    competitionItems.forEach(item => {
        const currentValueSpan = item.querySelector('.current-value');
        const avgValueSpan = item.querySelector('.avg-value');
        
        if (!currentValueSpan || !avgValueSpan) return;
        
        // 원본 텍스트 저장 (data attribute 사용)
        let originalText = currentValueSpan.dataset.originalValue;
        if (!originalText) {
            originalText = currentValueSpan.textContent.trim().replace(/\s*[↑↓]\s*$/, ''); // 기존 화살표 제거
            currentValueSpan.dataset.originalValue = originalText; // 원본 저장
        }
        
        const avgText = avgValueSpan.textContent.trim();
        
        const currentRate = extractCompetitionRate(originalText);
        const avgRate = extractCompetitionRate(avgText);
        
        if (currentRate !== null && avgRate !== null) {
            // 기존 클래스 제거
            currentValueSpan.classList.remove('higher', 'lower', 'equal');
            
            // 비교 및 클래스 적용
            if (currentRate > avgRate) {
                currentValueSpan.classList.add('higher');
                currentValueSpan.textContent = originalText + ' ↑';
            } else if (currentRate < avgRate) {
                currentValueSpan.classList.add('lower');
                currentValueSpan.textContent = originalText + ' ↓';
            } else {
                currentValueSpan.classList.add('equal');
                currentValueSpan.textContent = originalText;
            }
        }
    });
}

// 경쟁률 문자열에서 숫자 추출하는 함수
function extractCompetitionRate(text) {
    // 괄호 제거하고 숫자:1 패턴에서 숫자 부분 추출
    const cleanText = text.replace(/[()]/g, '');
    const match = cleanText.match(/(\d+\.?\d*)\s*:\s*1/);
    
    if (match && match[1]) {
        return parseFloat(match[1]);
    }
    
    return null;
}

// 유틸리티 함수들
const utils = {
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 요소가 화면에 보이는지 확인
    isElementInViewport: function(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 부드러운 스크롤
    smoothScrollTo: function(element, duration = 300) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};