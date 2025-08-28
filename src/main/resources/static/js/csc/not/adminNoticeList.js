// helper: ISO 문자열 → "MM.DD" 포맷
function formatDateMMDD(iso) {
	const d = new Date(iso);
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	const fullYear = String(d.getFullYear());
	return `${fullYear}. ${mm}. ${dd}.`;
}

// 전역 상태
window.currentPage = 1;
window.currentNoticeId = null;

// 실제 데이터 + 페이징 조회
function fetchNotices(page = 1) {
	const pageSize = 10;
	const keyword = document.querySelector('input[name="keyword"]').value;
	const status = document.querySelector('select[name="status"]').value;

	axios.get('/csc/not/admin/noticeList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status
			}
		})
		.then(({ data }) => {
			const countEl = document.getElementById('notice-count');
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('notice-list');
			if (!listEl) return;

			if (data.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
          <tr>
            <td>${item.rnum}</td>
            <td><a href="javascript:showDetail(${item.noticeId})" style="cursor: pointer; text-decoration: none; color:black;">${item.noticeTitle}</a></td>
            <td style="text-align : right;">${item.noticeCnt}</td>
            <td>${formatDateMMDD(item.noticeUpdatedAt)}</td>
          </tr>`).join('');
				listEl.innerHTML = rows;
				renderPagination(data);
			}
		})
		.catch(err => console.error('공지 목록 조회 중 에러:', err));
}

function renderPagination({ startPage, endPage, currentPage, totalPages }) {
	let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

	for (let p = startPage; p <= endPage; p++) {
		html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.panel-footer.pagination');
	if (footer) footer.innerHTML = html;
}


if (typeof window.noticeEventsBound === 'undefined') {
	window.noticeEventsBound = false;
}
function bindNoticeEvents() {
	if (noticeEventsBound) return;
	noticeEventsBound = true;

	const searchBtn = document.querySelector('.btn-save');
	if (searchBtn) {
		searchBtn.addEventListener('click', () => fetchNotices(1));
	}

	const frm = document.querySelector('form[action="/csc/admin/noticeList.do"]');
	console.log(frm);
	if (frm) {
		frm.addEventListener('submit', function(e){
			e.preventDefault();
			searchBtn.click();
		})
	}

	const noticeHeader = document.getElementById('noticeHeader');
	if (noticeHeader) {
		noticeHeader.addEventListener('click', () => {
			const kwInput = document.querySelector('input[name="keyword"]');
			const statusSelect = document.querySelector('select[name="status"]');
			if (kwInput) kwInput.value = '';
			if (statusSelect) statusSelect.selectedIndex = 0;
			fetchNotices(1);
		});
	}
}
if (!window._paginationDelegated) {
  window._paginationDelegated = true;

  document.addEventListener('click', e => {
    const a = e.target.closest('.pagination a[data-page]');
    if (!a) return;

    e.preventDefault();
    const page = parseInt(a.dataset.page, 10);
    if (isNaN(page) || page < 1) return;

    window.currentPage = page;
    fetchNotices(page);
  });
}

function waitForInit() {
	const checkReady = () => {
		const keywordInput = document.querySelector('input[name="keyword"]');
		const editorTarget = document.getElementById("noticeContent");

		if (keywordInput && editorTarget) {
			ClassicEditor
				.create(editorTarget, {
					ckfinder: { uploadUrl: "/image/upload" }
				})
				.then(editor => {
					window.editor = editor;
					fetchNotices(1);      // 공지사항 불러오기
					bindNoticeEvents();   // 이벤트 바인딩
				})
				.catch(err => console.error("에디터 생성 실패:", err));
		} else {
			setTimeout(checkReady, 100); // DOM이 안 준비됐으면 재시도
		}
	};
	checkReady();
}

waitForInit();


function showDetail(noticeId) {
	if (!noticeId) return;
	resetDetail();
	axios.get('csc/not/admin/noticeDetail.do', { params: { noticeId } })
		.then(response => {
			window.currentNoticeId = noticeId;
			document.getElementById("btn-delete").style.display = "block";
			document.getElementById("btn-save").innerHTML = "수정";
			document.getElementById('noticeId').value = noticeId;

			const infoTable = document.querySelector('.info-table');
			infoTable.style.display = 'table';

			const resp = response.data;
			document.getElementById("info-table-tbody").innerHTML = `
	        <tr>
	          <td>${resp.noticeId}</td>
	          <td>${resp.noticeTitle}</td>
	          <td>${formatDateMMDD(resp.noticeUpdatedAt)}</td>
	          <td style="text-align: right;">${resp.noticeCnt}</td>
	        </tr>`;

			document.querySelector('input[name="noticeTitle"]').value = resp.noticeTitle;
			window.editor?.setData(resp.noticeContent);

			const ul = document.getElementById("existing-files");
			if (!resp.getFileList || resp.getFileList.length === 0) {
				ul.innerHTML = '<li>첨부된 파일이 없습니다.</li>';
				document.getElementById("file").style.display = "block";
			} else {
				document.getElementById('fileGroupNo').value = resp.getFileList[0].fileGroupId;
				document.getElementById("file").style.display = "block";
				ul.innerHTML = resp.getFileList.map(f => `
	          	<li>
	            <div onclick="filedownload('${f.fileGroupId}', ${f.fileSeq})" target="_blank">${f.fileOrgName}</div>&nbsp;&nbsp;
	            <button type="button" onclick="deleteExistingFile('${f.fileGroupId}', ${f.fileSeq}, ${noticeId})">삭제</button>
	          	</li>`
				).join('');
			}
		})
		.catch(console.error);
}

function filedownload(fileGroupId, fileSeq) {
	axios({
			method: 'get',
			url: `/files/download`,
			params: { groupId: fileGroupId, seq: fileSeq },
			responseType: 'blob'
		})
		.then(response => {
			const headers = response.headers;
			const contentType = headers['content-type'] || 'application/octet-stream';
			const blob = new Blob([response.data], {type:contentType});
			const url = window.URL.createObjectURL(blob);
			const atag = document.createElement('a');
			atag.href = url;
			atag.download = `download_${fileSeq}`;
			document.body.appendChild(atag);
			atag.click();
			document.body.removeChild(atag);
			window.URL.revokeObjectURL(url);
		})
		.catch(error => console.error('파일 다운로드 실패:', error));
}

function deleteExistingFile(fileGroupId, seq, noticeId) {
	axios.get('/csc/not/admin/deleteFile', {
			params: {
				groupId: fileGroupId,
				seq: seq,
				noticeId: noticeId

			}
		})
		.then(() => showDetail(noticeId))
		.catch(console.error);
}


function resetDetail() {
	document.getElementById('fileGroupNo').value = '';
	document.getElementById("btn-delete").style.display = "none";
	document.getElementById("file").style.display = "none";
	document.getElementById("existing-files").innerHTML = "";
	document.getElementById("btn-save").innerHTML = "등록";
	document.querySelector('.info-table').style.display = 'none';
	document.getElementById('info-table-tbody').innerHTML = '';
	document.querySelector('input[name="noticeTitle"]').value = '';
	window.editor?.setData('');
	document.getElementById('noticeFileInput').value = '';
}

function insertOrUpdate() {
	const form = document.getElementById('form-data');
	const fd = new FormData(form);

	fd.set('noticeContent', window.editor?.getData() || '');

	if (document.querySelector('.info-table').style.display === 'none') {


		axios.post('/csc/not/admin/insertNotice', fd)
			.then(() => {
				resetDetail();
				fetchNotices(1);
			})
			.catch(err => console.error('등록 실패:', err.response || err));
	} else {
		axios.post('/csc/not/admin/updateNotice', fd)
			.then(() => {
				resetDetail();
				fetchNotices(window.currentPage);
				showDetail(window.currentNoticeId);
			})
			.catch(err => console.error('수정 실패:', err.response || err));
	}
}

function deleteNotice() {
	const form = document.getElementById('form-data');
	const fd = new FormData(form);
	fd.set('noticeContent', window.editor?.getData() || '');

	axios.post('/csc/not/admin/deleteNotice', fd)
		.then(() => {
			fetchNotices(1);
			resetDetail();
		})
		.catch(err => console.error('삭제 실패:', err.response || err));
}

