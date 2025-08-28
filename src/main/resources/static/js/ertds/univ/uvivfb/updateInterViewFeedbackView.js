document.addEventListener("DOMContentLoaded", function() {
	const channelSection = document.querySelector(".channel");
	if (channelSection) {
	    const errorMessage = channelSection.dataset.errorMessage;
	    if (errorMessage) {
			showConfirm2(errorMessage,"", 
   			   () => {
					history.back();
   			    }
   			);
		}
	}

	document.querySelector("#submit-btn").addEventListener("click", async function() {
	    const irId = document.querySelector("#ir-id").value.trim();
	    const interviewDetail = document.querySelector("#interview-detail").value.trim();
		const interviewRating = window.getInterviewRating();
		
		if (interviewRating === 0) {
			showConfirm2("대학 평가를 선택해 주세요.", "",
			    () => {
				return;
			    }
			);
		}

		if (!interviewDetail) {
			showConfirm2("면접 후기를 입력해 주세요.","", 
			    () => {
				    return;
			    }
			);
		}
		
	    // FormData 생성
	    const formData = new FormData();
		formData.append('irId', irId)
	    formData.append('irContent', interviewDetail);
		formData.append('irRating', interviewRating);

	    try {
	        const response = await fetch("/ertds/univ/uvivfb/updateInterViewFeedback.do", {
	            method: "POST",
	            body: formData
	        });

	        if (response.ok) {
	            const result = await response.json();
	            
	            if (result.success) {
					showConfirm2("후기 수정이 완료되었습니다.", "",
					    () => {
					        window.location.href = "/ertds/univ/uvivfb/selectInterviewList.do";
					    }
					);
	                
	            } else {
					showConfirm2("수정에 실패했습니다.","", 
		   			   () => {
		   					return;
		   			    }
		   			);
	            }
	        } else {
	            throw new Error(`서버 응답 오류: ${response.status}`);
	        }
	    } catch (error) {
	        console.error("수정 중 오류:", error);
			showConfirm2("수정에 실패했습니다.","", 
   			   () => {
   					return;
   			    }
   			);
	    }
	});

	document.querySelector("#back-btn").addEventListener("click", function() {
		window.location.href = "/ertds/univ/uvivfb/selectInterviewList.do";
	});
});

// 별점 평가 기능
document.addEventListener('DOMContentLoaded', function() {
	const starRating = document.getElementById('rating');
	const ratingText = document.getElementById('rating-text');
	const stars = starRating.querySelectorAll('.rating-input__star');
    
    // 별점 설명 텍스트
    const ratingTexts = {
        0: '평가해주세요',
        1: '매우 불만족',
        2: '불만족',
        3: '보통',
        4: '만족',
        5: '매우 만족'
    };
    
	let currentRating = parseInt(starRating.dataset.rating) || 0;

	if (currentRating > 0) {
	    setRating(currentRating);
	}
    
    // 별 클릭 이벤트
	stars.forEach(star => {
	    star.addEventListener('click', function() {
	        const rating = parseInt(this.dataset.value);
	        setRating(rating);
	    });
	    star.addEventListener('mouseenter', function() {
	        const rating = parseInt(this.dataset.value);
	        highlightStars(rating, true);
	        updateRatingText(rating, true);
	    });
	});
    
    // 별점 컨테이너에서 마우스가 나갔을 때
    starRating.addEventListener('mouseleave', function() {
        highlightStars(currentRating, false);
        updateRatingText(currentRating, false);
    });
    
    // 별점 설정 함수
    function setRating(rating) {
        currentRating = rating;
        starRating.dataset.rating = rating;
        highlightStars(rating, false);
        updateRatingText(rating, false);
    }
    
    // 별 하이라이트 함수
	function highlightStars(rating, isHover) {
	    stars.forEach((star, index) => {
	        star.classList.remove('is-active', 'is-hover');
	        if (index < rating) {
	            star.classList.add(isHover ? 'is-hover' : 'is-active');
	        }
	    });
	}
    
    // 평가 텍스트 업데이트 함수
    function updateRatingText(rating, isHover) {
        ratingText.textContent = ratingTexts[rating];
        
		if (rating > 0) {
		    ratingText.classList.add('is-selected');
		} else {
		    ratingText.classList.remove('is-selected');
		}
    }
    
    // 별점 값을 가져오는 함수 (폼 제출 시 사용)
    window.getInterviewRating = function() {
        return parseInt(currentRating) || 0;
    };
});

// textarea 글자수 카운터 기능
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('interview-detail');
    const maxLength = 300; // 최대 글자수 설정
    
    // 글자수 카운터 HTML 생성
    const counterHTML = `
        <div class="char-counter">
            <span class="char-counter__current">0</span><span class="unit">자</span>
            <span class="separator">/</span>
            <span>최대&nbsp;</span><span class="max-count">${maxLength}</span><span class="unit">자</span>
        </div>
    `;
    
    // textarea 부모 요소에 textarea-container 클래스 추가
    const parentDiv = textarea.closest('.input-group--textarea');
	if (parentDiv) {
	      parentDiv.insertAdjacentHTML('beforeend', counterHTML);
	}
    
    // 글자수 카운터 요소들 선택
    const counter = parentDiv.querySelector('.char-counter');
	const currentCount = counter.querySelector('.char-counter__current');
    
    // 글자수 업데이트 함수
	function updateCounter() {
	    const currentLength = textarea.value.length;
	    currentCount.textContent = currentLength;
	}
    
    // 이벤트 리스너 등록
	textarea.addEventListener('input', updateCounter);
	textarea.addEventListener('paste', () => setTimeout(updateCounter, 10));
	updateCounter();
});