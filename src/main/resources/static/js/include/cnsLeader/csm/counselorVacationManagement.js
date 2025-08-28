/**
 *
 */

// 전역 상태
window.currentPage = 1;
window.currentVaId = null;
window.editor = {};

function isConfirmed(clConfirmCode){
	switch (clConfirmCode) {
	  case null:
	  case undefined:
	  case "S03002":
	  case "S03003":
	    return false;
	  case "S03001":
	    return true;
	  default:
	    return false;  // 그 외 예상치 못한 코드
	}
}

function getGenText(genCode){
	switch (genCode){
		case "G11001":
			return "남"
		case "G11002":
			return "여"
		default:
			return "-";
	}
}

// helper: ISO 문자열 → "MM.DD" 포맷
function formatDateMMDD(iso) {
	const d = new Date(iso);
	const mm = String(d.getMonth() + 1);
	const dd = String(d.getDate());
	const fullYear = String(d.getFullYear());
	return `${fullYear}. ${mm}. ${dd}.`;
}

// 결재상태 코드를 출력할 문자열로 변경
function getApprovalStatusText(status) {
  switch (status) {
    case null:
    case undefined:
      return "미제출";
    case "S03001":
      return "접수";
    case "S03002":
      return "반려";
    case "S03003":
      return "승인";
    default:
      return "-";  // 그 외 예상치 못한 코드
  }
}

// 나이 반환
function calculateAge(birthDate) {
  // 생년월일을 '년', '월', '일'로 분리합니다.
  var birthYear = birthDate.getFullYear();
  var birthMonth = birthDate.getMonth();
  var birthDay = birthDate.getDate();

  // 현재 날짜를 가져옵니다.
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate();

  // 만 나이를 계산합니다.
  var age = currentYear - birthYear;

  // 현재 월과 생일의 월을 비교합니다.
  if (currentMonth < birthMonth) {
    age--;
  }
  // 현재 월과 생일의 월이 같은 경우, 현재 일과 생일의 일을 비교합니다.
  else if (currentMonth === birthMonth && currentDay < birthDay) {
    age--;
  }

  return age;
}

function renderPagination({ startPage, endPage, currentPage, totalPages }) {
	let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

	for (let p = startPage; p <= endPage; p++) {
		html += `<a href="#" onclick="fetchVacationList(${p})" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.panel-footer.pagination');
	if (footer) footer.innerHTML = html;
}

// 실제 데이터 + 페이징 조회
function fetchVacationList(page = 1) {
	const pageSize = 10;
	const keyword = document.querySelector('input[name="keyword"]').value;
	const status = document.querySelector('select[name="status"]').value;
	const filter = document.querySelector('input[name="filter"]:checked').value;

	axios.get('/api/cnsld/vacationList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status,
				filter: filter,
			}
		})
		.then(({ data }) => {
			const countEl = document.getElementById('notice-count');
			let cnt = (page-1) * pageSize +1;
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('notice-list');
			if (!listEl) return;

			if (data.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='6' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
					<tr data-va-id="${item.vaId}" onclick="showDetail(${item.vaId})">
						<td>${cnt++}</td>
						<td>${item.memName}</td>
						<td>${item.memPhoneNumber}</td>
						<td>${formatDateMMDD(new Date(item.requestedAt))}</td>
						<td>${formatDateMMDD(new Date(item.vaStart))}</td>
						<td>${formatDateMMDD(new Date(item.vaEnd))}</td>
						<td>${getApprovalStatusText(item.vaConfirm)}</td>
					</tr>
					`).join('');
				listEl.innerHTML = rows;
				window.currentPage = page;
				renderPagination(data);
			}
		})
		.catch(err => console.error('상담완료이력 조회 중 에러:', err));
}

function eventBinding(){
	const tbody = document.getElementById('notice-list');
	tbody.addEventListener('click', function(){

	})
}

function resetAfterConfirm(){
	if(!confirm('저장되지 하지 않은 정보는 복구되지 않습니다.\n계속하시겠습니까?')) return;
	resetDetail();
}

// 상세 내용 비우기
function resetDetail() {
	document.getElementById('fileGroupId').value = '';
	document.getElementById("file").style.display = "none";
	document.getElementById("existing-files").innerHTML = "<tr><td colspan='9'>선택된 정보가 없습니다</td></tr>";
	document.getElementById('info-table-tbody').innerHTML = '';
	window.editor[0]?.setData('');
	window.editor[0].enableReadOnlyMode('clContent');
	window.editor[1]?.setData('');
	window.editor[1].enableReadOnlyMode('etcContent');
}

