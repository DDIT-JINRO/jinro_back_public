// 전역 상태
window.dataRangePicker = null;
window.currentPage = 1;
window.currentCounselId = null;
window.disabledDates = [];

async function initCalendar(){
	await getDisalbedDate();
	// (B) 오늘 이전은 아예 막기 위한 today
	const today = new Date();

	window.dataRangePicker = flatpickr("#dateRange", {
	  mode:    "range",    // 두 번 클릭으로 시작/종료 선택
	  inline:  true,       // always visible
	  dateFormat: "Y-m-d",
	  disable: window.disabledDates,
	  minDate: today,      // 오늘 이전 날짜 금지

	  onChange: function(selectedDates, dateStr, instance) {
	    // selectedDates[0] → 시작일, [1] → 종료일(선택 완료 시)
	    if (selectedDates.length === 1) {
	      const start = selectedDates[0];
		  // 비활성화 날짜 Date 객체로 바꾼 뒤 오름차순 정렬
		  const sortedDisabled = disabledDates
		    .map(d => new Date(d))
		    .sort((a, b) => a - b);
	      // 시작일 이후 첫 비활성 날짜를 찾아서
	      const nextBlocked = sortedDisabled.find(d => d > start);
	      if (nextBlocked) {
	        // 그 전날까지만 종료일로 고를 수 있게 maxDate 설정
	        const maxAllowed = new Date(nextBlocked.getTime() - 86400000);
	        instance.set('maxDate', maxAllowed);
	      } else {
	        // 제한 해제
	        instance.set('maxDate', null);
	      }

	      // 이전에 선택했던 값이 있으면 초기화
	      document.getElementById('startDateInput').value = '';
	      document.getElementById('endDateInput').value = '';
	      document.getElementById('totalDateCnt').value = '';
	      if (instance.selectedDates.length > 1) {
	        instance.clear();      // 선택 리셋
	        instance.setDate(start, false); // 시작일만 다시 선택
	      }
	    }
	    else if (selectedDates.length === 2) {
	      const start = selectedDates[0];
	      const end = selectedDates[1];

		  // 1) 시/분/초/밀리초를 모두 0으로 맞춰서 순수 날짜 차이만 계산

		  // 2) ms 단위 차이 후, 하루(ms)로 나누고 +1 (시작일 포함)
		  const msPerDay = 1000 * 60 * 60 * 24;
		  const diffDays = Math.round((end - start) / msPerDay) + 1;
	      // 종료일 히든 필드에 저장
	      document.getElementById('startDateInput').value = formatDateMMDD(start);
	      document.getElementById('endDateInput').value = formatDateMMDD(end);
	      document.getElementById('totalDateCnt').value = diffDays + " 일";

		  instance.set('maxDate', null);
	    }
	  }
	});

	const resetBtn = document.getElementById('dateResetBtn');
	if(resetBtn){
		resetBtn.addEventListener('click',async function(){
			window.dataRangePicker?.clear();
			const today = new Date();

			// 히든 필드도 비우기
			document.getElementById('startDateInput').value = '';
			document.getElementById('endDateInput').value   = '';
			document.getElementById('totalDateCnt').value   = '';

			// 다시 today 기준 최소/비활성 날짜 설정
			await getDisalbedDate();

			window.dataRangePicker?.set('minDate', today);
			window.dataRangePicker?.set('maxDate', null);
			window.dataRangePicker?.set('disable', window.disabledDates);
		})
	}

	const resetAllBtn = document.getElementById('resetAllBtn');
	if(resetAllBtn){
		resetAllBtn.addEventListener('click',async function(){
			window.dataRangePicker?.clear();
			const today = new Date();

			// 히든 필드도 비우기
			document.getElementById('startDateInput').value = '';
			document.getElementById('endDateInput').value   = '';
			document.getElementById('totalDateCnt').value   = '';

			// 다시 today 기준 최소/비활성 날짜 설정
			window.dataRangePicker?.set('minDate', today);
			window.dataRangePicker?.set('maxDate', null);

			// 서버에서 disabledDate 다시 불러오기
			await getDisalbedDate();

			window.dataRangePicker?.set('disable', window.disabledDates);

			//숨겨진 textarea 초기화
			document.getElementById('vaReason').value = '';
			//ckEditor 초기화
			window.editor?.setData('');
		})
	}
}

async function getDisalbedDate(){
	const resp = await axios.get('/api/cns/disabledDateList.do');
	const data = await resp.data;
	window.disabledDates = data;
}

function confirmVacation(){
	const start = document.getElementById('startDateInput');
	const end = document.getElementById('endDateInput');
	const reason = window.editor.getData();
	const fileInput = document.getElementById('attachFile') ;

	if(start.value == null || start.value==''){
		showConfirm2("시작 날짜를 지정해주세요.","",
			() => {
			}
		);
		return;
	}
	if(end.value == null || end.value==''){
		showConfirm2("종료 날짜를 지정해주세요.","",
			() => {
			}
		);
		return;
	}
	if(reason == null || reason==''){
		showConfirm2("사유를 입력해주세요.","",
			() => {
			}
		);
		return;
	}

	const startDate = start.value.split('.').map(v => v.trim()).join('-').slice(0,-1);
	const endDate =  end.value.split('.').map(v => v.trim()).join('-').slice(0,-1);

	const fd = new FormData();
	fd.append('vaConfirm', 'S03001');
	fd.append('vaStart', startDate);
	fd.append('vaEnd', endDate);
	fd.append('vaReason', reason);

	for(let i=0; i<fileInput.files.length; i++){
		fd.append('files', fileInput.files[i]);
	}

	axios.post('/api/cns/insertVacation.do', fd, {
		headers : {'Content-Type': 'multipart/form-data'}
	})
	.then(resp =>{
		if(resp.data){
			showConfirm2("신청 완료","",
				() => {
					// 완료 후 신청 내역 다시 초기화
					getDisalbedDate();
					window.currentPage = 1;
					fetchVacationInfo(1);
					// 완료 후 신청 양식 초기화
					document.getElementById('resetAllBtn').click();
				}
			);
		}
	})
	.catch(err =>{
		console.error('err : ',err);
	})

}

