
// FAQ 모달창
document.addEventListener('DOMContentLoaded', function() {
	const cardHeaders = document.querySelectorAll(".accordion-list__item-header");
	cardHeaders.forEach((cardHeader) => {
		cardHeader.addEventListener("click", function() {
			toggleCard(this);
		});
	});

	// 페이지 로드 시 모든 카드 닫힌 상태로 초기화
	const allContents = document.querySelectorAll('.accordion-list__item-content');
	const allHeaders = document.querySelectorAll('.accordion-list__item-header');
	const allToggles = document.querySelectorAll('.accordion-list__toggle-icon');

	allContents.forEach(content => content.classList.remove('is-active'));
	allHeaders.forEach(header => header.classList.remove('is-active'));
	allToggles.forEach(toggle => toggle.classList.remove('is-active'));
});

function toggleCard(header) {
	const currentCard = header.closest('.accordion-list__item');
	const currentContent = currentCard.querySelector('.accordion-list__item-content');
	const currentToggle = header.querySelector('.accordion-list__toggle-icon');
	const isOpening = !currentContent.classList.contains('is-active');

	// 다른 모든 FAQ 아이템 닫기
	document.querySelectorAll('.accordion-list__item').forEach(item => {
		if (item !== currentCard) {
			item.querySelector('.accordion-list__item-content').classList.remove('is-active');
			item.querySelector('.accordion-list__item-header').classList.remove('is-active');
			item.querySelector('.accordion-list__toggle-icon').classList.remove('is-active');
		}
	});

	// 현재 아이템 토글
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

//id="goToInq"
document.addEventListener("DOMContentLoaded", () => {
    const goToInq = document.getElementById("goToInq");

    if (goToInq) {
        goToInq.addEventListener("click", (e) => {
            if (!memId || memId === 'anonymousUser') {
                e.preventDefault(); // 링크 기본 이동 막기
                showConfirm(
                    "로그인 후 이용 가능합니다.",
                    "로그인하시겠습니까?",
                    () => {
                        sessionStorage.setItem("redirectUrl", location.href);
                        location.href = "/login"; // 확인 시 로그인 페이지로 이동
                    },
                    () => {
                        // 취소 시 아무 동작 안 함
                    }
                );
            }
            // 로그인 상태면 기본 링크 (/csc/inq/inqryList.do)로 이동
        });
    }
});