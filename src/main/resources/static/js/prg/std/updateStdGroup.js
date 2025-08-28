/**
 *
 */

document.addEventListener('DOMContentLoaded', function(){

	// 취소 버튼 클릭 시 목록 페이지로 이동
	document.getElementById('btnCancel').addEventListener('click', function(){
		const boardId = document.querySelector('.study-post-wrapper').dataset.boardId;
		location.href = "/prg/std/stdGroupDetail.do?stdGroupId="+boardId;
	})

	// 작성 완료 후 전송 버튼
	document.getElementById('btnSubmit').addEventListener('click', function(){
		clearErrors();                // 이전 에러 초기화
		const fields = [
				  { id: 'post-title', name: '게시글 제목' },
				  { id: 'gender',     name: '성별 제한'   },
				  { id: 'region',     name: '지역 선택'   },
				  { id: 'capacity',   name: '인원 제한'   },
				  { id: 'interest',   name: '관심 분야'   },
				  { id: 'chat-title', name: '채팅방 제목'  },
				  { id: 'description',name: '소개글'     },
		];
		let firstInvalid = null;

		fields.forEach(field => {
		  const el = document.getElementById(field.id);
		  if (!el.value.trim()) {
		    const group = el.closest('.form-group');
		    el.classList.add('error');

		    // 에러 메시지 추가
		    if (!group.querySelector('.error-message')) {
		      const msg = document.createElement('span');
		      msg.className = 'error-message';
		      msg.textContent = `${field.name}을(를) 입력해주세요.`;
		      group.appendChild(msg);
		    }

		    if (!firstInvalid) firstInvalid = el;
		  }
		});

		if (firstInvalid) {
		  firstInvalid.focus();
		  return false;               // 유효성 에러 있으므로 제출 취소
		}
		const boardId = document.querySelector('.study-post-wrapper').dataset.boardId;	//수정할 게시글 제목
		const crId = document.querySelector('.study-post-wrapper').dataset.crId;
		const postTitle = document.getElementById('post-title').value;	// 게시글 제목
		const gender = document.getElementById('gender').value;	// 성별제한선택
		const region = document.getElementById('region').value;	// 지역선택
		const capacity = document.getElementById('capacity').value;	// 최대인원수 선택
		const interest = document.getElementById('interest').value;	// 관심사 선택
		const chatTitle = document.getElementById('chat-title').value;	// 채팅방 제목
		const description = document.getElementById('description').value;	// 소개글
		// 서버의 VO와 맞춤
		const boardContent = {
			gender : gender,
			region : region,
			maxPeople : capacity,
			interest : interest,
			content : description,
		};
		const formData = new FormData();
		formData.append("boardTitle", postTitle);
		formData.append("boardContent", JSON.stringify(boardContent));
		formData.append("memId", memId);
		formData.append("ccId", "G09005");
		formData.append("chatTitle", chatTitle);
		formData.append('boardId',boardId);
		formData.append('boardCnt',crId);

		const formEl = document.createElement('form');
		for(let [key, value] of formData.entries()){
			const input = document.createElement('input');
			input.type = "hidden";
			input.name = key;
			input.value = value;

			formEl.appendChild(input);
		}
		formEl.method = "post";
		formEl.action = "/prg/std/updateStdBoardAct.do";
		document.body.appendChild(formEl);
		formEl.submit();
	})

	document.querySelectorAll('.custom-select').forEach(wrapper =>{
		if(wrapper.classList.contains('custom-select--disabled')) return;
		const label   = wrapper.querySelector('.custom-select__label');
		const options = wrapper.querySelector('.custom-select__options');
		const select  = wrapper.querySelector('select');

		// 레이블 클릭 -> 옵션 토글

		label.addEventListener('click', () => {
		  	options.style.display = options.style.display === 'block' ? 'none' : 'block';
		});

		// 옵션 클릭 -> 레이블/숨은 select 업데이트
		options.querySelectorAll('li').forEach(li => {
		  li.addEventListener('click', () => {
			if(!li.dataset.disabled){
			    label.textContent = li.textContent;
			    select.value      = li.dataset.value;
			    options.style.display = 'none';
			}
		  });
		});

		// 바깥 클릭 시 닫기
		document.addEventListener('click', e => {
		  if (!wrapper.contains(e.target)) options.style.display = 'none';
		});
	})
})

// 에러메시지 삭제
function clearErrors() {
  document.querySelectorAll('.form-group.error').forEach(group => {
    group.classList.remove('error');
    const msg = group.querySelector('.error-message');
    if (msg) group.removeChild(msg);
  });

}