function waitForInit() {
	const checkReady = () => {
		const editorTarget = document.getElementById("vaReason");

		if (editorTarget) {
			ClassicEditor
				.create(editorTarget, {
					ckfinder: { uploadUrl: "/image/upload" },
				})
				.then(editor => {
					window.editor = editor;
					fetchVacationInfo(1);      // 불러오기
					eventBinding();   // 이벤트 바인딩
				})
				.catch(err => console.error("에디터 생성 실패:", err));

			const fileInput = document.getElementById('attachFile');
			const fileDiv 	= document.getElementById('attachFileDiv');

			fileInput.addEventListener('change', function(e){
				if(e.target.files.length>0){
					fileDiv.textContent =  '첨부된 파일 : '+ e.target.files[0].name;
				}else{
					fileDiv.textContent = '파일 첨부';
				}
			})
			fileDiv.addEventListener('click', function(){
				fileInput.click();
			})
		} else {
			setTimeout(checkReady, 100); // DOM이 안 준비됐으면 재시도
		}
	};
	checkReady();
}

function eventBinding(){
	const radioListFilter = document.querySelectorAll('input[name="filter"');
	const radioListSortBy = document.querySelectorAll('input[name="sortBy"');

	if(radioListFilter){
		radioListFilter.forEach(el =>{
			el.addEventListener('click', ()=>{fetchVacationInfo(window.currentPage)})
		})
	}
	if(radioListSortBy){
		radioListSortBy.forEach(el =>{
			el.addEventListener('click', ()=>{fetchVacationInfo(window.currentPage)})
		})
	}
}

function calVacationDays(startDate, endDate){
	const msPerDay = 24 * 60 * 60 * 1000;

	// 시·분·초·밀리초 제거: 순수 날짜 비교 위해 UTC 기준으로 자정 시각을 계산
	const utcStart = Date.UTC(
	  startDate.getFullYear(),
	  startDate.getMonth(),
	  startDate.getDate()
	);
	const utcEnd = Date.UTC(
	  endDate.getFullYear(),
	  endDate.getMonth(),
	  endDate.getDate()
	);
	// 두 날짜 차이를 일(day) 단위로 계산하고, +1을 해줘서 시작/종료일 포함
	return Math.floor((utcEnd - utcStart) / msPerDay) + 1;
}

// 결재상태 코드를 출력할 문자열로 변경
function getApprovalStatusText(status) {
  switch (status) {
    case null:
    case undefined:
      return "취소";
    case "S03001":
      return "신청";
    case "S03002":
      return "반려";
    case "S03003":
      return "승인";
    default:
      return "-";  // 그 외 예상치 못한 코드
  }
}

// date 출력문자열 변환 함수
function formatDateMMDD(iso) {
	const d = new Date(iso);
	const mm = String(d.getMonth() + 1);
	const dd = String(d.getDate());
	const fullYear = String(d.getFullYear());
	return `${fullYear}. ${mm}. ${dd}.`;
}

// 실제 데이터 + 페이징 조회
function fetchVacationInfo(page = 1) {
	const pageSize = 10;
	const params = getFilterAndSortBy();
	params.size = pageSize;
	params.currentPage = page;

	axios.get('/api/cns/myVacationList.do', {
			params: params
		})
		.then(({ data }) => {
			const countEl = document.getElementById('notice-count');
			let cnt = (page-1) * pageSize +1;
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('notice-list');
			if (!listEl) return;

			if (data.content.length < 1) {
				listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
					<tr data-va-id="${item.vaId}">
						<td>${cnt++}</td>
						<td>${formatDateMMDD(new Date(item.requestedAt))}</td>
						<td>${formatDateMMDD(new Date(item.vaStart))}</td>
						<td>${formatDateMMDD(new Date(item.vaEnd))}</td>
						<td>${calVacationDays(new Date(item.vaStart), new Date(item.vaEnd))} 일</td>
						<td>${item.vaReason}</td>
						<td>${getApprovalStatusText(item.vaConfirm)}</td>
					</tr>
					`).join('');
				listEl.innerHTML = rows;
				renderPagination(data);
			}
		})
		.catch(err => console.error('휴가신청이력 조회 중 에러:', err));
}

// 페이징 파트 출력
function renderPagination({ startPage, endPage, currentPage, totalPages }) {
	let html = `<a href="#" onclick="fetchVacationInfo(${startPage - 1})" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

	for (let p = startPage; p <= endPage; p++) {
		html += `<a href="#" onclick="fetchVacationInfo(${p})" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" onclick="fetchVacationInfo(${endPage + 1})" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.panel-footer.pagination');
	if (footer) footer.innerHTML = html;
}

// form에 있는 필터, 정렬 정보 가져오기
function getFilterAndSortBy(){
	const filterValue = document.querySelector('input[name="filter"]:checked').value;
	const sortByValue = document.querySelector('input[name="sortBy"]:checked').value;

	return {filter : filterValue, sortBy : sortByValue};
}



waitForInit();
initCalendar();





