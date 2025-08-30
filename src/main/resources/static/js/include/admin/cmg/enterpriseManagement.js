/**
 * */

function fetchEntList(page = 1) {

	const pageSize = 10;
	const keyword = document.querySelector('input[name="keyword"]').value;
	const status = document.querySelector('select[name="status"]').value;

	axios.get('/admin/cmg/getEntList.do', {
		params: {
			currentPage: page,
			size: pageSize,
			keyword: keyword,
			status: status

		}
	})
		.then(({ data }) => {
			// 페이지 정보
			document.getElementById("entListPage").innerText = data.currentPage;
			document.getElementById("entListTotalPage").innerText = data.totalPages != 0 ? data.totalPages : '1';

			const countEl = document.getElementById('entList-count');
			if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

			const listEl = document.getElementById('entList');
			if (!listEl) return;

			if (data.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
			} else {
				const rows = data.content.map(item => `
								  <tr>
									<td>${item.rnum}</td>
									<td><img class="entImg" src="${item.cpImgUrl}"></img></td>
									<td>${item.cpName}</td>
									<td>${item.cpRegion}</td>

								  </tr>`).join('');
				listEl.innerHTML = rows;
			}
			renderPaginationEnt(data);
		})
		.catch(err => console.error('유저 목록 조회 중 에러:', err));
}


function renderPaginationEnt({ startPage, endPage, currentPage, totalPages }) {
	let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

	for (let p = startPage; p <= endPage; p++) {
		if(totalPages == 0) p = 1;
		html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
	}

	html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

	const footer = document.querySelector('.entListPage');
	if (footer) footer.innerHTML = html;
}

function entListPangingFn() {
	const cnsListPaginationContainer = document.querySelector('.panel-footer.pagination');
	if (cnsListPaginationContainer) {
		cnsListPaginationContainer.addEventListener('click', e => {

			const link = e.target.closest('a[data-page]');

			if (!link || link.parentElement.classList.contains('disabled')) {
				e.preventDefault();
				return;
			}

			e.preventDefault();
			const page = parseInt(link.dataset.page, 10);


			if (!isNaN(page) && page > 0) {
				fetchEntList(page);
			}
		});
	}
}

document.getElementById("entList").addEventListener("click", function(e) {
	const tr = e.target.closest("tr");
	if (!tr) return;

	const tds = tr.querySelectorAll("td");
	const id = tds[0].textContent.trim();

	let formData = new FormData();
	formData.set("id", id);

	entDetail(formData);

});


function entDetail(formData) {
	axios.post('/admin/cmg/entDetail.do', formData)
		.then(res => {
			const { companyVO, filePath } = res.data;

			document.getElementById('postcode').value = "";

			const detailAbout = document.getElementById('entDetailAbout');
			detailAbout.innerHTML = `${companyVO.cpDescription == null ? '기업정보가 없습니다.' : companyVO.cpDescription}`;

			const linkElement = document.getElementById('companyWebsiteLink');
			const companyWebsiteUrl = companyVO.cpWebsite;
			if (companyWebsiteUrl) {
				linkElement.href = companyWebsiteUrl;
			} else {
				linkElement.addEventListener('click', (e) => e.preventDefault());
			}

			// --- 이미지 URL 미리보기 처리 ---
			const cpLogoPreview = document.getElementById('cpLogoPreview');
			const imageUploadBox = document.getElementById('imageUploadBox');
			if (companyVO.cpImgUrl) {
				cpLogoPreview.src = companyVO.cpImgUrl;
				cpLogoPreview.style.display = 'block';
				// URL이 있을 경우 기존 업로드 텍스트 및 아이콘 숨기기
				if (imageUploadBox) {
					imageUploadBox.querySelector('i').style.display = 'none';
					imageUploadBox.querySelector('p').style.display = 'none';
				}
			} else {
				cpLogoPreview.src = '';
				cpLogoPreview.style.display = 'none';
				// URL이 없을 경우 업로드 텍스트 및 아이콘 보이기
				if (imageUploadBox) {
					imageUploadBox.querySelector('i').style.display = 'block';
					imageUploadBox.querySelector('p').style.display = 'block';
				}
			}


			document.getElementById('cpNoOn').value = companyVO.cpId || '';
			document.getElementById('cpName').value = companyVO.cpName || '';
			document.getElementById('jibunAddress').value = companyVO.cpRegion || '';
			document.getElementById('cpSclae').value = companyVO.ccName || '';
			document.getElementById('cpWebsite').value = companyVO.cpWebsite || '';
			document.getElementById('cpImgUrl').value = companyVO.cpImgUrl || '';
			document.getElementById('cpDescription').value = companyVO.cpDescription || '';
			document.getElementById('cpBusinessNo').value = formatBusinessNumber(companyVO.cpBusino) || '';

			const cpSclaeSelect = document.getElementById('cpSclae');
			const options = cpSclaeSelect.options;

			const selectedValue = companyVO.cpScale;
			for (let i = 0; i < options.length; i++) {
				if (options[i].value === selectedValue) {
					options[i].selected = true;
					break;
				}
			}

			document.getElementById('entLogo').src = companyVO.cpImgUrl;
			document.getElementById('entName').innerHTML = companyVO.cpName || '-';
			document.getElementById('gubun').innerHTML = companyVO.cpScale || '-';
			document.getElementById('gubunName').innerHTML = companyVO.ccName || '-';
			document.getElementById('entId').innerHTML = `NO.${companyVO.cpId}` || '-';
			document.getElementById('entName2').innerText = companyVO.cpName || '-';
			document.getElementById('entAddress').innerText = companyVO.cpRegion || '-';
		})
		.catch(error => {
			console.error('기업 정보 불러오기 실패', error);
		});
}

