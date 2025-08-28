/**
 *
 */

document.addEventListener('DOMContentLoaded', function(){

	// 취소 버튼 클릭 시 목록 페이지로 이동
	document.getElementById('btnCancel').addEventListener('click', function(){
		location.href = "/prg/std/stdGroupList.do";
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
				  { id: 'chatTitle', name: '채팅방 제목'  },
				  { id: 'description',name: '소개글'     },
		];
		let firstInvalid = null;

		fields.forEach(field => {
		  const el = document.getElementById(field.id);
		  if (!el.value.trim()) {
		    const group = el.closest('.form-group');
		    group.classList.add('error');

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

		const postTitle = document.getElementById('post-title').value;	// 게시글 제목
		const gender = document.getElementById('gender').value;	// 성별제한선택
		const region = document.getElementById('region').value;	// 지역선택
		const capacity = document.getElementById('capacity').value;	// 최대인원수 선택
		const interest = document.getElementById('interest').value;	// 관심사 선택
		const chatTitle = document.getElementById('chatTitle').value;	// 채팅방 제목
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

		const formEl = document.createElement('form');
		for(let [key, value] of formData.entries()){
			console.log(key);
			console.log(value);
			const input = document.createElement('input');
			input.type = "hidden";
			input.name = key;
			input.value = value;

			formEl.appendChild(input);
		}
		formEl.method = "post";
		formEl.action = "/prg/std/createStdGroup.do";
		document.body.appendChild(formEl);
		formEl.submit();
	})

	document.querySelectorAll('.custom-select').forEach(wrapper =>{
		const label   = wrapper.querySelector('.custom-select__label');
		const options = wrapper.querySelector('.custom-select__options');
		const select  = wrapper.querySelector('select');

		// 레이블 클릭 -> 옵션 토글
		label.addEventListener('click', () => {
			console.log("asdfadsfadsf");
		  	options.style.display = options.style.display === 'block' ? 'none' : 'block';
		});

		// 옵션 클릭 -> 레이블/숨은 select 업데이트
		options.querySelectorAll('li').forEach(li => {
		  li.addEventListener('click', () => {
		    label.textContent = li.textContent;
		    select.value      = li.dataset.value;
		    options.style.display = 'none';
		  });
		});

		// 바깥 클릭 시 닫기
		document.addEventListener('click', e => {
		  if (!wrapper.contains(e.target)) options.style.display = 'none';
		});
	})
	
	//자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if(autoCompleteBtn){
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}
})

// 에러메시지 삭제
function clearErrors() {
  document.querySelectorAll('.form-group.error').forEach(group => {
    group.classList.remove('error');
    const msg = group.querySelector('.error-message');
    if (msg) group.removeChild(msg);
  });
}

// 토글형 드롭다운을 업데이트하는 헬퍼함수
function updateCustomSelect(selectId, valueToSelect, textToDisplay){
	const customSelectWrapper = document.getElementById(selectId).closest('.custom-select');
	const label = customSelectWrapper.querySelector('.custom-select__label');
	const select = customSelectWrapper.querySelector('select');
	
	label.textContent = textToDisplay;
	select.value = valueToSelect;
}

// 자동완성 핸들러
function autoCompleteHandler(){
	// 텍스트 입력 필드 자동완성
	document.getElementById('post-title').value = "AI 모의 면접 스터디";
	document.getElementById('chatTitle').value = "AI 면접 같이 준비해요!";
	document.getElementById('description').value = 	`안녕하세요! AI 면접 준비를 함께 할 스터디 그룹원을 모집합니다.
	- 목표: AI 모의 면접 실전 연습 및 피드백
	- 활동 내용:
	  - 주 2회, 1시간씩 AI 면접 시뮬레이션
	  - 서로 답변 피드백 및 개선점 토의
	- 대상: AI 면접 경험이 없거나, 실전 감각을 익히고 싶은 분
	부담 없이 편하게 지원해주세요. 열정 있는 분들의 많은 참여 기다립니다!`;
	
	// 커스텀 셀렉트 자동완성
	// 성별 제한 : "성별제한 없음" (값: "all")
	updateCustomSelect('gender', 'all', '성별제한 없음');
	
	// 지역 : "대전" ( 값: "G23006") 공통코드
	updateCustomSelect('region' , 'G23006', '대전');
	
	// 인원제한 "10명" ( 값: "10")
	updateCustomSelect('capacity', '10', '10명');
	
	// 관심 분야: "취업준비" (값: "job.prepare")
	updateCustomSelect('interest', 'job.prepare', '취업준비');
}