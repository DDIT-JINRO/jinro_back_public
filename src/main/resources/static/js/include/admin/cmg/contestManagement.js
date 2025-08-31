/**
 *
 */
function contestManagementInit () {
	function fetchCctList(page = 1) {

		const pageSize = 10;
		const keyword = document.querySelector('input[name="keyword"]').value;

		const paramData = {
			currentPage: page,
			size: pageSize,
			keyword: keyword,
		}

		axios.get('/admin/cmg/selectCttList.do', {
			params: paramData
		}).then(({data}) => {

			// 페이지 정보
			document.getElementById("cctListPage").innerText = data.articlePage.currentPage;
			document.getElementById("cctListTotalPage").innerText = data.articlePage.totalPages != 0 ? data.articlePage.totalPages : '1';

			const {articlePage, contestTypeList} = data;

			if(data.success) {
				let contestTypeHtml = '';
				contestTypeList.map(contestType => {
					contestTypeHtml += `<option value="${contestType.ccId}">${contestType.ccName}</option>`
				})

				document.getElementById('contestType').innerHTML = contestTypeHtml;

				const countEl = document.getElementById('cctList-count');
				if (countEl) {
					countEl.textContent = parseInt(articlePage.total, 10).toLocaleString();
				}

				const listEl = document.getElementById('cctList');
				if (!listEl) return;

				if (articlePage.content.length < 1 && keyword.trim() != '') {
					listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
				} else {
					const rows = articlePage.content.map(item =>{

						const formattedDate = formatDateOne(item.contestCreatedAt);

						return `<tr>
									<td style="display: none;">${item.contestId}</td>
									<td>${item.rnum}</td>
									<td class="contestTitle">${item.contestTitle}</td>
									<td>${formattedDate}</td>
									<td class="contestHost">${item.contestHost}</td>
								</tr>`;
						}).join('');
					listEl.innerHTML = rows;
				}
				renderPaginationCtt(data.articlePage);
			}
		})
		.catch(err => console.error('목록 조회 중 에러:', err));
	}

	function renderPaginationCtt({ startPage, endPage, currentPage, totalPages }) {
		let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

		for (let p = startPage; p <= endPage; p++) {
			if(totalPages == 0) p = 1;
			html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}

		html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

		const footer = document.querySelector('.cctListPage');
		if (footer) footer.innerHTML = html;
	}

	function cctListPangingFn() {
		const cctListPaginationContainer = document.querySelector('.panel-footer.pagination');
		if (cctListPaginationContainer) {

			cctListPaginationContainer.addEventListener('click', e => {
				e.preventDefault();
				const link = e.target.closest('a[data-page]');

				if (!link || link.parentElement.classList.contains('disabled')) {
					return;
				}

				const page = parseInt(link.dataset.page, 10);

				if (!isNaN(page) && page > 0) {
					fetchCctList(page);
				}
			});
		}
	}

	document.getElementById("cctList").addEventListener("click", function(e) {
		const tr = e.target.closest("tr");
		if (!tr) return;

		const tds = tr.querySelectorAll("td");
		const id = tds[0].textContent.trim();

		let formData = new FormData();
		formData.set("id", id);

		cctDetail(formData);
	});

	function cctDetail(formData) {
		axios.post('/admin/cmg/selectCctDetail.do', formData)
			.then(({data}) => {
				const {cttDetail, success} = data;

				if(success) {
					const formattedStartDate = formatDateOne(cttDetail.contestStartDate);
					const formattedEndDate   = formatDateOne(cttDetail.contestEndDate);

					// 우측 상세 내용 출력 시작
					document.getElementById('cctImg').src                        = cttDetail.savePath;
					document.getElementById('actName').innerHTML                 = cttDetail.contestTitle
					document.getElementById('contestHostProfile').innerHTML      = cttDetail.contestHost
					document.getElementById('contestOrganizerProfile').innerHTML = cttDetail.contestOrganizer == null ? '-' : cttDetail.contestOrganizer == 'N/A' ? '-' : cttDetail.contestOrganizer;
					document.getElementById('contestDate').innerHTML             = `${formattedStartDate} - ${formattedEndDate} `;
					document.getElementById('cctDetailAbout').innerHTML          = `${cttDetail.descriptionSections == null ? '활동 설명이 없습니다.' : cttDetail.descriptionSections[0]}`;

					// 하단 상세 내용 출력 시작
					document.getElementById('contestId').value = cttDetail.contestId

					// 이미지 출력 시작
					const cctImgPreview = document.getElementById('cctImgPreview');
					const imageUploadBox = document.getElementById('imageUploadBox');
					if (cttDetail.savePath) {
						cctImgPreview.src = cttDetail.savePath;
						cctImgPreview.style.display = 'block';
						if (imageUploadBox) {
							imageUploadBox.querySelector('i').style.display = 'none';
							imageUploadBox.querySelector('p').style.display = 'none';
						}
					} else {
						cctImgPreview.src = '';
						cctImgPreview.style.display = 'none';
						if (imageUploadBox) {
							imageUploadBox.querySelector('i').style.display = 'block';
							imageUploadBox.querySelector('p').style.display = 'block';
						}
					}
					// 이미지 출력 종료

					document.getElementById('contestTitle').value = cttDetail.contestTitle

					const contestTargetSelect = document.getElementById('contestTarget');
					const targetOptions = contestTargetSelect.options;
					const targetSelectedValue = cttDetail.contestTarget;
					for (let i = 0; i < targetOptions.length; i++) {
						if (targetOptions[i].value === targetSelectedValue) {
							targetOptions[i].selected = true;
							break;
						}
					}
					document.getElementById('applicationMethod').value      = cttDetail.applicationMethod == null ? '-' : cttDetail.applicationMethod == 'N/A' ? '-' : cttDetail.applicationMethod;
					document.getElementById('awardType').value              = cttDetail.awardType;
					document.getElementById('contestUrl').value             = cttDetail.contestUrl == null ? '-' : cttDetail.contestUrl == 'N/A' ? '-' : cttDetail.contestUrl;
					document.getElementById('contestHost').value            = cttDetail.contestHost == null ? '-' : cttDetail.contestHost == 'N/A' ? '-' : cttDetail.contestHost;
					document.getElementById('contestSponsor').value         = cttDetail.contestSponsor == null ? '-' : cttDetail.contestSponsor == 'N/A' ? '-' : cttDetail.contestSponsor;
					document.getElementById('contestOrganizer').value       = cttDetail.contestOrganizer == null ? '-' : cttDetail.contestOrganizer == 'N/A' ? '-' : cttDetail.contestOrganizer;
					document.getElementById('contestStartDate').value       = formatDateTwo(cttDetail.contestStartDate);
					document.getElementById('contestEndDate').value         = formatDateTwo(cttDetail.contestEndDate);
					document.getElementById('contestDescription').innerHTML = cttDetail.contestDescription;
				}
			})
			.catch(error => {
				console.error('활동 정보 불러오기 실패', error);
			});
	}

	document.getElementById('btnSearch').addEventListener("click", function() {
		window.currentPage = 1;
		fetchCctList(1);
	});

	function imgView() {
		const cctImgFile     = document.getElementById('cctImgFile');
		const cctImgPreview  = document.getElementById('cctImgPreview');
		const btnChangeImg   = document.getElementById('btnChangeImg');
		const imageUploadBox = document.getElementById('imageUploadBox');

		cctImgFile.addEventListener('change', (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();

				reader.onload = (e) => {
					cctImgPreview.src = e.target.result;
					cctImgPreview.style.display = 'block';
					imageUploadBox.querySelector('i').style.display = 'none';
					imageUploadBox.querySelector('p').style.display = 'none';
				};
				reader.readAsDataURL(file);
			}
		});

		btnChangeImg.addEventListener('click', () => {
			cctImgFile.click();
		});
	}

	function cctSave() {
	    const saveBtn = document.getElementById('btnRegister');

	    saveBtn.addEventListener('click', function() {
	        const form = new FormData();

	        const contestData = {
	            contestTitle       : document.getElementById('contestTitle').value.trim(),
	            contestDescription : document.getElementById('contestDescription').value.trim(),
	            contestType        : document.getElementById('contestType').value,
	            contestGubunCode   : 'G32001',
	            contestTarget      : document.getElementById('contestTarget').value,
	            contestStartDate   : document.getElementById('contestStartDate').value,
	            contestEndDate     : document.getElementById('contestEndDate').value,
	            contestHost        : document.getElementById('contestHost').value.trim(),
	            contestOrganizer   : document.getElementById('contestOrganizer').value.trim(),
	            contestSponsor     : document.getElementById('contestSponsor').value.trim(),
	            applicationMethod  : document.getElementById('applicationMethod').value.trim(),
	            awardType          : document.getElementById('awardType').value.trim(),
	            contestUrl         : document.getElementById('contestUrl').value.trim()
	        };

			const contestId = document.getElementById('contestId').value.trim();
			if (contestId && contestId !== '-') {
			    form.append("contestId", contestId);
			}

	        form.append("contestData", JSON.stringify(contestData));

	        const actImgFile = document.getElementById('cctImgFile').files[0];
	        if (actImgFile) {
	            form.append("contestFiles", actImgFile);
	        }

	        axios.post('/prg/ctt/contestUpdate.do', form).then(res => {
				showConfirm2("등록/수정 완료","",
					() => {
					}
				);
				fetchCctList();
	        }).catch(err => {
	            console.error("저장 실패", err);
				showConfirm2("등록/수정 실패","",
					() => {
					}
				);
	        });
	    });
	}

	function cctDelete() {
		const deleteBtn = document.getElementById('btnDelete');

		deleteBtn.addEventListener('click', function() {
			const contestId = document.getElementById('contestId').value.trim();

			const data = {
				contestId : contestId
			}

			axios.post('/prg/ctt/contestDelete.do', data).then(res => {
				showConfirm2("삭제 완료","",
					() => {
					}
				);
				fetchCctList();
			}).catch(err => {
				console.error("삭제 실패", err);
				showConfirm2("삭제 실패","",
					() => {
					}
				);
			});

		});
	}

	function resetForm() {
		const resetButton = document.getElementById('btnReset');
		resetButton.addEventListener('click', function() {
			// 텍스트, 숫자, URL 입력 필드 초기화
			document.getElementById('contestId').value = '';
			document.getElementById('contestTitle').value = '';
			document.getElementById('contestStartDate').value = '';
			document.getElementById('contestEndDate').value = '';
			document.getElementById('contestDescription').value = '';
			document.getElementById('contestType').selectedIndex = 0;
			document.getElementById('contestTarget').selectedIndex = 0;
			document.getElementById('contestHost').value = '';
			document.getElementById('contestOrganizer').value = '';
			document.getElementById('contestSponsor').value = '';
			document.getElementById('applicationMethod').value = '';
			document.getElementById('awardType').value = '';
			document.getElementById('contestUrl').value = '';

			const cctImgFile = document.getElementById('cctImgFile');
			if (cctImgFile) {
				cctImgFile.value = ''; // 파일 선택 내용 삭제
			}

			// 이미지 미리보기 초기화
			const cctImgPreview = document.getElementById('cctImgPreview');
			const imageUploadBox = document.getElementById('imageUploadBox');

			cctImgPreview.src = '';
			cctImgPreview.style.display = 'none';

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
		});
	}

	function formatDateOne(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1)
		const dd = String(d.getDate())
		const fullYear = String(d.getFullYear());
		return `${fullYear}. ${mm}. ${dd}.`;
	}

	function formatDateTwo(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1).padStart(2,'0');
		const dd = String(d.getDate()).padStart(2,'0');
		const fullYear = String(d.getFullYear());
		return `${fullYear}-${mm}-${dd}`;
	}

	const inputKeyword = document.querySelector("input[name='keyword']");
	inputKeyword.addEventListener('keydown', function(e){
		if(e.code === 'Enter'){
			document.getElementById('btnSearch')?.click();
		}
	})

	resetForm();
	cctSave();
	cctDelete();
	imgView();
	cctListPangingFn();
	fetchCctList();
}


contestManagementInit();