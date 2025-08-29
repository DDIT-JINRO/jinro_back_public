/**
 * 헤더의 알림 모달을 컨트롤 하기 위한 js
 */
// 비정상적인 종료 같은 상황시에 eventSource를 해제할 수 있도록 전역객체에 대입
let eventSource = null;

// 비정상적인 종료 같은 상황시에 eventSource해제
window.addEventListener('beforeunload', function(){
	if(eventSource)
	eventSource.close();
})

document.addEventListener('DOMContentLoaded', function(){
	const alarmBtn    = document.getElementById('alarmBtn');
	const alarmModal  = document.getElementById('alarm-modal');
	const alarmClose	= document.getElementById('alarm-close');
	const alarmDeleteAll = document.getElementById('alarm-delete-all');
	const alarmBody = document.getElementById('alarm-body');

	// 로그인이 되어있는 유저한테만 sse 연결 및 알림 정보 받아오기
	// 로그인이 되어있는 유저한테만 알림 전체 삭제 활성화
	// 로그인이 되어있는 유저한테 알림에 마우스 hover시 read업데이트
	if(memId && memId != 'anonymousUser'){

		// 초기에 알림 내용 세팅
		fetch(`/api/alarm/getAlarms`,{
			method : "GET",
		})
		.then(resp =>{
			if(!resp.ok) throw new Error('에러 발생');
			return resp.json();
		})
		.then(data =>{
			if(data.length >= 1){
				alarmBody.innerHTML = '';
				data.forEach(alarm =>{
					addAlarmItem(alarm);
				})
			}
		})
		.catch(err =>{
			console.error(err);
		})

		// SSE 연결
		eventSource = new EventSource('/api/alarm/sub?memId='+memId);
		eventSource.addEventListener('alarm',function(e){
			const alarmVO = JSON.parse(e.data);
			addAlarmItem(alarmVO);
		})

		eventSource.addEventListener('connected', function(e){
		})

		eventSource.onopen = () =>{
		}

		eventSource.onerror = (e) =>{
			console.error("error : ", e);
		}

		// 알림 전체삭제 요청 버튼 이벤트 추가
		alarmDeleteAll.classList.remove('denied');
		alarmDeleteAll.removeAttribute('disabled');
		alarmDeleteAll.addEventListener('click', function(){
			fetch('/api/alarm/deleteAllAlarm',{
				method : "POST"
			})
			.then(resp =>{
				if(!resp.ok) throw new Error("전체삭제 에러 발생");
				// 정상적으로 삭제되고 나서 body비우기 및 뱃지 제거
				updateAlarmFloatingBadge(Number.MIN_SAFE_INTEGER);
				alarmBody.innerHTML = '<p class="empty-message">알림이 없습니다.</p>';
			})
			.catch(err =>{
				console.error(err);
			})
		})

		// 모달에 띄울 알림 내용 출력하는 함수
		function addAlarmItem(alarm){
			const item = document.createElement('div');
			const emptyMessage = document.querySelector(".empty-message");
			if(emptyMessage) emptyMessage.remove();

			item.classList.add('alarm-item');
			item.classList.add(alarm.alarmIsRead == 'Y' ? 'read' : 'unread');
			item.dataset.id = alarm.alarmId;
			item.onclick = (e)=>{
				if(e.target.closest('.alarm-delete-btn')) return;
				location.href = alarm.alarmTargetUrl;
			}
			// 알림 내용, 시간, 삭제 버튼 추가
			item.innerHTML = `
					    <div class="alarm-item__main">
					      <span class="alarm-time">${alarm.displayTime}</span>
					      <span class="alarm-content">${alarm.alarmContent}</span>
					    </div>
					    <button class="alarm-delete-btn" onclick="removeAlarmItem(this)">&times;</button>
						`;
			alarmBody.prepend(item);
			if(alarm.alarmIsRead == 'N'){
				updateAlarmFloatingBadge(1);
			}
		}

		alarmModal.addEventListener('mouseover', updateReadAlarm);
	}

	// 모달 바깥 클릭 시 모달 닫기
	document.addEventListener('click', function(e){
		if(alarmModal.classList.contains('hidden')) return;

		if(!e.target.closest('#alarm-modal') && !e.target.closest("#alarmBtn")){
			alarmModal.classList.add('hidden');
		}
	})

	// 모달 닫기버튼 이벤트 등록
	if(alarmClose){
		alarmClose.addEventListener('click', (e) =>{
			e.preventDefault();
			alarmModal.classList.add('hidden');
		})
	}

	// 모달 토글
	if(alarmBtn){
		alarmBtn.addEventListener('click', (e) => {
			e.preventDefault();
			alarmModal.classList.toggle('hidden');
		});
	}
})


// 모달에서 마우스를 올릴경우 읽음처리 하는 함수
function updateReadAlarm(e){
	const unreadAlarmItem = e.target.closest(".alarm-item.unread");
	if(!unreadAlarmItem) return;

	let alarmId = unreadAlarmItem.dataset.id;
	fetch(`/api/alarm/updateRead`,{
		method : "POST",
		headers : {"Content-Type":"application/json"},
		body : JSON.stringify({alarmId:alarmId})
	})
	.then(resp =>{
		if(!resp.ok) throw new Error("에러 발생");
		// 뱃지제거
		unreadAlarmItem.classList.remove('unread');
		unreadAlarmItem.classList.add('read');
		updateAlarmFloatingBadge(-1);
	})
	.catch(err =>{
		console.error(err);
	})
}

// 플로팅 뱃지 업데이트 시키는 함수
// nums(증가 or 감소 될 갯수) : 초기 세팅 안읽은갯수 혹은 SseEvent발생시 1, 읽어서 업데이트 할 때 -1
function updateAlarmFloatingBadge(nums=Number){
	const floatingBadge = document.getElementById("alarm-badge");
	let unreadCnt = floatingBadge.textContent.trim();
	unreadCnt = parseInt(unreadCnt)+nums;
	if(unreadCnt > 0){
		floatingBadge.textContent = unreadCnt;
		floatingBadge.style.display = "inline-block";
	}else{
		floatingBadge.textContent = 0;
		floatingBadge.style.display = "none";
	}
}

// 모달에서 삭제 버튼 누를 시 삭제처리 하는 함수 (단일삭제)
function removeAlarmItem(alarmDeleteBtn){
	const alarmItem = alarmDeleteBtn.closest(".alarm-item");
	const alarmBody = alarmItem.closest("#alarm-body");
	let alarmId = alarmItem.dataset.id;

	fetch(`/api/alarm/deleteAlarmItem?alarmId=${alarmId}`,{
		method : "POST"
	})
	.then(resp =>{
		if(!resp.ok) throw new Error("단일 삭제 에러 발생")

		updateAlarmFloatingBadge(-1);
		alarmItem.remove();
		const alarmItemList = document.querySelectorAll(".alarm-item");

		if(alarmItemList.length == 0){
			alarmBody.innerHTML = '<p class="empty-message">알림이 없습니다.</p>';
		}
	})
	.catch(err =>{
		console.error(err);
	})
}

