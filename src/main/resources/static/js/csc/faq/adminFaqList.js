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
window.currentFaqId = null;

// 실제 데이터 + 페이징 조회
function fetchFaqs(page = 1) {
	const pageSize = 10;
	const keyword = document.querySelector('input[name="keyword"]').value;
	const status = document.querySelector('select[name="status"]').value;

	axios.get('/csc/faq/admin/faqList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status
			}
		})
		.then(({ data }) => {
			const countEl = document.getElementById('faq-count');
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('faq-list');
			if (!listEl) return;

			if (data.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
          <tr>
            <td>${item.rnum}</td>
            <td><a href="javascript:showDetail(${item.faqId})" style="cursor: pointer; text-decoration: none; color:black;">${item.faqTitle}</a></td>
            <td>${formatDateMMDD(item.faqUpdatedAt)}</td>
          </tr>`).join('');
				listEl.innerHTML = rows;
				renderPagination(data);
			}
		})
		.catch(err => console.error('FAQ 목록 조회 중 에러:', err));
}
//페이지네이션(하단 페이지 버튼들)을 렌더링
function renderPagination({ startPage, endPage, currentPage, totalPages }) {
	let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

	for (let p = startPage; p <= endPage; p++) {
		html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.panel-footer.pagination');
	if (footer) footer.innerHTML = html;
}


if (typeof window.faqEventsBound === 'undefined') {
	window.faqEventsBound = false;
}
//FAQ 검색 및 초기화 버튼에 클릭 이벤트를 바인딩
function bindFaqEvents() {
	if (faqEventsBound) return;
	faqEventsBound = true;


	const searchBtn = document.querySelector('.btn-save');
	if (searchBtn) {
		searchBtn.addEventListener('click', () => fetchFaqs(1));
	}

	const formTag = document.querySelector('form[action="/csc/faq/admin/faqList.do"]')
	if (formTag) {
		formTag.addEventListener('submit', function(e){
			e.preventDefault();
			searchBtn.click();
		})
	}

	const faqHeader = document.getElementById('faqHeader');
	if (faqHeader) {
		faqHeader.addEventListener('click', () => {
			const kwInput = document.querySelector('input[name="keyword"]');
			const statusSelect = document.querySelector('select[name="status"]');
			if (kwInput) kwInput.value = '';
			if (statusSelect) statusSelect.selectedIndex = 0;
			fetchFaqs(1);
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
    fetchFaqs(page);
  });
}

// DOM이 준비된 후 에디터를 초기화하고 FAQ 데이터 불러오기
function waitForInit() {
	const checkReady = () => {
		const keywordInput = document.querySelector('input[name="keyword"]');
		const editorTarget = document.getElementById("faqContent");

		if (keywordInput && editorTarget) {
			ClassicEditor
				.create(editorTarget, {
					ckfinder: { uploadUrl: "/image/upload" }
				})
				.then(editor => {
					window.editor = editor;
					fetchFaqs(1);      // 공지사항 불러오기
					bindFaqEvents();   // 이벤트 바인딩
				})
				.catch(err => console.error("에디터 생성 실패:", err));
		} else {
			setTimeout(checkReady, 100); // DOM이 안 준비됐으면 재시도
		}
	};
	checkReady();
}

waitForInit();

// FAQ 세부조회
function showDetail(faqId) {
	if (!faqId) return;
	resetDetail();
	axios.get('csc/faq/admin/faqDetail.do', { params: { faqId } })
		.then(response => {
			window.currentFaqId=faqId;
			document.getElementById("btn-delete").style.display = "block";
			document.getElementById("btn-save").innerHTML = "수정";
			document.getElementById('faqId').value = faqId;

			const infoTable = document.querySelector('.info-table');
			infoTable.style.display = 'table';

			const resp = response.data;
			document.getElementById("info-table-tbody").innerHTML = `
	        <tr>
	          <td>${resp.faqId}</td>
	          <td>${resp.faqTitle}</td>
	          <td>${formatDateMMDD(resp.faqUpdatedAt)}</td>
	        </tr>`;

			document.querySelector('input[name="faqTitle"]').value = resp.faqTitle;
			window.editor?.setData(resp.faqContent);

			const ul = document.getElementById("existing-files");
			if (!resp.getFileList || resp.getFileList.length === 0) {
				document.getElementById("file").style.display = "block";
				ul.innerHTML = '<li>첨부된 파일이 없습니다.</li>';
			} else {
				document.getElementById('fileGroupNo').value = resp.getFileList[0].fileGroupId;
				document.getElementById("file").style.display = "block";
				ul.innerHTML = resp.getFileList.map(f => `
	          	<li>
	            <div onclick="filedownload('${f.fileGroupId}', ${f.fileSeq})" target="_blank">${f.fileOrgName}</div>&nbsp;&nbsp;
	            <button type="button" onclick="deleteExistingFile('${f.fileGroupId}', ${f.fileSeq}, ${faqId})">삭제</button>
	          	</li>`
				).join('');
			}
		})
		.catch(console.error);
}
// 파일 다운로드
function filedownload(fileGroupId, fileSeq) {
	axios({
			method: 'get',
			url: `/files/download`,
			params: { groupId: fileGroupId, seq: fileSeq },
			responseType: 'blob'
		})
		.then(response => {
			const blob = new Blob([response.data]);
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

// 기존 파일 삭제
function deleteExistingFile(fileGroupId, seq, faqId) {
	axios.get('/csc/faq/admin/deleteFile', {
			params: { groupId: fileGroupId, seq }
		})
		.then(() => showDetail(faqId))
		.catch(console.error);
}

// 기존 상세 조회 초기화
function resetDetail() {

	document.getElementById('fileGroupNo').value = '';
	document.getElementById("btn-delete").style.display = "none";
	document.getElementById("file").style.display = "none";
	document.getElementById("existing-files").innerHTML = "";
	document.getElementById("btn-save").innerHTML = "등록";
	document.querySelector('.info-table').style.display = 'none';
	document.getElementById('info-table-tbody').innerHTML = '';
	document.querySelector('input[name="faqTitle"]').value = '';
	window.editor?.setData('');
	document.getElementById('faqFileInput').value = '';
}

// 파일 삽입 및 수정
function insertOrUpdate() {
	const form = document.getElementById('form-data');
	const fd = new FormData(form);

	fd.set('faqContent', window.editor?.getData() || '');

	if (document.querySelector('.info-table').style.display === 'none') {
		axios.post('/csc/faq/admin/insertFaq', fd)
			.then(() => {
				resetDetail();
				fetchFaqs(1);
			})
			.catch(err => console.error('등록 실패:', err.response || err));
	} else {
		axios.post('/csc/faq/admin/updateFaq', fd)
			.then(() => {
				resetDetail();
				fetchFaqs(window.currentPage);
				showDetail(window.currentFaqId);
			})
			.catch(err => console.error('수정 실패:', err.response || err));
	}
}

function deleteFaq() {
	const form = document.getElementById('form-data');
	const fd = new FormData(form);
	fd.set('faqContent', window.editor?.getData() || '');

	axios.post('/csc/faq/admin/deleteFaq', fd)
		.then(() => {
			fetchFaqs(1);
			resetDetail();
		})
		.catch(err => console.error('삭제 실패:', err.response || err));
}

