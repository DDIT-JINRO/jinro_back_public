// 전역 상태
window.currentPage = 1;
window.currentCounselId = null;

function getDifficultyText(difCode){
	switch (genCode){
		case "G13001":
			return "상"
		case "G13002":
			return "중"
		case "G13003":
			return "하"
		default:
			return "-";
	}
}

function isConfirmed(clConfirmCode){
	switch (clConfirmCode) {
	  case null:
	  case undefined:
	  case "S03002":
	    return false;
	  case "S03001":
	  case "S03003":
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
		if(totalPages == 0) p = 1;
		html += `<a href="#" onclick="fetchCounselingLog(${p})" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.panel-footer.pagination');
	if (footer) footer.innerHTML = html;
}

// 실제 데이터 + 페이징 조회
function fetchCounselingLog(page = 1) {
	const pageSize = 10;
	const keyword = document.querySelector('input[name="keyword"]').value;
	const status = document.querySelector('select[name="status"]').value;
	const year = document.querySelector('select[name="year"]').value;

	axios.get('/api/cns/counselList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status,
				year: year,
			}
		})
		.then(({ data }) => {
			window.currentPage = page;
			const countEl = document.getElementById('notice-count');
			let cnt = (page-1) * pageSize +1;
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('notice-list');
			if (!listEl) return;

			if (data.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='6' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
					<tr data-cns-id="${item.counselId}" onclick="showDetail(${item.counselId})">
						<td>${cnt++}</td>
						<td>${item.memName}</td>
						<td>${calculateAge(new Date(item.memBirth))}</td>
						<td>${item.memEmail}</td>
						<td>${item.memPhoneNumber}</td>
						<td>${getApprovalStatusText(item.counselingLog.clConfirm)}</td>
					</tr>
					`).join('');
				listEl.innerHTML = rows;
			}
			renderPagination(data);

			const cnsIdBySchedulePage = sessionStorage.getItem('cnsIdForLog');
			if(cnsIdBySchedulePage){
				const target = listEl.querySelector(`tr[data-cns-id="${cnsIdBySchedulePage}"]`);
				sessionStorage.removeItem('cnsIdBySchedulePage');
				if(target) target.click();
			}
		})
		.catch(err => console.error('상담완료이력 조회 중 에러:', err));
}

function eventBinding(){
	searchFrm.addEventListener('submit', function(e){
		e.preventDefault();
		fetchCounselingLog(1);
	})
}

function resetAfterConfirm(){
	showConfirm("저장하지 않은 정보는 복구되지 않습니다.","계속하시겠습니까?",
		()=>{
			resetDetail();
		},
		()=>{

		}
	);
}

