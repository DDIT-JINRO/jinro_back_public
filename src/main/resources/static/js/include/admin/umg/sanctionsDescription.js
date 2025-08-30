function sanctionsDescription() {

	const hiddenCalInput = document.getElementById('comCalendarInput');
	const penaltyStatsDateBtn = document.getElementById('penaltyStatsDateBtn');
	const penaltyStatsGenBtn = document.getElementById('penaltyStatsGenBtn');
	const penaltyStatsAgeBtn = document.getElementById('penaltyStatsAgeBtn');

	const reportKewordInput = document.getElementById('searchReport')
	const penaltyKewordInput = document.getElementById('searchPenalty')
	reportKewordInput.addEventListener('keydown',function(e){
		if(e.code === 'Enter'){
			document.querySelector('.searchReportBtn')?.click();
		}
	})
	penaltyKewordInput.addEventListener('keydown', function(e) {
		if (e.code === 'Enter') {
			document.querySelector('.searchPenaltyBtn')?.click();
		}
	})

	penaltyStatsDateBtn.addEventListener('change', eventDateRangeSelect);
	penaltyStatsGenBtn.addEventListener('change', penaltyStats);
	penaltyStatsAgeBtn.addEventListener('change', penaltyStats);

	const baseColors = [
		'#5B399B',
		'#7B5EAA',
		'#8D6EE4',
		'#9B7BDD',
		'#AD94E8',
		'#BCACF0',
		'#C5BCF3',
		'#DCD2F8',
		'#EAE5F8',
		'#514578'
	];

	function getDynamicColors(dataCount) {
		const colors = [];
		for (let i = 0; i < dataCount; i++) {
			colors.push(baseColors[i % baseColors.length]);
		}
		return colors;
	}

	function eventDateRangeSelect(e){
		const selectEl = e.target.nodeName == "SELECT" ? e.target : e.target.closest('select');
		const dateValue = selectEl.value;
		if(dateValue == 'daily'){
			hiddenCalInput.value = '';
			penaltyStats();
		}else if(dateValue == 'monthly'){
			hiddenCalInput.value = '';
			penaltyStats();
		}else if(dateValue == 'selectDays'){
			if (hiddenCalInput._flatpickr) {
				hiddenCalInput._flatpickr.destroy();
			}

			flatpickr(hiddenCalInput, {
				mode: "range",
				maxDate: "today",
				disable: [date => date > new Date()],
				positionElement: selectEl,	//open되는 위치는 변경가능. select요소를 넣어줌.
				onChange: function(selectedDates) {
					if (selectedDates.length === 2) {
						const startDate = selectedDates[0];
						const endDate = selectedDates[1];
						// yyyy-mm-dd 형식으로 포맷
						const formattedStartDate = formatDate(startDate);
						const formattedEndDate = formatDate(endDate);

						document.getElementById('penaltyStatsStartDay').value = formattedStartDate;
						document.getElementById('penaltyStatsEndDay').value = formattedEndDate;

						penaltyStats(formatDateRange(formattedStartDate, formattedEndDate));
					}
				}
			});

			hiddenCalInput._flatpickr.open();
			hiddenCalInput._flatpickr.clear();
		}
	}

	function dashboardStats() {
		axios.get('/admin/pmg/getDashboardStats.do').then(res => {
			const { pendingReportCount, todayReportCount, suspendedMemberRatio } = res.data;

			document.getElementById('dailyReportCnt').innerHTML = `${todayReportCount}건`;
			document.getElementById('delayReportCnt').innerHTML = `${pendingReportCount}건`;
			document.getElementById('suspendedMemberRatio').innerHTML = `${suspendedMemberRatio}%`;

			const nonSuspendedMemberRatio = 100 - suspendedMemberRatio;

			const ctx = document.getElementById('penaltyDounutChart').getContext('2d');

			const data = {
				labels: [
					'활성 계정',
					'정지 계정'
				],
				datasets: [{
					data: [nonSuspendedMemberRatio, suspendedMemberRatio],
					backgroundColor: [
						'#A388E8',
						'#D1C4E9'

					],
					hoverOffset: 4
				}]
			};

			const config = {
				type: 'doughnut',
				data: data,
				plugins: [ChartDataLabels],
				options: {
					responsive: true,
					layout: {
						padding: 15
					},
					plugins: {
						legend: {
							position: 'bottom',
						},
						title: {
							display: false
						},
						tooltip: {
							callbacks: {
								label: function(context) {
									let label = context.label || '';
									if (label) {
										label += ': ';
									}
									if (context.parsed !== null) {
										label += context.parsed + '%';
									}
									return label;
								}
							}
						},
						datalabels: {
							formatter: (value, ctx) => {
								const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
								const pct = (value / sum * 100).toFixed(0) ;

								return pct+'%';
							},
							color: '#fff',
							font: { weight: 'bold' }
						}
					}
				}
			};

			new Chart(ctx, config);


		})
	}


	function penaltyStats(dateRange) {
		// 일별, 월별, 기간선택에 대해서 파라미터를 같이 전송해야함 ->서버에서 서로다른 쿼리 호출
		// 기간선택인 경우 startDate , endDate 까지 같이 전송함.
		// 성별 파라미터 같이 전송해야함
		// 연령 파라미터 같이 전송해야함
		const filterType = document.getElementById('penaltyStatsDateBtn').value;
		const gender	 = document.getElementById('penaltyStatsGenBtn').value;
		const ageGroup	 = document.getElementById('penaltyStatsAgeBtn').value;

		const hiddenCalInput = document.getElementById('comCalendarInput').value;

		const params = {
			filterType, gender, ageGroup
		};

		if(filterType == 'selectDays'){
			let startDate = document.getElementById('penaltyStatsStartDay').value;
			let endDate = document.getElementById('penaltyStatsEndDay').value;
			if(!startDate){
				// 기간 선택인데 날짜 지정 안한경우 월간데이터로 되돌리기 -> 기간지정안한상태로 성별, 연령대 변경 시에 대응
				document.getElementById('penaltyStatsDateBtn').value = 'monthly';
			}
			params.startDate = startDate
			params.endDate = endDate
		}else {
			document.getElementById('penaltyStatsStartDay').value = '';
			document.getElementById('penaltyStatsEndDay').value = '';
			hiddenCalInput.value = '';
		}

		if (window.penaltyStatsChartInstance) {
			window.penaltyStatsChartInstance.destroy();
		}

		axios.get('/admin/pmg/getPenaltyStats.do', {params : params})
			.then(res => {
				const penaltyData = res.data.data;

				// 라벨을 직접 분할하는 대신, Chart.js의 콜백 함수에서 처리하도록 수정
				const labels = penaltyData.map(item => item.PENALTYTYPE);
				const dataValues = penaltyData.map(item => item.COUNT);
				const colors = getDynamicColors(labels.length);

				const ctx = document.getElementById('penaltyChart').getContext('2d');

				window.penaltyStatsChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labels,
						datasets: [{
							data: dataValues,
							backgroundColor: colors,
							borderColor: colors,
							borderWidth: 1,
							barThickness: 20
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: false
							},
							title: {
								dateRange
							}
						},
						scales: {
							y: {
								beginAtZero: true,
								max: Math.max(...dataValues) + 1,
								ticks: {
									stepSize: 1
								}
							},
							x: {
								grid: {
									display: false
								},
								ticks: {
									display: true,
									autoSkip: false,
									// 라벨 회전 비활성화
									maxRotation: 0,
									minRotation: 0,
									// 새로운 콜백 함수 로직 적용
									callback: function(value) {
										const label = this.getLabelForValue(value);
										if (label.includes(" - ")) {
											return label.split(" - ");
										} else if (label.length > 6 && label.includes(' ')) {
											return label.split(' ');
										}
										return label;
									},
									font: {
										size: 10
									}
								}
							}
						}
					}
				});
			})
			.catch(error => {
				console.error('제재 유형 데이터 조회 중 오류 발생:', error);
			});
	}

	dashboardStats();
	penaltyStats();

	window.currentPage = 1;
	const openNewPenaltyModalBtn = document.getElementById('openNewPenaltyModalBtn');
	const cancelBtn = document.getElementById('cancelBtn');
	const penaltyModal = document.getElementById('penaltyModal');
	const confirmBtn = document.getElementById('confirmBtn');
	let reportListCache = [];
	const fileListContainer = document.getElementById('file-list');
	const reportModifyBtn = document.getElementById('reportModify');

	confirmBtn.addEventListener('click', function() {
		const selectedReportId = document.getElementById('modalMemId').value;
		if (!selectedReportId) {
			showConfirm2("신고대상자를 선택해주세요.","",
				() => {
				}
			);
		    return;
		}

		const selectedPenaltyTypeEl = document.querySelector('#modalPenaltyType .penalty-type-label.active');
		if (!selectedPenaltyTypeEl) {
			showConfirm2("제재 유형을 선택해주세요.","",
				() => {
				}
			);
		    return;
		}
		const selectedPenaltyType = selectedPenaltyTypeEl.getAttribute('data-type');
		const hiddenStart = document.getElementById('penaltyStart');
		const hiddenEnd = document.getElementById('penaltyEnd');
		if (selectedPenaltyType == 'G14002' && (!hiddenStart.value || !hiddenEnd.value)) {
			showConfirm2("정지 기간을 선택해주세요.","",
				() => {
				}
			);
		    return;
		}

		const reasonInput = document.getElementById('modalReason');
		const reason = reasonInput.value.trim();
		if (!reason) {
			showConfirm2("제재 사유를 입력해주세요.","",
				() => {
				}
			);
			reasonInput.focus();
		    return;
		}

		const evidenceInput = document.getElementById('evidenceFile');
		const files = evidenceInput.files;
		if (files.length === 0) {
			showConfirm2("증빙 자료를 첨부해주세요.","",
				() => {
				}
			);
		    return;
		}

		showConfirm("정말로 제재하시겠습니까?", "",
			() => {
				const formData = new FormData();
				formData.append('reportId', selectedReportId);
				formData.append('mpType', selectedPenaltyType);
				formData.append('mpWarnReason', reason);

				if(selectedPenaltyType == 'G14002'){
					formData.append('penaltyStart', hiddenStart.value);
					formData.append('penaltyEnd', hiddenEnd.value);
				}

				for (let i = 0; i < files.length; i++) {
					formData.append('evidenceFiles', files[i]);
				}

				penaltySubmit(formData);
			},
			() => {
				return;
			}
		)
	});

		// 신규 제재 등록 모달 -> 제재 유형 선택 이벤트
	document.querySelectorAll('#modalPenaltyType .penalty-type-label').forEach(el => {
		el.addEventListener('click', () => {
			const hiddenStart 	= document.getElementById('penaltyStart');
			const hiddenEnd		= document.getElementById('penaltyEnd');
			document.querySelectorAll('#modalPenaltyType .penalty-type-label').forEach(e => e.classList.remove('active'));

			el.classList.add('active');

			// 정지에 대해서 기간을 선택할 수 있도록 달력UI 제공
			if(el.dataset.type == 'G14002'){
				const hiddenCalInput = document.getElementById('hiddenCalInput');
				if (hiddenCalInput._flatpickr) {
					hiddenCalInput.value = '';
					hiddenCalInput._flatpickr.destroy();
				}
				flatpickr(hiddenCalInput, {
					mode: "range",
					minDate: "today",
					positionElement: el,	//open되는 위치는 변경가능. select요소를 넣어줌.
					onChange: function(selectedDates) {
						if (selectedDates.length === 2) {
							hiddenStart.value 	= hiddenCalInput.value.split(' to ')[0]?.trim();
							hiddenEnd.value 	= hiddenCalInput.value.split(' to ')[1]?.trim();

							const startDate 	= selectedDates[0];
							const endDate 		= selectedDates[1];
							const dates = daysBetween(startDate, endDate, {inclusive:true});
							const fmStart 		= formatDateMMDD(startDate);
							const fmEnd 		= formatDateMMDD(endDate);
							const formattedRange = formatDateRange(fmStart, fmEnd);

							// === 새로 추가: 표시 반영 ===
							const badge = document.getElementById('penaltyPeriod');
							document.getElementById('penaltyPeriodRange').textContent = `${formattedRange}`;
							document.getElementById('penaltyPeriodDays').textContent  = `총 ${dates}일`;
							badge.hidden = false;
						}
					}
				});

				hiddenCalInput._flatpickr.open();
				hiddenCalInput._flatpickr.clear();
			}else{
				const badge = document.getElementById('penaltyPeriod');
				badge.hidden = true;
				hiddenStart.value = '';
				hiddenEnd.value = '';
			}
		});
	});

	function daysBetween(start, end, { inclusive = false } = {}) {
	  const s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
	  const e = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
	  const diffDays = Math.floor((e - s) / 86400000); // 86,400,000ms = 1일
	  return inclusive ? diffDays + 1 : diffDays;
	}

	function penaltySubmit(formData) {
		axios.post('/admin/umg/submitPenalty.do', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(res => {
				showConfirm2("제재가 정상 처리되었습니다.","",
					() => {
						closeModal();
						fetchReportList(1);
						fetchPenaltyList(1);
					}
				);
			})
			.catch(err => {
				console.error(err);
				showConfirm2("제재 처리 중 오류가 발생했습니다.","",
					() => {
					}
				);
			});
	}


	document.getElementById('evidenceFile').addEventListener('change', function() {
		fileListContainer.innerHTML = '';

		const files = this.files;
		if (files.length === 0) {
			fileListContainer.textContent = '선택된 파일이 없습니다.';
			return;
		}

		const ul = document.createElement('ul');
		for (let i = 0; i < files.length; i++) {
			const li = document.createElement('li');
			li.textContent = files[i].name;
			ul.appendChild(li);
		}
		fileListContainer.appendChild(ul);
	});

	function openModal() {
		const select = document.getElementById('modalMemId');
		const fileListContainer = document.getElementById('file-list');
		fileListContainer.innerHTML = '선택된 파일이 없습니다.';
		select.innerHTML = '<option value="">-- 선택하세요 --</option>';

		reportListCache.forEach((report) => {
			if (report.reportStatus == 'S03001') {
				const option = document.createElement('option');
				option.value = report.reportId;
				option.textContent = `신고대상자 : ${report.reportedName} (신고ID : ${report.reportId})`;
				select.appendChild(option);
			}

		});

		if (penaltyModal) {
			penaltyModal.style = "";
			penaltyModal.classList.add('visible');
		}
	}

	function closeModal() {
		if (penaltyModal) {
			penaltyModal.classList.remove('visible');
		}

		const evidenceInput = document.getElementById('evidenceFile');
		evidenceInput.value = '';

		const fileListContainer = document.getElementById('file-list');
		fileListContainer.innerHTML = '선택된 파일이 없습니다.';

		document.getElementById('modalReason').value = '';

		const activePenaltyType = document.querySelector('#modalPenaltyType .penalty-type-label.active');
		if (activePenaltyType) {
			activePenaltyType.classList.remove('active');
		}
	}

	openNewPenaltyModalBtn.addEventListener('click', openModal);
	cancelBtn.addEventListener('click', closeModal);

	let reportSortBy = null;
	let reportSortOrder = 'asc';

	function fetchReportList(page = 1, isFirst = false) {
		const pageSize = 10;
		const keyword = document.querySelector('input[name="keywordReport"]').value;
		const status = document.querySelector('select[name="statusReport"]').value;
		let sortByVal = reportSortBy ||  document.querySelector('.reportListBtnGroup .public-toggle-button.active').dataset.sortBy;
		let sortOrderVal = reportSortOrder || document.getElementById('ReportListSortOrder').value;
		const filter = document.getElementById('ReportListFilter').value;

		axios.get('/admin/umg/getReportList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status,
				sortBy: sortByVal,
				sortOrder: sortOrderVal,
				filter: filter
			}
		})
			.then(({ data }) => {
				// 페이지 정보
				document.getElementById("reportListPage").innerText = data.currentPage;
				document.getElementById("reportListTotalPage").innerText = data.totalPages != 0 ? data.totalPages : '1';

				reportListCache = data.content;

				const countEl = document.getElementById('reportList-count');
				if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

				const listEl = document.getElementById('reportList');
				if (!listEl) return;

				if (data.content.length < 1 && keyword.trim() !== '') {
					listEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;

				} else {
					const rows = data.content.map(item => `
						          <tr>
								  	<td style="display:none;">${item.reportId}</td>
						            <td>${item.rnum}</td>
						            <td>${item.reporterName}</td>
						            <td>${item.reportedName !== null ? item.reportedName : '-'}</td>
						            <td>${reportStatusCng(item.reportStatus)}</td>
						            <td>${formatDateMMDD(item.reportCreatedAt)}</td>

						          </tr>`).join('');
					listEl.innerHTML = rows;
				}
				renderPagination(data);
			})
			.catch(err => console.error('유저 목록 조회 중 에러:', err));
	}

	searchReportBtn = document.querySelector(".searchReportBtn");
	if (searchReportBtn) {
		searchReportBtn.addEventListener("click", function() {
			window.currentPage = 1;
			fetchReportList(1);
		});
	}

	searchPenaltyBtn = document.querySelector(".searchPenaltyBtn");
	if (searchPenaltyBtn) {
		searchPenaltyBtn.addEventListener("click", function() {
			window.currentPage = 1;
			fetchPenaltyList(1);
		});
	}

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

	function renderPaginationPenalty({ startPage, endPage, currentPage, totalPages }) {

		let html = `<a href="#" data-page="${startPage - 1}" class="page-link-penalty ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

		for (let p = startPage; p <= endPage; p++) {
			if(totalPages == 0) p = 1;
			html += `<a href="#" data-page="${p}" class="page-link-penalty ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}

		html += `<a href="#" data-page="${endPage + 1}" class="page-link-penalty ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

		const footer = document.querySelector('.panel-footer.paginationPenalty');
		if (footer) footer.innerHTML = html;
	}

	reportPaginationContainer = document.querySelector('.panel-footer.pagination');
	if (reportPaginationContainer) {
		reportPaginationContainer.addEventListener('click', e => {

			const link = e.target.closest('a[data-page]');

			if (!link || link.parentElement.classList.contains('disabled')) {
				e.preventDefault();
				return;
			}

			e.preventDefault();
			const page = parseInt(link.dataset.page, 10);

			if (!isNaN(page) && page > 0) {
				fetchReportList(page);
			}
		});
	}

	penaltyPaginationContainer = document.querySelector('.panel-footer.paginationPenalty');
	if (penaltyPaginationContainer) {
		penaltyPaginationContainer.addEventListener('click', e => {

			const link = e.target.closest('a[data-page]');


			if (!link || link.parentElement.classList.contains('disabled')) {
				e.preventDefault();
				return;
			}

			e.preventDefault();
			const page = parseInt(link.dataset.page, 10);

			if (!isNaN(page) && page > 0) {
				fetchPenaltyList(page);
			}
		});
	}

	document.getElementById("reportList").addEventListener("click", function(e) {
		const tr = e.target.closest("tr");
		if (!tr) return;

		const tds = tr.querySelectorAll("td");
		const id = tds[0].textContent.trim();


		let formData = new FormData();
		formData.set("id", id);

		reportDetail(formData);

	});

	function reportDetail(formData) {

		axios.post('/admin/umg/getReportDetail.do', formData)
			.then(res => {
				const { reportVO, filePath, fileOrgName } = res.data;
				const fileContainer = document.getElementById('report-detail-file');

				document.getElementById('report-detail-mpId').value = reportVO.reportId || '-';
				document.getElementById('report-detail-mpType').value = reportType(reportVO.targetType) || '-';
				document.getElementById('report-detail-memId').value = reportVO.memId || '-';
				document.getElementById('report-detail-memName').value = reportVO.reporterName || '-';
				document.getElementById('report-detail-targetId').value = reportVO.reportedMemId || '-';
				document.getElementById('report-detail-targetName').value = reportVO.reportedName || '-';
				document.getElementById('report-detail-reason').value = reportVO.reportReason || '-';
				document.getElementById('report-detail-warnDate').value = formatDateMMDD(reportVO.reportCreatedAt) || '-';
				const selectElement = document.getElementById("report-detail-status");

				if(reportVO.reportStatus == 'S03001'){
					selectElement.disabled = false;
				}else{
					selectElement.disabled = true;
				}

				for (let i = 0; i < selectElement.options.length; i++) {
					if (selectElement.options[i].value === reportVO.reportStatus) {
						selectElement.options[i].selected = true;
						break;
					}
				}
				fileContainer.innerHTML = '-';

				if (filePath != null || filePath != undefined) {

					const ext = filePath.split('.').pop().toLowerCase();

					fileContainer.innerHTML = `<a href="${filePath}" download>${fileOrgName}</a>`;

				}

			})
			.catch(error => {
				console.error('회원 정보 불러오기 실패', error);
			});
	}

	function reportType(stat) {
		if (stat === 'G10001') return '게시글 신고';
		if (stat === 'G10002') return '댓글 신고';
	}

	function formatDateRange(fS, fE){
		return `${fS} ~ ${fE} 기간`
	}

	function formatDateMMDD(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1)
		const dd = String(d.getDate())
		const fullYear = String(d.getFullYear());
		return `${fullYear}.${mm}.${dd}.`;
	}

	function formatDate(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1)
		const dd = String(d.getDate())
		const fullYear = String(d.getFullYear());

		return `${fullYear}-${mm}-${dd}`;
	}

	let penaltySortBy = '';
	let penaltySortOrder = 'asc';

	function fetchPenaltyList(page = 1) {
		const pageSize = 10;
		const keyword = document.querySelector('input[name="keywordPenalty"]').value;
		const status = document.querySelector('select[name="statusPenalty"]').value;
		const mpType = document.getElementById('penaltyTypeFilter').value;

		axios.get('/admin/umg/getPenaltyList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status,
				sortBy: penaltySortBy,
	            sortOrder: penaltySortOrder,
	            mpType: mpType
			}
		})
		.then(({ data }) => {
			// 페이지 정보
			document.getElementById("penaltyListPage").innerText = data.currentPage;
			document.getElementById("penaltyListTotalPage").innerText = data.totalPages != 0  ? data.totalPages : '1';

	        const countEl = document.getElementById('penaltyList-count');
	        if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();

	        const listEl = document.getElementById('penaltyList');
	        if (!listEl) return;

	        if (data.content.length < 1 && keyword.trim() !== '') {
	            listEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
	        } else {
	            const rows = data.content.map(item => `
	                <tr>
	                    <td>${item.mpId}</td>
	                    <td>${item.memId}</td>
	                    <td>${item.memName}</td>
	                    <td>${penaltyStatusCng(item.mpType)}</td>
	                    <td>${formatDateMMDD(item.mpWarnDate)}</td>
	                </tr>`).join('');
	            listEl.innerHTML = rows;
	        }
	        renderPaginationPenalty(data);
	    })
	    .catch(err => console.error('제재 목록 조회 중 에러:', err));
	}

	document.getElementById('penaltyListSortByTargetName').addEventListener('click', function() {
	    const sortBy = this.getAttribute('data-sort-by');
	    handlePenaltySortClick(sortBy, this);
	});

	document.getElementById('penaltyListSortByRpCreatedAt').addEventListener('click', function() {
	    const sortBy = this.getAttribute('data-sort-by');
	    handlePenaltySortClick(sortBy, this);
	});

	document.getElementById('ReportListSortByMemId').addEventListener('click', function() {
	    const sortBy = this.getAttribute('data-sort-by');
	    handleReportSortClick(sortBy, this);
	});
	document.getElementById('ReportListSortByTargetName').addEventListener('click', function() {
	    const sortBy = this.getAttribute('data-sort-by');
	    handleReportSortClick(sortBy, this);
	});
	document.getElementById('ReportListSortByRpCreatedAt').addEventListener('click', function() {
	    const sortBy = this.getAttribute('data-sort-by');
	    handleReportSortClick(sortBy, this);
	});

	document.getElementById('ReportListFilter').addEventListener('change', function(){
		fetchReportList(1);
	})

	document.getElementById('ReportListSortOrder').addEventListener('change', function(){
		reportSortOrder = this.value;
		fetchReportList(1);
	})

	// 신고 정렬 클릭 처리 함수
	function handleReportSortClick(sortBy, clickedButton) {
	    // 같은 버튼을 다시 클릭하면 정렬 순서 변경
	    if (reportSortBy === sortBy) {
	        reportSortOrder = reportSortOrder === 'asc' ? 'desc' : 'asc';
	    } else {
	        reportSortBy = sortBy;
	        reportSortOrder = 'asc';
	    }

	    // 정렬 순서 셀렉트 박스 업데이트
	    document.getElementById('ReportListSortOrder').value = reportSortOrder;

	    // 버튼 활성화 상태 업데이트
	    document.querySelectorAll('.reportListBtnGroup .public-toggle-button').forEach(btn => btn.classList.remove('active'));
	    clickedButton.classList.add('active');

	    // 첫 페이지로 이동하여 정렬된 결과 조회
	    fetchReportList(1);
	}

	// 정렬 클릭 처리 함수
	function handlePenaltySortClick(sortBy, clickedButton) {
	    // 같은 버튼을 다시 클릭하면 정렬 순서 변경
	    if (penaltySortBy === sortBy) {
	        penaltySortOrder = penaltySortOrder === 'asc' ? 'desc' : 'asc';
	    } else {
	        penaltySortBy = sortBy;
	        penaltySortOrder = 'asc';
	    }

	    // 정렬 순서 셀렉트 박스 업데이트
	    document.getElementById('penaltyListSortOrder').value = penaltySortOrder;

	    // 버튼 활성화 상태 업데이트
	    document.querySelectorAll('.penalListBtnGroup .public-toggle-button').forEach(btn => btn.classList.remove('active'));
	    clickedButton.classList.add('active');

	    // 첫 페이지로 이동하여 정렬된 결과 조회
	    fetchPenaltyList(1);
	}

	// 제재 목록 정렬 순서 셀렉트 박스 이벤트 리스너
	document.getElementById('penaltyListSortOrder').addEventListener('change', function() {
	    penaltySortOrder = this.value;
	    fetchPenaltyList(1);
	});

	// 제재 유형 필터 이벤트 리스너
	document.getElementById('penaltyTypeFilter').addEventListener('change', function() {
	    fetchPenaltyList(1);
	});

	document.getElementById("penaltyList").addEventListener("click", function(e) {
		const tr = e.target.closest("tr");
		if (!tr) return;

		const tds = tr.querySelectorAll("td");
		const id = tds[0].textContent.trim();


		let formData = new FormData();
		formData.set("id", id);

		penaltyDetail(formData);

	});

	document.getElementById('penalty-detail-dateBtn').addEventListener('click', function(e) {
		const hiddenCalInput = document.getElementById('hiddenCalInput');
		const hiddenStart = document.getElementById('penaltyStart');
		const hiddenEnd = document.getElementById('penaltyEnd');
		if (hiddenCalInput._flatpickr) {
			hiddenCalInput.value = '';
			hiddenCalInput._flatpickr.destroy();
		}
		flatpickr(hiddenCalInput, {
			mode: "range",
			minDate: "today",
			positionElement: e.target,	//open되는 위치는 변경가능. select요소를 넣어줌.
			onChange: function(selectedDates) {
				if (selectedDates.length === 2) {
					hiddenStart.value = hiddenCalInput.value.split(' to ')[0]?.trim();
					hiddenEnd.value = hiddenCalInput.value.split(' to ')[1]?.trim();
					const startDate = selectedDates[0];
					const endDate = selectedDates[1];
					// yyyy-mm-dd 형식으로 포맷
					const fmStart = formatDateMMDD(startDate);
					const fmEnd = formatDateMMDD(endDate);

					document.getElementById('penalty-detail-startDate').value = fmStart;
					document.getElementById('penalty-detail-endDate').value = fmEnd;

				}
			}
		});

		hiddenCalInput._flatpickr.open();
		hiddenCalInput._flatpickr.clear();

	})

	const resetBtn = document.getElementById('penaltyReset');
	resetBtn.addEventListener('click', function(){
		const mpId = document.getElementById('penalty-detail-mpId').value;
		const trs = document.getElementById('penaltyList').querySelectorAll('tr');
		trs.forEach(tr => {
			const td = tr.firstElementChild;
			if (td.textContent?.trim() == mpId) tr.click();
		})
	});

	// 수정 버튼 클릭 시
	const penaltyModifyBtn = document.getElementById('penaltyModify');
	penaltyModifyBtn.addEventListener('click', function(){
		const mpId = document.getElementById('penalty-detail-mpId').value;
		const memId = document.getElementById('penalty-detail-memId').value;
		if(!mpId || !mpId){
			showConfirm2("대상을 선택해주세요.","",
				() => {
					return;
				}
			);
		}

		const hiddenStart = document.getElementById('penaltyStart');
		const hiddenEnd = document.getElementById('penaltyEnd');
		const mpType = document.getElementById('penalty-detail-mpType').value;


		const hiddenCal = document.getElementById('hiddenCalInput');
		if(!(hiddenStart.value == hiddenCal.value?.split(" to ")[0]?.trim()
			&& hiddenEnd.value == hiddenCal.value?.split(" to ")[1]?.trim()) && mpType == 'G14002'){
				showConfirm2("정지 기간이 선택되지 않았습니다.","",
					() => {
					}
				);
				return;
		}
		const formData = new FormData();
		formData.append('mpId',mpId);
		formData.append('mpType',mpType);
		formData.append('memId', memId);

		if(mpType == 'G14002'){
			formData.append('penaltyStart',hiddenStart.value);
			formData.append('penaltyEnd',hiddenEnd.value);
		}
		axios.post('/admin/umg/penaltyModify.do', formData)
			.then(res => {
				if(res.status != 200){
					showConfirm2("수정중 오류가 생겼습니다.","잠시후에 다시 시도해주세요.",
						() => {
						}
					);
					return;
				}
				showConfirm2("정상적으로 수정되었습니다.","",
					() => {
					}
				);

				// 변경된 상태를 상세에 다시 로딩 시켜주기 위해서 목록에서 찾아서 다시 클릭
				const trs = document.getElementById('penaltyList').querySelectorAll('tr');
				trs.forEach(tr =>{
					const td = tr.firstElementChild;
					if(td.textContent?.trim() == mpId) tr.click();
				})
				// 제재목록 초기화
				fetchPenaltyList(1);
			})
	})




	function penaltyDetail(formData) {

		axios.post('/admin/umg/getPenaltyDetail.do', formData)
			.then(res => {
				const fileContainer = document.getElementById('penalty-detail-file');

				document.getElementById('penalty-detail-mpId').value = '-';
				document.getElementById('penalty-detail-mpType').value = '-';
				document.getElementById('penalty-detail-memId').value = '-';
				document.getElementById('penalty-detail-memName').value = '-';
				document.getElementById('penalty-detail-reason').value = '-';
				document.getElementById('penalty-detail-warnDate').value = '-';
				document.getElementById('penalty-detail-startDate').value = '-';
				document.getElementById('penalty-detail-endDate').value = '-';
				fileContainer.innerHTML = '-';

				const { penaltyVO, filePath, fileOrgName } = res.data;

				const divPenaltyStart 	= document.getElementById('memPenaltyStartBox');
				const divPenaltyEnd 	= document.getElementById('memPenaltyEndBox');
				const divPenaltyModify 	= document.getElementById('memPenaltyModifyBox');
				const btnPenaltyCancel 	= document.getElementById('penaltyCancel');
				if(penaltyVO.mpType == 'G14001'){
					divPenaltyStart.style.display = 'none'
					divPenaltyEnd.style.display = 'none'
					divPenaltyModify.style.display = 'none'
				}else if(penaltyVO.mpType == 'G14002'){
					divPenaltyStart.style.display = 'flex'
					divPenaltyEnd.style.display = 'flex'
					divPenaltyModify.style.display = 'flex'
				}

				document.getElementById('penalty-detail-mpId').value = penaltyVO.mpId || '-';
				document.getElementById('penalty-detail-mpType').value = penaltyVO.mpType;
				document.getElementById('penalty-detail-mpType').dataset.mpType = penaltyVO.mpType;
				document.getElementById('penalty-detail-memId').value = penaltyVO.memId || '-';
				document.getElementById('penalty-detail-memName').value = penaltyVO.memName || '-';
				document.getElementById('penalty-detail-reason').value = penaltyVO.mpWarnReason || '-';
				document.getElementById('penalty-detail-warnDate').value = formatDateMMDD(penaltyVO.mpWarnDate) || '-';
				if (penaltyVO.mpStartedAt != null) document.getElementById('penalty-detail-startDate').value = formatDateMMDD(penaltyVO.mpStartedAt) || '-';
				if (penaltyVO.mpCompleteAt != null) document.getElementById('penalty-detail-endDate').value = formatDateMMDD(penaltyVO.mpCompleteAt) || '-';
				fileContainer.innerHTML = '-';

				if (filePath != null || filePath != undefined) {

					const ext = filePath.split('.').pop().toLowerCase();


					fileContainer.innerHTML = `<a href="${filePath}" download>${fileOrgName}</a>`;

				}

				const mpTypeSel = document.getElementById('penalty-detail-mpType');
				if(mpTypeSel.disabled){
					mpTypeSel.removeAttribute('disabled');
				}
				const dateBtn = document.getElementById('penalty-detail-dateBtn');
				if(dateBtn.disabled){
					dateBtn.removeAttribute('disabled');
					dateBtn.classList.remove('disabled');
				}
			})
			.catch(error => {
				console.error('회원 정보 불러오기 실패', error);
			});
	}

	const mpTypeSel = document.getElementById('penalty-detail-mpType');
	mpTypeSel.addEventListener('change', function(){
		const divPenaltyStart 	= document.getElementById('memPenaltyStartBox');
		const divPenaltyEnd 	= document.getElementById('memPenaltyEndBox');
		const divPenaltyModify 	= document.getElementById('memPenaltyModifyBox');
		if(mpTypeSel.value == 'G14001'){
			divPenaltyStart.style.display = 'none'
			divPenaltyEnd.style.display = 'none'
			divPenaltyModify.style.display = 'none'
		}else if(mpTypeSel.value = 'G14002'){
			divPenaltyStart.style.display = 'flex'
			divPenaltyEnd.style.display = 'flex'
			divPenaltyModify.style.display = 'flex'
		}

	})

	const btnPenaltyCancel 	= document.getElementById('penaltyCancel');
	btnPenaltyCancel.addEventListener('click', function(){
		const mpId = document.getElementById('penalty-detail-mpId').value?.trim();
		const memId = document.getElementById('penalty-detail-memId').value?.trim();

		if(!mpId || !memId){
			showConfirm2("대상을 선택해주세요.","",
				() => {
				}
			);
			return;
		}

		const formData = new FormData();
		formData.append('mpId', mpId);
		formData.append('memId', memId);

		axios.post('/admin/umg/penaltyCancel.do', formData)
			.then(res => {
				if(res.status != 200){
					showConfirm2("취소중 오류가 생겼습니다.","잠시후에 다시 시도해주세요.",
						() => {
						}
					);
					return;
				}

				showConfirm2("정상적으로 취소되었습니다.","",
					() => {
					}
				);
				// 목록에서 지우기
				const trs = document.getElementById('penaltyList').querySelectorAll('tr');
				trs.forEach(tr => {
					const td = tr.firstElementChild;
					if (td.textContent?.trim() == mpId) tr.remove();
				})
				// 상세 비우기
				resetPenaltyDetail();
				// 목록 리로드
				fetchPenaltyList(1);
				fetchReportList(1);

			})
	})

	function resetPenaltyDetail(){
		const mpId = document.getElementById('penalty-detail-mpId');
		const memId = document.getElementById('penalty-detail-memId');
		const memName = document.getElementById('penalty-detail-memName');
		const mpType = document.getElementById('penalty-detail-mpType');
		const penaltyDate = document.getElementById('penalty-detail-warnDate');
		const penaltyStart = document.getElementById('penalty-detail-startDate');
		const penaltyEnd = document.getElementById('penalty-detail-endDate');
		const dateBtn = document.getElementById('penalty-detail-dateBtn');
		const reasonArea = document.getElementById('penalty-detail-reason');
		const fileBox = document.getElementById('penaltyFileBox');

		mpId.value = '';
		memId.value = '';
		memName.value = '';
		mpType.value = '';
		penaltyDate.value = '';
		penaltyStart.value = '';
		penaltyEnd.value = '';
		dateBtn.value = '';
		reasonArea.value = '';
		const titleSpan = fileBox.firstElementChild;
		reasonArea.innerHTML = titleSpan;
	}

	reportModifyBtn.addEventListener('click', function() {

		const mpId = document.getElementById('report-detail-mpId').value;
		const mpStat = document.getElementById('report-detail-status').value;

		let form = new FormData();
		form.set("reportId", mpId);
		form.set("reportStatus", mpStat);

		if (mpStat === 'S03003') {
			showConfirm2("승인은 직접 변경할 수 없습니다.","제재등록 바랍니다.",
				() => {
				}
			);
			return;
		}

		axios.post('/admin/umg/reportModify.do', form)
			.then(res => {
				if (res.data == 1) {
					showConfirm2("수정 완료","",
						() => {
						}
					);
					fetchReportList(1);
				} else {
					showConfirm2("수정 오류 발생","",
						() => {
						}
					);
				}
			})
	})

	function reportStatusCng(stat) {
		if (stat === 'S03001') return '<span class="status-접수">접수</span>';
		if (stat === 'S03002') return '<span class="status-반려">반려</span>';
		if (stat === 'S03003') return '<span class="status-승인">승인</span>';
		return stat;
	}

	function penaltyStatusCng(stat) {
		if (stat === 'G14001') {
			return '경고';
		}
		if (stat === 'G14002') {
			return '<span class="penalty-정지">정지</span>';
		}
	}
	fetchReportList(1, true);
	fetchPenaltyList();
}

sanctionsDescription();