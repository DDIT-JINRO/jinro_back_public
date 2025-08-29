function univManagement() {

	document.getElementById('tgDepart').innerHTML = `<tr><td colspan='5' style="text-align: center;">대학을 선택하세요.</td></tr>`;

	const pageSize = 10;


	function fetchUnivList(page = 1) {
		const keyword = document.querySelector('input[name="keyword"]').value;
		const status = document.querySelector('select[name="status"]').value;
		
		axios.get('/ertds/univ/uvsrch/universities', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status

			}
		}).then(({ data }) => {
			// 페이지 정보
			document.getElementById("univListPage").innerText = data.data.currentPage;
			document.getElementById("univListTotalPage").innerText = data.data.totalPages;
			const result = data.data;

			const countEl = document.getElementById('univList-count');
			if (countEl) countEl.textContent = parseInt(result.total, 10).toLocaleString();

			const listEl = document.getElementById('univList');
			if (!listEl) return;

			if (result.content.length < 1 && keyword.trim() !== '') {
				listEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
			} else {
				const rows = result.content.map(item => `
										  <tr>
											<td>${item.rnum}</td>
											<td>${item.univName}</td>
											<td>${item.univGubun}</td>
											<td>${item.univType}</td>
											<td>${item.univRegion}</td>

										  </tr>`).join('');
				listEl.innerHTML = rows;
			}
			renderPaginationUniv(result);
		})
			.catch(err => console.error('유저 목록 조회 중 에러:', err));
	}

	function renderPaginationUniv({ startPage, endPage, currentPage, totalPages }) {
		let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

		for (let p = startPage; p <= endPage; p++) {
			html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}

		html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

		const footer = document.querySelector('.univListPage');
		if (footer) footer.innerHTML = html;
	}

	function univListPangingFn() {
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
					fetchUnivList(page);
				}
			});
		}
	}

	document.getElementById("univList").addEventListener("click", function(e) {

		const tr = e.target.closest("tr");
		if (!tr) return;

		const tds = tr.querySelectorAll("td");
		const id = tds[0].textContent.trim();

		univDetail(id);
	});

	function univDetail(id) {

		univDepDetailReset();

		axios.get(`/ertds/univ/uvsrch/universities/${id}`)
			.then(res => {

				const univVO = res.data.data;
				const univDeptList = res.data.deptData;

				const univGubunSelect = document.getElementById('univ-detail-univGubun');
				const optionsGubun = univGubunSelect.options;
				const selectedValueGubun = univVO.univGubun;

				for (let i = 0; i < optionsGubun.length; i++) {
					if (optionsGubun[i].value === selectedValueGubun) {
						optionsGubun[i].selected = true;
						break;
					}
				}

				const univTypeSelect = document.getElementById('univ-detail-univType');
				const optionsType = univTypeSelect.options;
				const selectedValueType = univVO.univType;

				for (let i = 0; i < optionsType.length; i++) {
					if (optionsType[i].value === selectedValueType) {
						optionsType[i].selected = true;
						break;
					}
				}

				document.getElementById('univ-dept-detail-univId').value = univVO.univId;
				document.getElementById('univ-dept-detail-univName').value = univVO.univName;

				document.getElementById('univ-detail-univId').value = univVO.univId || '';
				document.getElementById('univ-detail-univName').value = univVO.univName || '';
				document.getElementById('univ-detail-univRegion').value = univVO.univRegion || '';
				document.getElementById('univ-detail-univAddr').value = univVO.univAddr || '';
				document.getElementById('univ-detail-univUrl').value = univVO.univUrl || '';

				const tgDepart = document.getElementById('tgDepart');

				if (univDeptList < 1) {
					tgDepart.innerHTML = `<tr><td colspan='5' style="text-align: center;">등록된 학과 정보가 없습니다.</td></tr>`;
				} else {
					const rows = univDeptList.map(item => `
														  <tr id="${item.udId}">
															<td>${item.udName == null ? '데이터 없음' : item.udName}</td>
															<td style="text-align: right;">${item.udTuition == null ? '데이터 없음' : formatNumberWithCommas(item.udTuition)}</td>
															<td style="text-align: right;">${item.udScholar == null ? '데이터 없음' : formatNumberWithCommas(item.udScholar)}</td>
															<td style="text-align: right;">${item.udCompetition == null ? '데이터 없음' : item.udCompetition}</td>
															<td style="text-align: right;">${item.udEmpRate == null ? '데이터 없음' : item.udEmpRate}</td>
															<td style="display:none;">${item.uddId == null ? '데이터 없음' : item.uddId}</td>
														  </tr>`).join('');
					tgDepart.innerHTML = rows;
				}
			});
	};

	document.getElementById('tgDepart').addEventListener('click', function(e) {
		univDepDetail(e);
	});

	function univDepDetailReset() {
		document.getElementById('univ-dept-detail-udId').value = '';
		document.getElementById('univ-dept-detail-udName').value = '';
		document.getElementById('univ-dept-detail-udTuition').value = '';
		document.getElementById('univ-dept-detail-udScholar').value = '';
		document.getElementById('univ-dept-detail-udCompetition').value = '';
		document.getElementById('univ-dept-detail-udEmpRate').value = '';

	}

	function univDepDetail(e) {
		const tr = e.target.closest('tr');
		const tds = tr.querySelectorAll('td');

		let udName = "";
		let udTuition = "";
		let udScholar = "";
		let udCompetition = "";
		let udEmpRate = "";
		let uddId = "";
		if (tds[0].textContent != null) {
			udName = tds[0].textContent;
		}
		if (tds[1].textContent != null) {
			udTuition = tds[1].textContent;
		}
		if (tds[2].textContent != null) {
			udScholar = tds[2].textContent;
		}
		if (tds[3].textContent != null) {
			udCompetition = tds[3].textContent;
		}
		if (tds[4].textContent != null) {
			udEmpRate = tds[4].textContent;
		}
		if (tds[5].textContent != null) {
			uddId = tds[5].textContent;
		}

		if (!tr) {
			return;
		}

		const udId = tr.id;
		const univId = document.getElementById('univ-detail-univId').value;
		const univName = document.getElementById('univ-detail-univName').value;

		document.getElementById('univ-dept-detail-uddId').value = uddId;
		document.getElementById('univ-dept-detail-univId').value = univId;
		document.getElementById('univ-dept-detail-univName').value = univName;
		document.getElementById('univ-dept-detail-udId').value = udId;
		document.getElementById('univ-dept-detail-udName').value = udName;
		document.getElementById('univ-dept-detail-udTuition').value = udTuition;
		document.getElementById('univ-dept-detail-udScholar').value = udScholar;
		document.getElementById('univ-dept-detail-udCompetition').value = udCompetition;
		document.getElementById('univ-dept-detail-udEmpRate').value = udEmpRate;
	}

	function formatNumberWithCommas(number) {
		if (number) {
			return number.toLocaleString('ko-KR');
		} else {
			return 0;
		}
	}

	function univGubunFn(stat) {
		if (stat === 'G21001') return '국립';
		if (stat === 'G21002') return '공립';
		if (stat === 'G21003') return '사립';
	}
	function univType(stat) {
		if (stat === 'G20001') return '대학(4년제)';
		if (stat === 'G20002') return '전문대학';

	}

	document.getElementById('univReset').addEventListener('click', function() {

		univDepDetailReset();
		document.getElementById('univ-dept-detail-univId').value = '';
		document.getElementById('univ-dept-detail-univName').value = '';
		document.getElementById('tgDepart').innerHTML = `<tr><td colspan='5' style="text-align: center;">대학을 선택하세요.</td></tr>`;

		const detailInputs = [
			'univ-detail-univId',
			'univ-detail-univName',
			'univ-detail-univGubun',
			'univ-detail-univRegion',
			'univ-detail-univAddr',
			'univ-detail-univType',
			'univ-detail-univUrl'
		];

		detailInputs.forEach(id => {
			const inputElement = document.getElementById(id);
			if (inputElement) {
				if (id === 'univ-detail-univId') {
					inputElement.value = '';
				} else {
					inputElement.value = '';
				}
			}
		});
	});

	document.getElementById('univSave').addEventListener('click', function() {

		const inputUnivId = document.getElementById('univ-detail-univId').value;
		const inputUnivName = document.getElementById('univ-detail-univName').value;
		const inputUnivGubun = document.getElementById('univ-detail-univGubun').value;
		const inputUnivRegion = document.getElementById('univ-detail-univRegion').value;
		const inputUnivAddr = document.getElementById('univ-detail-univAddr').value;
		const inputUnivType = document.getElementById('univ-detail-univType').value;
		const inputUnivUrl = document.getElementById('univ-detail-univUrl').value;

		let formData = new FormData();

		formData.append('univName', inputUnivName);
		formData.append('univGubun', inputUnivGubun);
		formData.append('univRegion', inputUnivRegion);
		formData.append('univAddr', inputUnivAddr);
		formData.append('univType', inputUnivType);
		formData.append('univUrl', inputUnivUrl);


		if (inputUnivId == null || inputUnivId == '') {
			axios.post('/ertds/univ/uvsrch/universities', formData).then(res => {
				showConfirm2("등록이 완료되었습니다.","",
					() => {
						fetchUnivList(1);
					}
				);
			})
		} else {
			axios.put(`/ertds/univ/uvsrch/universities/${inputUnivId}`, formData).then(res => {
				showConfirm2("수정이 완료되었습니다.","",
					() => {
						fetchUnivList(1);
					}
				);
			})
		}
	})

	document.getElementById('univDel').addEventListener('click', function() {

		const univId = document.getElementById('univ-detail-univId').value;

		if (univId == null || univId == '') {
			showConfirm2("삭제할 대학을 선택하세요.","",
				() => {
				    return;
				}
			);
		} else {
			if (confirm('삭제된 데이터는 복구할 수 없으며, 모든 정보가 삭제됩니다.\n정말로 삭제하시겠습니까?')) {
				axios.delete(`/ertds/univ/uvsrch/universities/${univId}`).then(res => {
					showConfirm2(res.data.message,"",
						() => {
							fetchUnivList(1);
						}
					);
				})
			}
		}

	})

	function entSearchFn() {
		const searchBtn = document.getElementById('btnSearch');
		if (searchBtn) {
			searchBtn.addEventListener("click", function() {
				window.currentPage = 1;
				fetchUnivList(1);
			});
		}

	}

	document.getElementById('univ-udDel').addEventListener('click', function() {

		const udId = document.getElementById('univ-dept-detail-udId').value;

		if (udId == null || udId == '') {
			showConfirm2("삭제할 학과를 선택하세요.","",
				() => {
				    return;
				}
			);
		} else {
			showConfirm("삭제된 데이터는 복구할 수 없으며, <br>모든 정보가 삭제됩니다.","정말로 삭제하시겠습니까?",
				() => {
					axios.delete(`/ertds/univ/uvsrch/departments/${udId}`).then(res => {
						showConfirm2(res,"",
							() => {
							    return;
							}
						);
					})
				},
				() => {
					
				}
			);
		}

	})

	document.getElementById('univ-udMod').addEventListener('click', function() {

		const udId = document.getElementById('univ-dept-detail-udId').value;

		if (udId == null || udId == '') {
			showConfirm2("수정할 학과를 선택하세요.","",
				() => {
				    return;
				}
			);
		} else {
			showConfirm("정말로 수정하시겠습니까?","",
				() => {
					const uddId = document.getElementById('univ-dept-detail-uddId').value;
					const univId = document.getElementById('univ-dept-detail-univId').value;
					const udName = document.getElementById('univ-dept-detail-udName').value;
					const udTuition = document.getElementById('univ-dept-detail-udTuition').value == '데이터 없음' ? null : document.getElementById('univ-dept-detail-udTuition').value.replaceAll(",", "");
					const udScholar = document.getElementById('univ-dept-detail-udScholar').value == '데이터 없음' ? null : document.getElementById('univ-dept-detail-udScholar').value.replaceAll(",", "");
					const udCompetition = document.getElementById('univ-dept-detail-udCompetition').value == '데이터 없음' ? null : document.getElementById('univ-dept-detail-udCompetition').value;
					const udEmpRate = document.getElementById('univ-dept-detail-udEmpRate').value == '데이터 없음' ? null : document.getElementById('univ-dept-detail-udEmpRate').value;

					let form = new FormData();
					form.set('uddId', uddId);
					form.set('udId', udId);
					form.set('udName', udName);
					form.set('udTuition', udTuition);
					form.set('udScholar', udScholar);
					form.set('udCompetition', udCompetition);
					form.set('udEmpRate', udEmpRate);

					axios.post(`/ertds/univ/uvsrch/universities/${univId}/departments`, form).then(res => {
						showConfirm2(res.data.message,"",
							() => {
							    return;
							}
						);
					})
				},
				() => {
					
				}
			);
		}
	})

	const univDeptInModal = document.getElementById("univDept-modal-overlay");
	const univDeptInbtn = document.getElementById("univDepInsert");


	univDeptInbtn.onclick = function() {
		if (document.getElementById('univ-detail-univId').value == null || document.getElementById('univ-detail-univId').value == "") {
			showConfirm2("학과를 추가할 대학을 선택해주세요.","",
				() => {
				    return;
				}
			);
		}

		document.getElementById('showUvName').value = document.getElementById('univ-detail-univName').value;
		document.getElementById('showUvId').value = document.getElementById('univ-detail-univId').value;
		univDeptInModal.style.display = "flex";
	}

	window.onclick = function(event) {
		if (event.target === univDeptInModal) {
			univDeptInModal.style.display = "none";
		}
	}

	document.getElementById('modal-close-btn').addEventListener('click', function() {

		univDeptInModal.style.display = "none";

	})

	document.getElementById('univDept-insert-btn').addEventListener('click', function() {

		const univId = document.getElementById('showUvId').value;
		const uddId = document.getElementById('showUddId').value;
		const udTuition = document.getElementById('insertUdTuition').value;
		const udScholar = document.getElementById('insertUdScholar').value;
		const udCompetition = document.getElementById('insertUdCompetition').value;
		const udName = document.getElementById('insertUdName').value;
		const udEmpRate = document.getElementById('insertUdEmpRate').value;

		let form = new FormData();

		form.set("univId", univId);
		form.set("uddId", uddId);
		form.set("udTuition", udTuition);
		form.set("udScholar", udScholar);
		form.set("udCompetition", udCompetition);
		form.set("udName", udName);
		form.set("udEmpRate", udEmpRate);

		axios.post(`/ertds/univ/uvsrch/universities/${univId}/departments`, form).then(res => {
			showConfirm2(res.data.message,"",
				() => {
				    return;
				}
			);
		})
	})
	const inputKeyword = document.querySelector("input[name='keyword']");
	inputKeyword.addEventListener('keydown', function(e){
		if(e.code === 'Enter'){
			document.getElementById('btnSearch')?.click();
		}
	})

	entSearchFn();
	fetchUnivList();
	univListPangingFn();
}

univManagement();