// 상세 내용 비우기
function resetDetail() {
	document.getElementById('fileGroupId').value = '';
	document.getElementById("file").style.display = "none";
	document.getElementById("existing-files").innerHTML = "";
	document.querySelector('.info-table').style.display = 'none';
	document.getElementById('info-table-tbody').innerHTML = '';
	document.querySelector('input[name="clTitle"]').value = '';
	window.editor?.setData('');
	document.getElementById('noticeFileInput').value = '';
	window.editor.enableReadOnlyMode('clContent');
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
function deleteExistingFile(fileGroupId, seq, counselId) {
	axios.get('/api/cns/counsel/deleteFile.do', {
			params: { fileGroupId, seq }
		})
		.then(() => showDetail(counselId))
		.catch(console.error);
}

// 상세 출력
function showDetail(counselId) {
	if (!counselId) return;
	resetDetail();
	window.editor.disableReadOnlyMode('clContent');

	axios.get('/api/cns/counselDetail.do', { params: { counselId } })
		.then(response => {
			const resp = response.data;

			window.currentCounselId = counselId;
			document.getElementById('counselLogId').value = resp.counselingLog.clIdx;
			document.getElementById('counselId').value = resp.counselId;
			document.getElementById('fileGroupId').value = resp.counselingLog.fileGroupId;
			document.getElementById('btn-save').style.display = isConfirmed(resp.counselingLog.clConfirm) ? 'none' : 'inline-block';
			document.getElementById('btn-confirm').style.display = isConfirmed(resp.counselingLog.clConfirm) ? 'none' : 'inline-block';
			document.getElementById('noticeFileInput').disabled = isConfirmed(resp.counselingLog.clConfirm) ? true : false;


			const infoTable = document.querySelector('.info-table');
			infoTable.style.display = 'table';

			const elForNum = document.querySelector(`#notice-list tr[data-cns-id='${counselId}']`);
			const num = elForNum.firstElementChild.textContent.trim();

			document.getElementById("info-table-tbody").innerHTML = `
	        <tr>
	          <td>${num}</td>
	          <td>${resp.memName}</td>
	          <td>${getGenText(resp.memGen)}</td>
	          <td>${calculateAge(new Date(resp.memBirth))}</td>
	          <td>
			  	<select name="clDifficulty" id="clDifficulty" ${isConfirmed(resp.counselingLog.clConfirm) ? 'disabled':''}>
					<option value="">선택</option>
					<option value="G13001" ${resp.counselingLog.clDifficulty == 'G13001'? 'selected': ''}>상</option>
					<option value="G13002" ${resp.counselingLog.clDifficulty == 'G13002'? 'selected': ''}>중</option>
					<option value="G13003" ${resp.counselingLog.clDifficulty == 'G13003'? 'selected': ''}>하</option>
				</select>
			  </td>
	          <td>
			  	<input type="radio" name="clContinue" value="Y" ${resp.counselingLog.clContinue == 'Y'? 'checked': ''}  ${isConfirmed(resp.counselingLog.clConfirm) ? 'disabled':''}/>종결
			  	<input type="radio" name="clContinue" value="N" ${resp.counselingLog.clContinue == 'N'? 'checked': ''}  ${isConfirmed(resp.counselingLog.clConfirm) ? 'disabled':''}/>계속
			  </td>
	          <td>${resp.counselingLog.updatedAt ? formatDateMMDD(new Date(resp.counselingLog.updatedAt)) : '미작성'}</td>
	          <td>${getApprovalStatusText(resp.counselingLog.clConfirm)}</td>
	        </tr>`;

			document.querySelector('input[name="clTitle"]').value = resp.counselTitle;

			if(resp.counselingLog.clContent){
				window.editor?.setData(resp.counselingLog.clContent);
			}

			if(resp.counselingLog.clConfirm == 'S03001' || resp.counselingLog.clConfirm == 'S03003'){
				window.editor.enableReadOnlyMode('clContent');
			}

			const ul = document.getElementById("existing-files");
			if (!resp.counselingLog.fileDetailList || resp.counselingLog.fileDetailList.length === 0) {
				ul.innerHTML = '<li>첨부된 파일이 없습니다.</li>';
				document.getElementById("file").style.display = "block";
			} else {
				document.getElementById('fileGroupId').value = resp.counselingLog.fileDetailList[0].fileGroupId;
				document.getElementById("file").style.display = "block";
				ul.innerHTML = resp.counselingLog.fileDetailList.map(f => `
	          	<li>
	            <div onclick="filedownload('${f.fileGroupId}', ${f.fileSeq})" target="_blank">${f.fileOrgName}</div>&nbsp;&nbsp;
	            ${isConfirmed(resp.counselingLog.clConfirm)? '': `<button type="button" onclick="deleteExistingFile('${f.fileGroupId}', '${f.fileSeq}', ${counselId})">삭제</button>`}
	          	</li>`
				).join('');
			}
		})
		.catch(console.error);
}

function insertOrUpdate(action) {
	const form = document.getElementById('form-data');
	const fd = new FormData(form);

	const clDifficultySelectEl = document.getElementById('clDifficulty');
	if(clDifficultySelectEl.value == null || clDifficultySelectEl.value == '' ){
		showConfirm2("상담난이도를 선택해주세요.","",
			() => {
				clDifficultySelectEl.focus();
			}
		);
		return;
	}

	const clContinueRadioEl = document.querySelector('input[name="clContinue"]:checked');
	if(!clContinueRadioEl){
		showConfirm2("추가상담여부를 선택해주세요.","",
			() => {
			}
		);
		return;
	}

	if(!window.editor.getData()) {
		showConfirm2("상담일지 내용이 없습니다.","확인해 주세요.",
		() => {
			}
		);
		return;
	}

	fd.set('clContent', window.editor?.getData() || '');
	// 계속 종결 여부,
	fd.append('clDifficulty', clDifficultySelectEl.value);
	// 난이도 체크
	fd.append('clContinue', clContinueRadioEl.value);

	// action 값에 따라서 cl_confirm
	if(action == 'confirm'){
		fd.append('clConfirm', 'S03001');
	}

	axios.post('/api/cns/updateCnsLog.do', fd)
		.then(resp => {
			const data = resp.data;
			showConfirm2(data,"",
				() => {
				}
			);
			showDetail(document.getElementById('counselId').value);
			// 제출하고나면 상태값 변경되므로 목록에도 반영하기 위해 다시 호출
			if(action=='confirm'){
				fetchCounselingLog(window.currentPage);
			}
		})
		.catch(err => console.error('등록 실패:', err.response || err));
}

function waitForInit() {
	const checkReady = () => {
		const keywordInput = document.querySelector('input[name="keyword"]');
		const editorTarget = document.getElementById("clContent");

		if (keywordInput && editorTarget) {
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
					} );
					editor.enableReadOnlyMode('clContent');

					window.editor = editor;
					fetchCounselingLog(1);      // 불러오기
					eventBinding();   // 이벤트 바인딩

				})
				.catch(err => console.error("에디터 생성 실패:", err));
		} else {
			setTimeout(checkReady, 100); // DOM이 안 준비됐으면 재시도
		}
	};
	checkReady();
}


waitForInit()



