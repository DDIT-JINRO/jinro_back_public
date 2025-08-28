/**
 * 
 */

document.addEventListener('DOMContentLoaded', function() {
	//자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}

	// --- 모달 관련 요소 가져오기 ---
	const submitBtn = document.getElementById('submitBtn');
	const bg = document.getElementById('modalBg');
	const modal = document.getElementById('confirmModal');
	const btnCancel = document.getElementById('btnCancel');
	const btnConfirm = document.getElementById('btnConfirm');
	const detailForm = document.getElementById('detailForm');

	// '예약 확정' 버튼 클릭 -> 모달 열기
	if (submitBtn) {
		submitBtn.addEventListener('click', () => {
			const descriptionTextarea = document.querySelector('textarea[name="counselDescription"]');
			if(descriptionTextarea.value == '' || descriptionTextarea.value == null) {
				showConfirm2("신청 동기를 작성해주세요.","",
					() => {
					    return;
					}
				);
			} else {
				bg.style.display = 'block';
				modal.style.display = 'block';
				modal.focus();				
			}
		});
	}

	// 모달의 '확인' 버튼 클릭 -> 폼 전송
	if (btnConfirm) {
		btnConfirm.addEventListener('click', () => {
			detailForm.submit();
		});
	}

	// 모달 닫기 관련 이벤트 리스너
	function closeModal() {
		modal.style.display = 'none';
		bg.style.display = 'none';
	}
	btnCancel.addEventListener('click', closeModal);
	bg.addEventListener('click', closeModal);
	window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); });

})


// 자동완성 핸들러
function autoCompleteHandler() {

	const descriptionTextarea = document.querySelector('textarea[name="counselDescription"]');

	if (descriptionTextarea) {
		const sampleText = `안녕하세요, 진로 고민 때문에 상담을 신청합니다. \n앞으로 어떤 직업을 선택해야 할지 막막한 상태입니다. 제 적성에 맞는 직업을 찾고, 구체적인 진학 계획을 세우는 데 도움을 받고 싶습니다.`;

		descriptionTextarea.value = sampleText;
	}
}