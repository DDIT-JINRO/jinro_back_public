document.addEventListener('DOMContentLoaded', function() {
	// 토글 버튼
	const toggleButton = document.getElementById('accordion-toggle');
	const panel = document.getElementById('accordion-panel');

	if (toggleButton && panel) {
		toggleButton.addEventListener('click', function() {
			// is-active 클래스 토글
			this.classList.toggle('is-active');
			panel.classList.toggle('is-open');
		});
	}
});

document.addEventListener('DOMContentLoaded', function() {
	// 모든 북마크 버튼에 이벤트 리스너 추가
	const bookmarkButtons = document.querySelectorAll('.bookmark-button');

	bookmarkButtons.forEach(button => {
		button.addEventListener('click', function(event) {
			event.preventDefault(); 
			handleBookmarkToggle(this);
		});
	});
});

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll(".bookmark-item").forEach(items => {
		items.addEventListener('click', (e) => {
			const bookmarkItem = e.target.closest(".bookmark-item");
			
			const bmCategoryId = bookmarkItem.dataset.bmCategory;
			const bmTargetId   = bookmarkItem.dataset.bmTargetId;
			const jobCode      = bookmarkItem.dataset.jobCode;
			const bmTitle      = bookmarkItem.querySelector(".bookmark-title").innerText;
			
			location.href = `/mpg/mat/bmk/selectBookMarkDetail.do?bmCategoryId=${bmCategoryId}&bmTargetId=${bmTargetId}&title=${bmTitle}&jobCode=${jobCode}`;
		})
	})
});

const handleBookmarkToggle = (button) => {
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