// 파일 다운로드를 위해서 헤더에서 기존 이름 + 확장자 처리된것 복구 시키기
function getFilenameFromDisposition(header) {
  // e.g. header = 'attachment; filename="MyPhoto.jpg"'
  const match = /filename\*?=(?:UTF-8'')?["]?([^";]+)["]?/.exec(header);
  return match
    ? decodeURIComponent(match[1])
    : `download_${fileSeq}`;
}

// 파일 다운로드
function filedownload(fileGroupId, fileSeq) {
	axios({
			method: 'get',
			url: `/files/download`,
			params: { fileGroupId: fileGroupId, seq: fileSeq },
			responseType: 'blob'
		})
		.then(response => {
			const headers = response.headers;
			const contentType = headers['content-type'] || 'application/octet-stream';
			const contentDisposition = headers['content-disposition'];
			const blob = new Blob([response.data], {type:contentType});
			const url = window.URL.createObjectURL(blob);
			const atag = document.createElement('a');
			atag.href = url;
			atag.download = getFilenameFromDisposition(contentDisposition);
			document.body.appendChild(atag);
			atag.click();
			document.body.removeChild(atag);
			window.URL.revokeObjectURL(url);
		})
		.catch(error => console.error('파일 다운로드 실패:', error));
}

// 단일 파일 삭제
function deleteExistingFile(fileGroupId, seq, vaId) {
	axios.get('/api/cns/counsel/deleteFile.do', {
			params: { fileGroupId, seq }
		})
		.then(() => showDetail(vaId))
		.catch(console.error);
}

// 상세 출력
function showDetail(vaId) {
	if (!vaId) return;
	resetDetail();
	window.editor[0].disableReadOnlyMode('clContent');

	axios.get('/api/cnsld/vacationDetail.do', { params: { vaId } })
		.then(response => {
			const resp = response.data;
			window.currentVaId = vaId;
			document.getElementById('vaId').value = resp.vaId;
			document.getElementById('fileGroupId').value = resp.fileGroupId;

			//접수처리 제외하고 버튼 가리기
			document.getElementById('btn-save').style.display = isConfirmed(resp.vaConfirm) ? "inline-block" : "none";
			document.getElementById('btn-confirm').style.display = isConfirmed(resp.vaConfirm) ? "inline-block" : "none";

			//접수처리 제외하고 비고란 입력 막기
			isConfirmed(resp.vaConfirm)
					? window.editor[1].disableReadOnlyMode('etcContent')
					: window.editor[1].enableReadOnlyMode('etcContent');

			const elForNum = document.querySelector(`#notice-list tr[data-va-id='${vaId}']`);
			const num = elForNum.firstElementChild.textContent.trim();

			document.getElementById("info-table-tbody").innerHTML = `
	        <tr>
	          <td>${num}</td>
	          <td>${resp.memName}</td>
	          <td>${resp.memPhoneNumber}</td>
	          <td>${formatDateMMDD(new Date(resp.requestedAt))}</td>
	          <td>${formatDateMMDD(new Date(resp.vaStart))}</td>
	          <td>${formatDateMMDD(new Date(resp.vaEnd))}</td>
	          <td>${getApprovalStatusText(resp.vaConfirm)}</td>
	        </tr>`;


			if(resp.vaReason){
				window.editor[0]?.setData(resp.vaReason);
			}
			// 접수 상태와 상관없이 상담일지의 내용은 변경 불가하도록
			window.editor[0].enableReadOnlyMode('clContent');

			if(resp.vaEtc){
				window.editor[1]?.setData(resp.vaEtc);
			}

			if(resp.vaEtc){
				window.editor[1]?.setData(resp.vaEtc);
			}

			// 접수 상태면 비고란 활성화
			if(resp.vaConfirm == 'S03001'){
				window.editor[1].disableReadOnlyMode('etcContent');
			}

			const ul = document.getElementById("existing-files");
			if (!resp.fileDetailList || resp.fileDetailList.length === 0) {
				ul.innerHTML = '<li>첨부된 파일이 없습니다.</li>';
				document.getElementById("file").style.display = "block";
			} else {
				document.getElementById('fileGroupId').value = resp.fileDetailList[0].fileGroupId;
				document.getElementById("file").style.display = "block";
				ul.innerHTML = resp.fileDetailList.map(f => `
	          	<li>
	            <div onclick="filedownload('${f.fileGroupId}', ${f.fileSeq})" target="_blank">${f.fileOrgName}</div>&nbsp;&nbsp;
	          	</li>`
				).join('');
			}
		})
		.catch(console.error);
}