function entSearchFn() {

	const searchBtn = document.getElementById('btnSearch');
	if (searchBtn) {
		searchBtn.addEventListener("click", function() {
			window.currentPage = 1;
			fetchEntList(1);
		});
	}

	const inputKeyword = document.querySelector("input[name='keyword']");
	inputKeyword.addEventListener('keydown', function(e){
		if(e.code === 'Enter'){
			document.getElementById('btnSearch')?.click();
		}
	})

}

document.querySelectorAll(".tab-btn").forEach(btn => {
	btn.addEventListener("click", () => {
		document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
		document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

		btn.classList.add("active");
		document.getElementById(btn.dataset.tab).classList.add("active");
	});
});

function imgView() {
	const cpLogoFile = document.getElementById('cpLogoFile');
	const cpLogoPreview = document.getElementById('cpLogoPreview');
	const btnChangeLogo = document.getElementById('btnChangeLogo');
	const imageUploadBox = document.getElementById('imageUploadBox');


	cpLogoFile.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				cpLogoPreview.src = e.target.result;
				cpLogoPreview.style.display = 'block';
				imageUploadBox.querySelector('i').style.display = 'none';
				imageUploadBox.querySelector('p').style.display = 'none';
			};
			reader.readAsDataURL(file);
		}
	});

	btnChangeLogo.addEventListener('click', () => {
		cpLogoFile.click();
	});
}

function execDaumPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			document.getElementById('postcode').value = data.zonecode;
			document.getElementById('jibunAddress').value = data.jibunAddress;
		}
	}).open();
}

function entSave() {
	const saveBtn = document.getElementById('btnRegister');

	saveBtn.addEventListener('click', function() {

		const cpNoOn = document.getElementById('cpNoOn').value.trim(); // ID 필드
		const cpName = document.getElementById('cpName').value.trim();
		const cpWebsite = document.getElementById('cpWebsite').value.trim();
		const cpImgUrl = document.getElementById('cpImgUrl').value.trim();
		const postcode = document.getElementById('postcode').value.trim();
		const jibunAddress = document.getElementById('jibunAddress').value.trim();
		const cpSclae = document.getElementById('cpSclae').value;
		let cpBusinessNo = document.getElementById('cpBusinessNo').value.trim();
		const cleanedBusinessNo = cpBusinessNo.replace(/-/g, '');
		const cpDescription = document.getElementById('cpDescription').value.trim();

		let form = new FormData();


		if (cpNoOn && cpNoOn !== '-') {
			form.set("cpId", cpNoOn);
		}


		form.set("cpName", cpName);
		form.set("cpWebsite", cpWebsite);
		form.set("cpImgUrl", cpImgUrl);

		form.set("cpRegion", jibunAddress);

		form.set("cpScale", cpSclae);
		form.set("cpBusino", cleanedBusinessNo);
		form.set("cpDescription", cpDescription);

		axios.post('/empt/enp/enterprisePostingUpdate.do', form).then(res => {
			showConfirm2("등록/수정 완료","",
				() => {
				}
			);
		}).catch(err => {
			console.error("저장 실패", err);
			showConfirm2("등록/수정 실패","",
				() => {
				}
			);
		});
	});
}

function formatBusinessNumber(number) {
	// 숫자를 문자열로 먼저 변환합니다.
	const numberStr = String(number);

	if (numberStr && numberStr.length === 10) {
		const part1 = numberStr.slice(0, 3);
		const part2 = numberStr.slice(3, 5);
		const part3 = numberStr.slice(5, 10);
		return `${part1}-${part2}-${part3}`;
	}
	return numberStr; // 10자리가 아니면 원본 반환
}

function resetForm() {

	const resetButton = document.getElementById('btnReset');
	resetButton.addEventListener('click', function() {
		// 텍스트, 숫자, URL 입력 필드 초기화
		document.getElementById('cpName').value = '';
		document.getElementById('cpWebsite').value = '';
		document.getElementById('cpImgUrl').value = '';
		document.getElementById('postcode').value = '';
		document.getElementById('jibunAddress').value = '';
		document.getElementById('cpBusinessNo').value = '';
		document.getElementById('cpNoOn').value = '';

		// textarea 초기화
		document.getElementById('cpDescription').value = '';

		// select 박스 초기화 (첫 번째 옵션 선택)
		document.getElementById('cpSclae').selectedIndex = 0;

		// 파일 입력 필드 초기화
		const cpLogoFile = document.getElementById('cpLogoFile');
		if (cpLogoFile) {
			cpLogoFile.value = ''; // 파일 선택 내용 삭제
		}

		// 이미지 미리보기 초기화
		const cpLogoPreview = document.getElementById('cpLogoPreview');
		const imageUploadBox = document.getElementById('imageUploadBox');

		cpLogoPreview.src = '';
		cpLogoPreview.style.display = 'none';

		// 업로드 안내 텍스트와 아이콘 다시 표시
		if (imageUploadBox) {
			const icon = imageUploadBox.querySelector('i');
			const text = imageUploadBox.querySelector('p');
			if (icon) icon.style.display = 'block';
			if (text) text.style.display = 'block';
		}

		// 변경/삭제 버튼 숨기기 (만약 있다면)
		const imageUploadControls = document.querySelector('.image-upload-controls');
		if (imageUploadControls) {
			imageUploadControls.style.display = 'none';
		}

		// 우편번호 API로 채워지는 도로명 주소 필드도 초기화
		const roadAddress = document.getElementById('roadAddress');
		if (roadAddress) {
			roadAddress.value = '';
		}
	});



}

resetForm();
entSave();
imgView();
entSearchFn();
fetchEntList();
entListPangingFn();