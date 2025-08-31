// helper: ISO 문자열 → "YYYY.MM.DD" 포맷
function formatDateYYYYMMDD(iso) {
    const d = new Date(iso);
    const yy = String(d.getFullYear()); // "2025"
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}. ${mm}. ${dd}.`;
}

// 전역 상태
window.currentPage = 1;
window.currentInqId = null;

// 실제 데이터 + 페이징 조회
function fetchInqs(page = 1) { // fetchFaqs -> fetchInqs로 변경
    const pageSize = 10;
    const keyword = document.querySelector('input[name="keyword"]').value;
    const status = document.querySelector('select[name="status"]').value; // 연도 필터 (status 이름 유지)

    axios.get('/csc/inq/admin/inqList.do', { // URL 변경
        params: {
            currentPage: page,
            size: pageSize,
            keyword: keyword,
            status: status
        }
    })
    .then(({ data }) => {
        const countEl = document.getElementById('inq-count'); // id 변경
        if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

        const listEl = document.getElementById('inq-list'); // id 변경
        if (!listEl) return;

        if (data.content.length < 1 && keyword.trim() !== '') {
            listEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">등록되지 않은 정보입니다.</td></tr>`; // colspan 변경
        } else {
            const rows = data.content.map(item => `
                <tr>
                    <td>${item.rnum}</td>
                    <td><a href="javascript:showDetail(${item.contactId})" style="cursor: pointer; text-decoration: none; color:black;">${item.contactTitle}</a></td>
                    <td>${item.contactIsPublic === 'Y' ? '공개' : '비공개'}</td>
                    <td>${formatDateYYYYMMDD(item.contactAt)}</td>
                    <td class="${item.contactReply != null ? '' : 'status-pending'}">${item.contactReply != null ? '답변 완료' : '답변 대기'}</td>
                </tr>`).join('');
            listEl.innerHTML = rows;
        }
        renderPagination(data);
    })
    .catch(err => console.error('1:1 문의 목록 조회 중 에러:', err));
}

// 페이지네이션(하단 페이지 버튼들)을 렌더링
function renderPagination({ startPage, endPage, currentPage, totalPages }) {
    let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

    for (let p = startPage; p <= endPage; p++) {
		if(totalPages == 0) p = 1;
        html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
    }

    html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

    const footer = document.querySelector('.panel-footer.pagination');
    if (footer) footer.innerHTML = html;
}

if (typeof window.inqEventsBound === 'undefined') {
    window.inqEventsBound = false;
}

// 1:1 문의 검색 및 초기화 버튼에 클릭 이벤트를 바인딩
function bindInqEvents() { // bindFaqEvents -> bindInqEvents로 변경
    if (window.inqEventsBound) return; // inqEventsBound 사용
    window.inqEventsBound = true; // inqEventsBound 사용
    const searchBtn = document.querySelector('.btn-save');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 폼 자동 제출 방지
            fetchInqs(1);
        });
    }

	const formTag = document.getElementById('searchFrm')
	if (formTag) {
		formTag.addEventListener('submit', function(e){
			e.preventDefault();
			searchBtn.click();
		})
	}

    const inqHeader = document.getElementById('inqHeader'); // id 변경
    if (inqHeader) {
        inqHeader.addEventListener('click', () => {
            const kwInput = document.querySelector('input[name="keyword"]');
            const statusSelect = document.querySelector('select[name="status"]');
            if (kwInput) kwInput.value = '';
            if (statusSelect) statusSelect.selectedIndex = 0;
            fetchInqs(1);
            resetDetail(); // 초기화 시 상세 정보도 초기화
        });
    }
}

// DOM이 준비된 후 1:1 문의 데이터 불러오기
function initAdminInqPage() { // waitForInit -> initAdminInqPage로 변경
    fetchInqs(1);        // 1:1 문의 목록 불러오기
    bindInqEvents();     // 이벤트 바인딩
}

// DOMContentLoaded 시점에 초기화 함수 호출
document.addEventListener('DOMContentLoaded', initAdminInqPage);

// 1:1 문의 세부조회
function showDetail(inqId) {
    if (!inqId) return;
    resetDetail();
    axios.get('/csc/inq/admin/inqDetail.do', { params: { inqId } })
        .then(response => {
            window.currentInqId = inqId;
            document.getElementById('inqId').value = inqId;

            const infoTable = document.querySelector('.info-table');
            infoTable.style.display = 'table';

            const resp = response.data;
            document.getElementById("info-table-tbody").innerHTML = `
                <tr>
                    <td>${resp.contactId}</td>
                    <td>${resp.contactTitle}</td>
                    <td>${resp.contactIsPublic === 'Y' ? '공개' : '비공개'}</td>
                    <td>${formatDateYYYYMMDD(resp.contactAt)}</td>
                </tr>`;

            document.querySelector('input[name="inqTitle"]').value = resp.contactTitle;
            document.getElementById('txtInqContent').value = resp.contactContent;
            document.getElementById('txtInqAnswer').value = resp.contactReply || '';
        })
        .catch(console.error);
}

// 기존 상세 조회 초기화
function resetDetail() {

    document.getElementById("btn-save").innerHTML = "등록";
    document.querySelector('.info-table').style.display = 'none';
    document.getElementById('info-table-tbody').innerHTML = '';
    document.querySelector('input[name="inqTitle"]').value = '';
    document.getElementById('txtInqContent').value = '';
    document.getElementById('txtInqAnswer').value = '';
    document.getElementById('inqId').value = '0';
    window.currentInqId = null;
}

// 1:1 문의 삽입 및 수정
function insertAnswer() {
    const form = document.getElementById('form-data');
    const fd = new FormData(form);

    fd.set('contactReply', document.getElementById('txtInqAnswer').value);
    fd.set('contactId', document.getElementById('inqId').value);

	axios.post('/csc/inq/admin/insertInq.do', fd)
		.then(() => {
			resetDetail();
			fetchInqs(1);
		})
		.catch(err => console.error('등록 실패:', err.response || err));
}
fetchInqs(1);
bindInqEvents()