
document.addEventListener('DOMContentLoaded', function() {

	// inq 모달창 (질문/답변 열고 닫기)
	const cardHeaders = document.querySelectorAll(".accordion-list__item-header");
	cardHeaders.forEach((cardHeader) => {
		cardHeader.addEventListener("click", function() {
			toggleCard(this);
		});
	});

	const allContents = document.querySelectorAll('.accordion-list__item-content');
	const allHeaders = document.querySelectorAll('.accordion-list__item-header');
	const allToggles = document.querySelectorAll('.accordion-list__toggle-icon');

	allContents.forEach(content => content.classList.remove('is-active'));
	allHeaders.forEach(header => header.classList.remove('is-active'));
	allToggles.forEach(toggle => toggle.classList.remove('is-active'));

	// 🔽 글 작성 버튼
	const writeBtn = document.getElementById('btnWrite');
	if (writeBtn) {
		writeBtn.addEventListener('click', function() {
			if (!memId || memId === 'anonymousUser') {
				sessionStorage.setItem("redirectUrl", location.href);
				location.href = "/login";
			} else {
				location.href = "/csc/inq/insertInq.do";
			}
		});
	}
});

function toggleCard(header) {
	const currentCard = header.closest('.accordion-list__item');
	const currentContent = currentCard.querySelector('.accordion-list__item-content');
	const currentToggle = header.querySelector('.accordion-list__toggle-icon');
	const isOpening = !currentContent.classList.contains('is-active');

	// 다른 모든 문의 아이템 닫기
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