// 반려 혹은 승인처리 update
async function updateConfirmation(action) {

	const fd = new FormData();
	let actionStr = '';

	// 상담일지 기본키세팅
	const vaId = document.getElementById('vaId').value;
	const etc = window.editor[1].getData().trim();
	fd.append('vaId', vaId);

	// 반려버튼 클릭 시
	if(action == 'reject'){
		if(!etc){
			showConfirm2("반려시 사유 입력은 필수입니다.","",
				() => {
					return;						
				}
			);
		}
		// 반려코드 세팅
		fd.set('vaConfirm', 'S03002');
		actionStr = '반려'
	}

	// 승인 버튼 클릭시 승인코드 세팅
	if(action == 'confirm'){
		fd.set('vaConfirm', 'S03003')
		actionStr = '승인'
	}

	// 비고란 입력시 내용 세팅
	if(etc){
		fd.append('vaEtc', etc);
	}

	// 반려/승인 처리 전 확인
	if(!confirm(`${actionStr} 처리 진행하시겠습니까?`)) return;
	
	// 승인인 경우 이미 예약이 존재하는지 한번더 체크
	if(action == 'confirm'){
		const resp = await axios.get('/api/cnsld/checkCounselList.do?vaId='+vaId);
		const counselList = resp.data;
		let alertStr = '';
		if(counselList && counselList.length > 0){
			alertStr += '해당 휴가 기간에 상담예약이 존재합니다.\n';
			counselList.forEach(c =>{
				const date = new Date(c.counselReqDatetime);
				const dateStr = `${date.getFullYear()}. ${date.getMonth()+1}. ${date.getDate()}. ${date.getHours()}시${date.getMinutes()}분 상담`;
				alertStr += `${c.memName}님 ${dateStr}\n`;
			})
			alertStr += '전체 예약 취소하고 승인 진행하시겠습니까?';
		}
		if(alertStr != ''){
			const lastCheck = confirm(alertStr);
			if(!lastCheck) return;
		}
	}


	// 업데이트처리
	axios.post('/api/cnsld/updateVacation.do',fd)
	.then(resp =>{
		const result = resp.data;
		if(result){
			showConfirm2("정상적으로 ${actionStr}되었습니다.","",
				() => {
					fetchVacationList(window.currentPage);
					const vaId = document.getElementById('vaId').value;
					const targetTr = document.querySelector(`#notice-list tr[data-va-id='${vaId}']`);
					targetTr.click();					
				}
			);
		}else{
			showConfirm2("${actionStr}처리 도중 문제가 발생했습니다.","다시 시도해주세요.",
				() => {
					return;				
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
		const keywordInput = document.querySelector('input[name="keyword"]');
		const editorTarget = document.getElementById("clContent");
		const searchBtn = document.getElementById('btn-search');
		const filterRadios = document.querySelectorAll('input[name="filter"]');

		filterRadios.forEach(r =>{
			r.addEventListener('click',()=>{fetchVacationList(1)})
		})

		keywordInput.addEventListener('keydown',function(e){
			if(e.code=='Enter'){
				e.preventDefault();
				fetchVacationList(1);
			}
		})
		searchBtn.addEventListener('click',function(){
			fetchVacationList(window.currentPage);
		})

		const etcEditorTarget = document.getElementById("etcContent");

		if (keywordInput && editorTarget && etcEditorTarget) {
			ClassicEditor
				.create(editorTarget, {
					ckfinder: { uploadUrl: "/image/upload" },
				})
				.then(editor => {
					const toolbarElement = editor.ui.view.toolbar.element;
					editor.on( 'change:isReadOnly', ( evt, propertyName, isReadOnly ) => {
						if ( isReadOnly ) {
							toolbarElement.style.display = 'none';
						} else {
							toolbarElement.style.display = 'flex';
						}
					});
					editor.enableReadOnlyMode('clContent');

					window.editor[0] = editor;
					fetchVacationList(1);      // 불러오기
					eventBinding();   // 이벤트 바인딩

				})
				.catch(err => console.error("에디터 생성 실패:", err));
			// 반려사유 작성용 에디터 추가
			ClassicEditor
				.create(etcEditorTarget, {
					ckfinder: { uploadUrl: "/image/upload" },
				})
				.then(editor =>{
					const toolbarElement = editor.ui.view.toolbar.element;
					editor.on( 'change:isReadOnly', ( evt, propertyName, isReadOnly ) => {
						if ( isReadOnly ) {
							toolbarElement.style.display = 'none';
						} else {
							toolbarElement.style.display = 'flex';
						}
					});
					editor.enableReadOnlyMode('etcContent');
					window.editor[1] = editor;
				})
				.catch(err => console.error("에디터 생성 실패:", err));
		} else {
			setTimeout(checkReady, 100); // DOM이 안 준비됐으면 재시도
		}
	};
	checkReady();
}


waitForInit()



