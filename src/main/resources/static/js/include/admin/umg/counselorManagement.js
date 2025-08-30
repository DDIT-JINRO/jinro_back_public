// counselorManagement.js — vanilla JS only, paymentStatistics.js 패턴 준수
function counselorManagement() {
	// ===== 상태 =====
	const state = {
		list: {
			page: 1,
			size: 10,
			keyword: '',
			status: '',
			sortBy: 'MEM_ID',   // MEM_ID | MEM_NAME | RATING_AVERAGE
			sortOrder: 'asc'    // asc | desc
		},
		detail: {
			counselorId: null
		},
		history: {
			page: 1,
			size: 5,
			sortBy: 'counselReqDatetime', 	// counselReqDatetime, crRate
			sortOrder: 'desc',
			counselCategory: '',
			counselMethod: '',
			counselStatus: '',
		}
	};

	// ===== 공용 엘리먼트 =====
	const hiddenInput = document.getElementById('comCalendarInput'); // 기간선택용 공용 input
	const inputKeyword = document.getElementById('search');
	const btnSearch = document.querySelector('.searchUserBtn');

	// 목록 툴바
	const btnSortName = document.getElementById('cnsListName');
	const btnSortCnsCnt = document.getElementById('cnsListCnsCnt');
	const btnSortReviewCnt = document.getElementById('cnsListReviewCnt');
	const btnSortRating = document.getElementById('cnsListRating');
	const selSortOrder = document.getElementById('cnsListSortOrder');
	const selStatus = document.getElementById('cnsListStatus');

	// 목록/페이징
	const tbodyList = document.getElementById('cnsList');
	const listPager = document.getElementById('cnsListPagenation');
	const listCountEl = document.getElementById('cnsList-count');

	// 상세/하단 이력
	const imgProfile = document.getElementById('cns-profile-img');
	const inputCnsId = document.getElementById('cns-id');
	const inputMemId = document.getElementById('mem-id');
	const inputName = document.getElementById('mem-name');
	const inputNick = document.getElementById('cns-nickname');
	const inputEmail = document.getElementById('mem-email');
	const inputPhone = document.getElementById('mem-phone');
	const inputGen = document.getElementById('mem-gen');
	const inputBirth = document.getElementById('mem-birth');
	const selRole = document.getElementById('mem-role');

	const cnsCountEl = document.getElementById('counselor-cns-count');
	const reviewAvgEl = document.getElementById('counselor-review-point');
	const vacCountEl = document.getElementById('counselor-vac-count');
	const recent1El = document.getElementById('recentLoginDate');    // 라벨상 “최근 상담 기록”
	const recent2El = document.getElementById('recentPenaltyDate');  // 라벨상 “최근 휴가 기록”

	const tbodyHistory = document.getElementById('cnsDetailList');
	const historyPager = document.getElementById('cnsDetailListPagenation');
	const cnsHistoryCountEl = document.getElementById('cnsHistory-count');

	const btnHistoryReqTime = document.getElementById('cnsDetailListReqTime');
	const btnHistoryRating = document.getElementById('cnsDetailListRating');
	const selHistoryOrder = document.getElementById('cnsDetailListOrder');
	const selHistoryCateFilter = document.getElementById('cnsCateFilter');
	const selHistoryTypeFilter = document.getElementById('cnsTypeFilter');
	const selHistoryStatusFilter = document.getElementById('cnsStatusFilter');


	const btnModify = document.getElementById('cnsModify');

	// 카드(상단) — 월/일 통계
	const monthlyCntEl = document.getElementById('monthlyCnsCount');
	const monthlyRateEl = document.getElementById('monthlyCnsApp');
	const offCntEl = document.getElementById('dailyOffCnsCount');
	const offRateEl = document.getElementById('dailyOffCnsRate');
	const chatCntEl = document.getElementById('dailyChatCnsCount');
	const chatRateEl = document.getElementById('dailyChatCnsRate');
	const videoCntEl = document.getElementById('dailyVideoCnsCount');
	const videoRateEl = document.getElementById('dailyVideoCnsRate');

	// 도넛
	// === [ADD] Chart selects & hidden ranges ===
	// 상담 종류별(카테고리)
	const cateGenderSel = document.getElementById('cnsCateChartGender');
	const cateAgeSel = document.getElementById('cnsCateChartAgeGroup');
	const cateDateSel = document.getElementById('cnsCateChartDateType');          // daily/monthly/selectDays
	const cateStart = document.getElementById('cnsCateChartStartDay');          // hidden
	const cateEnd = document.getElementById('cnsCateChartEndDay');            // hidden


	// 상담 종류별(카테고리)
	const typeDateSel = document.getElementById('cnsTypeChartDate');
	const typeGenderSel = document.getElementById('cnsTypeChartGen');
	const typeAgeSel = document.getElementById('cnsTypeChartAgeGroup');
	const typeStart = document.getElementById('cnsTypeChartStartDay');
	const typeEnd = document.getElementById('cnsTypeChartEndDay');

	// 상담사 TOP3
	const top3DateSel = document.getElementById('cnsTop3ChartDate');
	const top3TypeSel = document.getElementById('cnsTop3ChartType'); // satisfaction | reviews | consultations
	const top3Start = document.getElementById('cnsTop3ChartStartDay');
	const top3End = document.getElementById('cnsTop3ChartEndDay');

	// 상담 시간대
	const hoursDateSel = document.getElementById('cnsHoursChartDate');
	const hoursGenSel = document.getElementById('cnsHoursChartGen');
	const hoursAgeSel = document.getElementById('cnsHoursChartAgeGroup');
	const hoursStart = document.getElementById('cnsHoursChartStartDay');
	const hoursEnd = document.getElementById('cnsHoursChartEndDay');

	// 차트 초기화('전체') 버튼들
	const cnsCateChartReset = document.getElementById('cnsCateChartReset');
	const cnsTop3ChartReset = document.getElementById('cnsTop3ChartReset');
	const cnsHoursChartReset = document.getElementById('cnsHoursChartReset');
	const cnsTypeChartReset = document.getElementById('cnsTypeChartReset');

	const cnsChartAllBtn = document.getElementById('cnsChartAllBtn');
	const cnsMngBtn = document.getElementById('cnsMngBtn');

	const cnsChartAllSpace = document.getElementById('cnsChartAllSpace');
	const cnsMngSpace = document.getElementById('cnsMngSpace');

	const topButtons = [cnsMngBtn, cnsChartAllBtn];

	cnsChartAllBtn.classList.add('active');

	inputKeyword.addEventListener('keydown', function(e){
		if(e.code === 'Enter'){
			btnSearch?.click();
		}
	})

	topButtons.forEach(button => {
		button.addEventListener('click', () => {
			topButtons.forEach(btn => btn.classList.remove('active'));

			button.classList.add('active');
		});
	});

	cnsMngBtn.addEventListener('click', function() {
		cnsChartAllSpace.style = "display:none;"
		cnsMngSpace.style = "display:block;"
	});

	cnsChartAllBtn.addEventListener('click', function() {
		cnsMngSpace.style = "display:none;"
		cnsChartAllSpace.style = "display:block;"
	});

	cnsCateChartReset.addEventListener('click', () => {
		cateGenderSel.value = '';
		cateAgeSel.value = '';
		cateDateSel.value = 'daily';
		cateStart.value = '';
		cateEnd.value = '';
		consultMethodStatisticsChart();
	})

	cnsTop3ChartReset.addEventListener('click', () => {
		top3DateSel.value = 'daily';
		top3TypeSel.value = 'satisfaction';
		top3Start.value = '';
		top3End.value = '';
		topCounselorListChart();
	})

	cnsHoursChartReset.addEventListener('click', () => {
		hoursDateSel.value = 'daily';
		hoursGenSel.value = '';
		hoursAgeSel.value = '';
		hoursStart.value = '';
		hoursEnd.value = '';
		counselingStatsByTimeChartCanvas();
	})

	cnsTypeChartReset.addEventListener('click', () => {
		typeDateSel.value = 'daily';
		typeGenderSel.value = '';
		typeAgeSel.value = '';
		typeStart.value = '';
		typeEnd.value = '';
		counselingStatsByCategoryChart();
	})



	// === [ADD] helpers for selects & ranges ===
	const coercePeriod = (v) => (v === 'seelectDays' ? 'selectDays' : (v || 'daily'));

	function setDefaultRange(startEl, endEl) {
		if (!startEl || !endEl) return;
		const r = getRecentDaysRange(7);
		startEl.value = r.start; endEl.value = r.end;
	}

	function registerRangeSelect(selectEl, startEl, endEl, onChange) {
		if (!selectEl) return;
		selectEl.addEventListener('change', () => {
			const val = coercePeriod(selectEl.value);
			if (val === 'daily') {
				const r = getRecentDaysRange(7);
				startEl && (startEl.value = r.start);
				endEl && (endEl.value = r.end);
				onChange && onChange();
				return;
			}
			if (val === 'monthly') {
				const r = getCurrentYearRange();
				startEl && (startEl.value = r.start);
				endEl && (endEl.value = r.end);
				onChange && onChange();
				return;
			}
			if (val === 'selectDays') {
				if (!hiddenInput) return;
				if (hiddenInput._flatpickr) hiddenInput._flatpickr.destroy();
				flatpickr(hiddenInput, {
					mode: 'range',
					//maxDate: 'today',
					positionElement: selectEl,
					onChange: (arr) => {
						if (arr.length === 2) {
							const s = formatDateCal(arr[0]);
							const e = formatDateCal(arr[1]);
							startEl && (startEl.value = s);
							endEl && (endEl.value = e);
							hiddenInput._flatpickr?.destroy();
							onChange && onChange();
						}
					}
				}).open();
			}
		});
	}

	// === [ADD] params builders ===
	function buildCateParams() {
		const selectUserInquiry = coercePeriod(cateDateSel?.value);
		const gender = cateGenderSel?.value || '';
		const ageGroup = cateAgeSel?.value || '';
		const p = { selectUserInquiry, gender, ageGroup };
		if (selectUserInquiry === 'selectDays') {
			p.startDate = cateStart?.value || '';
			p.endDate = cateEnd?.value || '';
		}
		return p;
	}

	function buildTypeParams() {
		const selectUserInquiry = coercePeriod(typeDateSel?.value);
		const gender = typeGenderSel?.value || '';
		const ageGroup = typeAgeSel?.value || '';
		const p = { selectUserInquiry, gender, ageGroup };
		if (selectUserInquiry === 'selectDays') {
			p.startDate = typeStart?.value || '';
			p.endDate = typeEnd?.value || '';
		}
		return p;
	}

	function buildTop3Params() {
		const selectUserInquiry = coercePeriod(top3DateSel?.value);
		const filter = top3TypeSel?.value || 'satisfaction';
		const p = { selectUserInquiry, filter };
		if (selectUserInquiry === 'selectDays') {
			p.startDate = top3Start?.value || '';
			p.endDate = top3End?.value || '';
		}
		return p;
	}

	function buildHoursParams() {
		const selectUserInquiry = coercePeriod(hoursDateSel?.value);
		const gender = hoursGenSel?.value || '';
		const ageGroup = hoursAgeSel?.value || '';
		const p = { selectUserInquiry, gender, ageGroup };
		if (selectUserInquiry === 'selectDays') {
			p.startDate = hoursStart?.value || '';
			p.endDate = hoursEnd?.value || '';
		}
		return p;
	}

	// === [ADD] bind all chart selects ===
	function bindChartSelectEvents() {
		// 상담 종류별(카테고리)
		registerRangeSelect(cateDateSel, cateStart, cateEnd, consultMethodStatisticsChart);
		cateGenderSel?.addEventListener('change', consultMethodStatisticsChart);
		cateAgeSel?.addEventListener('change', consultMethodStatisticsChart);

		// 상담 유형별(도넛)
		registerRangeSelect(typeDateSel, typeStart, typeEnd, counselingStatsByCategoryChart);
		typeGenderSel?.addEventListener('change', counselingStatsByCategoryChart);
		typeAgeSel?.addEventListener('change', counselingStatsByCategoryChart);

		// 상담사 TOP3
		registerRangeSelect(top3DateSel, top3Start, top3End, topCounselorListChart);
		top3TypeSel?.addEventListener('change', topCounselorListChart);

		// 상담 시간대
		registerRangeSelect(hoursDateSel, hoursStart, hoursEnd, counselingStatsByTimeChartCanvas);
		hoursGenSel?.addEventListener('change', counselingStatsByTimeChartCanvas);
		hoursAgeSel?.addEventListener('change', counselingStatsByTimeChartCanvas);
	}

	// ===== 헬퍼 =====
	function formatDateCal(d) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1)
		const day = String(d.getDate())
		return `${y}-${m}-${day}`;
	}
	function formatDate(iso) {
		if (!iso) return '-';
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1);
		const dd = String(d.getDate());
		const fullYear = String(d.getFullYear());
		return `${fullYear}. ${mm}. ${dd}.`;
	}
	function getRecentDaysRange(days = 7) {
		const today = new Date();
		const start = new Date(today);
		start.setDate(today.getDate() - (days - 1));
		return { start: formatDateCal(start), end: formatDateCal(today) };
	}
	function getCurrentYearRange() {
		const today = new Date();
		const start = new Date(today.getFullYear(), 0, 1);
		return { start: formatDateCal(start), end: formatDateCal(today) };
	}
	function fmtYMD(isoOrYmd) {
		if (!isoOrYmd) return '-';
		const d = new Date(isoOrYmd);
		if (Number.isNaN(d.getTime())) return isoOrYmd;
		return formatDateCal(d);
	}
	function starsFromRate(n) {
		const rating = Math.max(0, Math.min(5, Number(n) || 0));

		// 평점을 퍼센트(%) 단위로 변환
		const widthPercentage = (rating / 5) * 100;

		const formattedRating = rating.toFixed(2);

		// CSS로 제어되는 HTML 구조를 반환
		return `<div class="star-rating" data-tooltip="${formattedRating} / 5.0"><span style="width: ${widthPercentage}%;"></span></div>`;

	}
	function updateRateStyleByStatus(elementId, status) {
		const el = document.getElementById(elementId);
		if (!el) return;
		el.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal', 'public-span-new');
		switch (status) {
			case 'increase': el.classList.add('public-span-increase'); break;
			case 'decrease': el.classList.add('public-span-decrease'); break;
			case 'equal': el.classList.add('public-span-equal'); break;
			case 'new_entry': el.classList.add('public-span-new'); break;
			default: el.classList.add('public-span-equal');
		}
	}



	// ===== 이벤트 바인딩 =====
	function setupEventListeners() {
		// 검색
		btnSearch && btnSearch.addEventListener('click', () => {
			state.list.keyword = (inputKeyword?.value || '').trim();
			fetchList(1);
		});

		// 상담 내역 정렬 버튼
		function activeSortHistory(btnSortName, sortBy) {
			if (btnSortName.classList.contains('active')) {
				selHistoryOrder.value = selHistoryOrder.value == 'asc' ? 'desc' : 'asc';
				state.history.sortOrder = selHistoryOrder.value;
			}

			[btnHistoryRating, btnHistoryReqTime].forEach(b => b && b.classList.remove('active'));
			btnSortName && btnSortName.classList.add('active');
			state.history.sortBy = sortBy;
			loadHistory(1);
		}
		btnHistoryRating && btnHistoryRating.addEventListener('click', () => activeSortHistory(btnHistoryRating, "crRate"));
		btnHistoryReqTime && btnHistoryReqTime.addEventListener('click', () => activeSortHistory(btnHistoryReqTime, "counselReqDatetime"));

		selHistoryOrder && selHistoryOrder.addEventListener('change', (e) => {
			state.history.sortOrder = e.target.value || 'asc';
			loadHistory(1);
		})
		selHistoryCateFilter && selHistoryCateFilter.addEventListener('change', (e) => {
			state.history.counselMethod = e.target.value || '';
			loadHistory(1);
		})
		selHistoryTypeFilter && selHistoryTypeFilter.addEventListener('change', (e) => {
			state.history.counselCategory = e.target.value || '';
			loadHistory(1);
		})
		selHistoryStatusFilter && selHistoryStatusFilter.addEventListener('change', (e) => {
			state.history.counselStatus = e.target.value || '';
			loadHistory(1);
		})

		/*
		selHistoryOrder
		const selHistoryCateFilter = document.getElementById('cnsCateFilter');
		const selHistoryTypeFilter = document.getElementById('cnsTypeFilter');
		const selHistoryStatusFilter = document.getElementById('cnsStatusFilter');
		 */

		// 정렬 버튼 (세 개 중 하나만 active)
		function activateSort(btnActive, sortBy) {
			if (btnActive.classList.contains('active')) {
				selSortOrder.value = selSortOrder.value == 'asc' ? 'desc' : 'asc';
				state.list.sortOrder = selSortOrder.value;
			}
			[btnSortName, btnSortCnsCnt, btnSortReviewCnt, btnSortRating].forEach(b => b && b.classList.remove('active'));
			btnActive && btnActive.classList.add('active');
			state.list.sortBy = sortBy;
			fetchList(1);
		}
		btnSortName && btnSortName.addEventListener('click', () => activateSort(btnSortName, 'MEM_NAME'));
		// "이메일" 버튼은 실제로는 '평점' 정렬에 매핑
		btnSortCnsCnt && btnSortCnsCnt.addEventListener('click', () => activateSort(btnSortCnsCnt, 'COUNSEL_COUNT'));
		btnSortReviewCnt && btnSortReviewCnt.addEventListener('click', () => activateSort(btnSortReviewCnt, 'COUNSEL_REVIEW_COUNT'));
		btnSortRating && btnSortRating.addEventListener('click', () => activateSort(btnSortRating, 'RATING_AVERAGE'));

		// 정렬 순서/상태
		selSortOrder && selSortOrder.addEventListener('change', (e) => {
			state.list.sortOrder = e.target.value || 'asc';
			fetchList(1);
		});
		selStatus && selStatus.addEventListener('change', (e) => {
			state.list.status = e.target.value || '';
			fetchList(1);
		});

		// 목록 페이징
		listPager && listPager.addEventListener('click', (e) => {
			const a = e.target.closest('a[data-page]');
			if (!a) return;
			e.preventDefault();
			if (a.classList.contains('disabled')) return;
			const p = parseInt(a.dataset.page, 10);
			if (!Number.isNaN(p) && p > 0) fetchList(p);
		});

		// 행 클릭 → 상세/이력
		tbodyList && tbodyList.addEventListener('click', (e) => {
			const tr = e.target.closest('tr[data-id]');
			if (!tr) return;
			const id = parseInt(tr.dataset.id, 10);
			if (Number.isNaN(id)) return;
			state.detail.counselorId = id;
			loadDetail();
			loadHistory(1);
		});

		// 상세 하단 이력 페이징
		historyPager && historyPager.addEventListener('click', (e) => {
			const a = e.target.closest('a[data-page]');
			if (!a) return;
			e.preventDefault();
			if (a.classList.contains('disabled')) return;
			const p = parseInt(a.dataset.page, 10);
			if (!Number.isNaN(p) && p > 0) loadHistory(p);
		});

		// 상세 저장
		btnModify && btnModify.addEventListener('click', async () => {
			showConfirm("정말로 저장하시겠습니까?",
				"",
				async ()=>{
					const memId = (inputCnsId?.value || inputMemId?.value || '').trim();
					if (!memId) {
						showConfirm2("대상이 없습니다.","",
							() => {
							}
						);
					    return;
					}
					const fd = new FormData();
					fd.set('memId', memId);
					fd.set('memName', inputName?.value || '');
					fd.set('memNickname', inputNick?.value || '');
					fd.set('memRole', selRole?.value || '');
					try {
						const res = await axios.post('/admin/umg/updateMemberInfo.do', fd);
						if (res.data !== 1) throw new Error('fail');
						showConfirm2("저장되었습니다.","",
							() => {
							}
						);
						await loadDetail();
						await fetchList(state.list.page);
					} catch (err) {
						console.error(err);
						showConfirm2("저장 실패","",
							() => {
							}
						);
					}
				},
				()=>{return;}
			)

		});

	}


	function getTodayRange() {
		const t = new Date();
		const d = formatDateCal(t);
		return { start: d, end: d };
	}
	function getCurrentMonthRange() {
		const t = new Date();
		const first = new Date(t.getFullYear(), t.getMonth(), 1);
		const last = new Date(t.getFullYear(), t.getMonth() + 1, 0);
		return { start: formatDateCal(first), end: formatDateCal(last) };
	}
	// ===== 기간 선택 (paymentStatistics.js와 동일한 UX) =====
	function eventDateRangeSelect(e) {
		const selectEl = e.target.nodeName === 'SELECT' ? e.target : e.target.closest('select');
		const val = selectEl.value;

		// 차트별 히든 요소 매핑 (← 올바른 차트로 교체)
		const map = {
			// cnsCateChart = 유형별(상담방법, 도넛)
			cnsCateChartDateType: { s: cateStart, e: cateEnd, redraw: consultMethodStatisticsChart },
			// cnsTypeChart = 종류별(상담목적, 막대)
			cnsTypeChartDate: { s: typeStart, e: typeEnd, redraw: counselingStatsByCategoryChart },
			cnsTop3ChartDate: { s: top3Start, e: top3End, redraw: topCounselorListChart },
			cnsHoursChartDate: { s: hoursStart, e: hoursEnd, redraw: counselingStatsByTimeChartCanvas }
		};
		const t = map[selectEl.id];
		if (!t) return;

		if (val === 'daily') {
			const r = getTodayRange();
			t.s && (t.s.value = r.start);
			t.e && (t.e.value = r.end);
			t.redraw && t.redraw();
			return;
		}
		if (val === 'monthly') {
			const r = getCurrentMonthRange();
			t.s && (t.s.value = r.start);
			t.e && (t.e.value = r.end);
			t.redraw && t.redraw();
			return;
		}
		if (val === 'selectDays') {
			if (!hiddenInput) return;
			if (hiddenInput._flatpickr) hiddenInput._flatpickr.destroy();
			flatpickr(hiddenInput, {
				mode: 'range',
				dateFormat: 'Y-m-d',
				//maxDate: 'today',
				positionElement: selectEl,  // 달력을 해당 셀렉트 바로 위에 띄움
				//disable: [d => d > new Date()],
				onChange: (arr) => {
					if (arr.length === 2) {
						const s = formatDateCal(arr[0]);
						const e = formatDateCal(arr[1]);
						t.s && (t.s.value = s);
						t.e && (t.e.value = e);
						hiddenInput._flatpickr?.destroy();
						t.redraw && t.redraw();
					}
				}
			}).open();
		}
	}

	// ===== 상단 카드 로드 =====
	async function loadCards() {
		try {
			const { data } = await axios.get('/admin/csmg/selectMonthlyCounselingStatList.do');
			// 총계
			monthlyCntEl && (monthlyCntEl.textContent = (data.currentMonthTotal ?? 0).toLocaleString());
			if (monthlyRateEl) {
				const sign =
					data.allTotalCountStatus === 'increase' ? '▲' :
						data.allTotalCountStatus === 'decrease' ? '▼' : '';
				monthlyRateEl.textContent = `${sign} ${data.allTotalCountRate + '%' || '0%'}`;
				updateRateStyleByStatus('monthlyCnsApp', data.allTotalCountStatus);
			}
			// 대면
			offCntEl && (offCntEl.textContent = (data.currentMonthFaceToFace ?? 0).toLocaleString());
			if (offRateEl) {
				const sign =
					data.faceToFaceTotalCountStatus === 'increase' ? '▲' :
						data.faceToFaceTotalCountStatus === 'decrease' ? '▼' : '';
				offRateEl.textContent = `${sign} ${data.faceToFaceTotalCountRate + '%' || '0%'}`;
				updateRateStyleByStatus('dailyOffCnsRate', data.faceToFaceTotalCountStatus);
			}
			// 채팅
			chatCntEl && (chatCntEl.textContent = (data.currentMonthChat ?? 0).toLocaleString());
			if (chatRateEl) {
				const sign =
					data.chatTotalCountStatus === 'increase' ? '▲' :
						data.chatTotalCountStatus === 'decrease' ? '▼' : '';
				chatRateEl.textContent = `${sign} ${data.chatTotalCountRate + '%' || '0%'}`;
				updateRateStyleByStatus('dailyChatCnsRate', data.chatTotalCountStatus);
			}
			// 화상
			videoCntEl && (videoCntEl.textContent = (data.currentMonthVideo ?? 0).toLocaleString());
			if (videoRateEl) {
				const sign =
					data.videoTotalCountStatus === 'increase' ? '▲' :
						data.videoTotalCountStatus === 'decrease' ? '▼' : '';
				videoRateEl.textContent = `${sign} ${data.videoTotalCountRate + '%' || '0%'}`;
				updateRateStyleByStatus('dailyVideoCnsRate', data.videoTotalCountStatus);
			}
		} catch (err) {
			console.error('카드 통계 로드 실패:', err);
		}
	}

	// ===== 목록 =====
	async function fetchList(page = 1) {
		state.list.page = page;
		const params = {
			currentPage: String(state.list.page),
			size: String(state.list.size),
			keyword: (inputKeyword?.value || '').trim(),
			status: state.list.status,
			sortBy: state.list.sortBy,
			sortOrder: state.list.sortOrder
		};
		try {
			const { data } = await axios.get('/admin/csmg/selectCounselorStatList.do', { params });
			// 카운트
			if (typeof data.total === 'number' && listCountEl) listCountEl.textContent = data.total.toLocaleString();

			// 목록 바인딩
			if (tbodyList) {
				if (!data.content || data.content.length === 0) {
					tbodyList.innerHTML = `<tr><td colspan="5" style="text-align:center;">검색 결과가 없습니다.</td></tr>`;
				} else {
					tbodyList.innerHTML = data.content.map(r => {
						const stars = starsFromRate(r.RATING_AVERAGE);
						return `
                            <tr data-id="${r.MEM_ID}">
                                <td>${r.RNUM}</td>
                                <td>${r.MEM_NAME ?? '-'}</td>
                                <td>${r.COUNSEL_COUNT ?? 0}</td>
                                <td>${r.COUNSEL_REVIEW_COUNT ?? 0}</td>
                                <td>${stars}</td>
                            </tr>
                        `;
					}).join('');
				}
			}
			// 페이징
			if (listPager) {
				const { startPage, endPage, currentPage, totalPages } = data;
				let html = '';
				html += `<a href="#" data-page="${startPage - 1}" class="${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
				for (let p = startPage; p <= endPage; p++) {
					if(totalPages == 0) p = 1;
					html += `<a href="#" data-page="${p}" class="${p === currentPage ? 'active' : ''}">${p}</a>`;
				}
				html += `<a href="#" data-page="${endPage + 1}" class="${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
				listPager.innerHTML = html;
			}
		} catch (err) {
			console.error('상담사 목록 조회 실패:', err);
		}
	}

	// ===== 상세 =====
	async function loadDetail() {
		if (!state.detail.counselorId) return;

		try {
			// CSMG 상세
			const { data } = await axios.get('/admin/csmg/selectCounselorDetail.do', {
				params: { counselor: state.detail.counselorId }
			});

			// 기본 필드
			inputCnsId && (inputCnsId.value = String(state.detail.counselorId));
			inputMemId && (inputMemId.value = String(state.detail.counselorId));
			inputName && (inputName.value = data.counselorName ?? '-');
			inputNick && (inputNick.value = data.counselorName ?? '-'); // 닉네임 컬럼 없으면 이름 대입
			inputEmail && (inputEmail.value = data.counselorEmail ?? '-');
			inputPhone && (inputPhone.value = data.counselorPhoneNumber ?? '-');
			inputGen && (inputGen.value = data.counselorGen ?? '-');
			inputBirth && (inputBirth.value = formatDate(data.counselorBirth));

			// 집계
			cnsCountEl && (cnsCountEl.value = String(data.counselCount ?? 0));
			reviewAvgEl && (reviewAvgEl.value = String(data.counselReviewAvg ?? 0));
			vacCountEl && (vacCountEl.value = String(data.vacationCount ?? 0));

			// 최근 기록(이 페이지 라벨과 다르지만 값 보강)
			recent1El && (recent1El.innerHTML = `<i class="fa-regular fa-clock"></i>${formatDate(data.recentCounselHistory)}`);
			recent2El && (recent2El.innerHTML = `<i class="fa-regular fa-clock"></i>${formatDate(data.recentVacationHistory)}`);

			// UMG 상세(프로필/권한/로그/제재)
			try {
				const fd = new FormData();
				fd.set('id', String(state.detail.counselorId));
				const umg = await axios.post('/admin/umg/getMemberDetail.do', fd);
				const filePath = umg?.data?.filePath || '';
				const memRole = umg?.data?.memberDetail?.memRole || '';
				const recentLg = umg?.data?.recentLoginDate || '';
				const recentPn = umg?.data?.recentPenaltyDate || '';

				if (imgProfile) imgProfile.src = filePath || '/images/defaultProfileImg.png';
				if (selRole && memRole) {
					Array.from(selRole.options).forEach(op => op.selected = (op.value === memRole));
				}
				// 우선순위: UMG값 → 없으면 CSMG값
				if (recentLg) { recent1El && (recent1El.innerHTML = `<i class="fa-regular fa-clock"></i>${formatDate(recentLg)}`); }
				if (recentPn) { recent2El && (recent2El.innerHTML = `<i class="fa-regular fa-clock"></i>${formatDate(recentPn)}`); }
			} catch (e) {
				// optional
			}
		} catch (err) {
			console.error('상담사 상세 조회 실패:', err);
		}
	}

	// ===== 상담 이력 =====
	async function loadHistory(page = 1) {
		if (!state.detail.counselorId) return;
		state.history.page = page;

		const params = {
			counselor: state.detail.counselorId,
			currentPage: String(state.history.page),
			size: String(state.history.size),
			sortBy: state.history.sortBy,
			sortOrder: state.history.sortOrder,
			counselCategory: state.history.counselCategory,
			counselMethod: state.history.counselMethod,
			counselStatus: state.history.counselStatus,
		};
		try {
			const { data } = await axios.get('/admin/csmg/selectCounselingList.do', { params });
			if (tbodyHistory) {
				if (!data.content || data.content.length === 0) {
					tbodyHistory.innerHTML = `<tr><td colspan="6" style="text-align:center;">이력이 없습니다.</td></tr>`;
				} else {
					// 페이지 정보
					document.querySelector(".pageCnt").style.display = "block";
					document.getElementById("couListPage").innerText = data.currentPage;
					document.getElementById("couListTotalPage").innerText = data.totalPages != 0 ? data.totalPages : '1';

					tbodyHistory.innerHTML = data.content.map(r => `
                        <tr>
                            <td>${r.RNUM}</td>
                            <td>${r.COUNSEL_CATEGORY}</td>
                            <td>${r.COUNSEL_METHOD}</td>
                            <td>${formatDate(r.COUNSEL_REQ_DATETIME)}</td>
                            <td>${starsFromRate(r.CR_RATE)}</td>
                            <td>${r.COUNSEL_STATUS}</td>
                        </tr>
                    `).join('');
				}
			}

			cnsHistoryCountEl.textContent = data.total;

			if (historyPager) {
				const { startPage, endPage, currentPage, totalPages } = data;
				let html = '';
				html += `<a href="#" data-page="${startPage - 1}" class="${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
				for (let p = startPage; p <= endPage; p++) {
					if(totalPages == 0) p = 1;
					html += `<a href="#" data-page="${p}" class="${p === currentPage ? 'active' : ''}">${p}</a>`;
				}
				html += `<a href="#" data-page="${endPage + 1}" class="${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
				historyPager.innerHTML = html;
			}
		} catch (err) {
			console.error('상담 이력 조회 실패:', err);
		}
	}

	//상담 유형별 통계
	function consultMethodStatisticsChart(chartRange) {
		const ctx = document.getElementById('consultMethodStatisticsChartCanvas').getContext('2d');

		/* 전달할 데이터 셀렉해오기 */

		// 기존 차트 파괴 및 최소 높이 설정
		if (window.consultMethodStatisticsChartInstance) {
			window.consultMethodStatisticsChartInstance.destroy();
		}

		const params = buildCateParams();
		const rangeTitle = (params.selectUserInquiry === 'selectDays' && params.startDate && params.endDate)
			? `${params.startDate.replace(/-/g, '. ')}. ~ ${params.endDate.replace(/-/g, '. ')}.`
			: '';

		axios.get('/admin/csmg/selectConsultMethodStatistics.do', {
			params: params
		}).then(res => {

			const responseData = res.data;

			// 데이터를 'plTitle'과 'userCount'로 매핑
			const labels = responseData.map(item => item.CONSULTATION_TYPE);
			const dataValues = responseData.map(item => item.CONSULTATION_COUNT);
			const purplePalette = [
				'#B8A5F5', '#8A6BEF', '#6C4DDC'
			];
			// 도넛 차트 생성
			window.consultMethodStatisticsChartInstance = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: labels,
					datasets: [{
						label: '상담횟수',
						data: dataValues,
						backgroundColor: ['#B8A5F5', '#8A6BEF', '#6C4DDC'],
						borderWidth: 0,
						hoverBackgroundColor: ['#8E6EE4', '#8E6EE4', '#8E6EE4'],
						hoverOffset: 20
					}]
				},
				plugins: [ChartDataLabels],
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: '60%',
					layout: { padding: { top: 25, bottom: 25, left: 25, right: 25 } },

					plugins: {
						legend: { display: true, position: 'bottom' },
						title: {
							display: !!rangeTitle,
							text: rangeTitle ? [rangeTitle] : []
						},
						datalabels: {
							formatter: (value, ctx) => {
								const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
								const pct = (value / sum * 100).toFixed(0) ;
								if(pct <3){
									return null;
								}
								return pct+'%';
							},
							color: '#fff',
							font: { weight: 'bold' }
						}
					},
				}
			});
		}).catch(error => {
			console.error("페이지별 방문자 데이터 조회 중 에러:", error);
		});
	}

	function topCounselorListChart() {
		const ctx = document.getElementById('topCounselorListChartCanvas').getContext('2d');


		// 기존 차트 파괴 및 최소 높이 설정
		if (window.topCounselorListChartInstance) {
			window.topCounselorListChartInstance.destroy();
		}

		const params = buildTop3Params();
		const rangeTitle = (params.selectUserInquiry === 'selectDays' && params.startDate && params.endDate)
			? `${params.startDate.replace(/-/g, '. ')}. ~ ${params.endDate.replace(/-/g, '. ')}.`
			: '';
		const filter = params.filter;
		// 보라 팔레트(3색) + 호버색
		const purplePalette = ['#B8A5F5', '#8A6BEF', '#6C4DDC'];
		const hoverColor = '#8E6EE4';
		// 한글 타이틀/단위
		const titleByFilter = {
			satisfaction: '만족도 TOP',
			reviews: '후기건수 TOP',
			consultations: '상담건수 TOP'
		};
		const unitByFilter = {
			satisfaction: '점',
			reviews: '건',
			consultations: '건'
		};

		axios.get('/admin/csmg/selectTopCounselorList.do', { params })
			.then(res => {
				const rows = Array.isArray(res.data) ? res.data : [];

				// 라벨: "이름 (ID)"
				const labels = rows.map(r => `${r.MEM_NAME}`);

				// 값: filter에 따라 다른 컬럼 사용
				const values = rows.map(r => {
					if (filter === 'satisfaction') return Number(r.AVG_SATISFACTION ?? 0);
					if (filter === 'reviews') return Number(r.REVIEW_COUNT ?? 0);
					return Number(r.CONSULTATION_COUNT ?? 0); // consultations (기본)
				});

				// 데이터 개수에 맞춘 색상 배열
				const bgColors = values.map((_, i) => purplePalette[i % purplePalette.length]);
				const hoverColors = values.map(() => hoverColor);

				// 차트 생성 (세로 막대)
				window.topCounselorListChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels,
						datasets: [{
							label: titleByFilter[filter] || 'TOP',
							data: values,
							backgroundColor: bgColors,
							borderColor: bgColors,
							borderWidth: 1,
							hoverBackgroundColor: hoverColors,
							barThickness: 28
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						interaction: { mode: 'index', intersect: false },
						plugins: {
							legend: { display: true, position: 'bottom' },
							title: {
								display: !!rangeTitle,
								text: rangeTitle ? [rangeTitle] : []
							},
							tooltip: {
								callbacks: {
									title: (items) => items?.[0]?.label || '',
									label: (ctx) => {
										const v = ctx.parsed.y;
										const unit = unitByFilter[filter] || '';
										// 만족도는 소수 2자리, 나머지는 정수
										const val = (filter === 'satisfaction')
											? (Number.isFinite(v) ? v.toFixed(2) : '0.00')
											: (Number.isFinite(v) ? v.toLocaleString() : '0');
										return `${ctx.dataset.label}: ${val}${unit}`;
									}
								}
							}
						},
						scales: {
							y: (filter === 'satisfaction')
								? {
									beginAtZero: true,
									min: 0,
									max: 5,               // or suggestedMax: 5
									ticks: {
										stepSize: 1,        // ← 정수 간격 강제
										precision: 0,
										callback: (v) => `${v}점`
									},
									grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }
								}
								: {
									beginAtZero: true,
									ticks: {
										precision: 0,
										callback: (v) => `${Number(v).toLocaleString()}건`
									},
									grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }
								},
							x: {
								grid: { display: false },
								ticks: {
									maxRotation: 0,
									minRotation: 0,
									callback: function(value, index) {
										const label = this.getLabelForValue(index);
										return label.length > 12 ? label.slice(0, 12) + '…' : label;
									}
								}
							}
						}
					}
				});
			})
			.catch(err => {
				console.error('상담사 TOP 리스트 차트 로드 실패:', err);
			});
	}

	function counselingStatsByCategoryChart() {
		const ctx = document.getElementById('counselingStatsByCategoryChartCanvas').getContext('2d');

		// 기존 차트 파괴
		if (window.counselingStatsByCategoryChartInstance) {
			window.counselingStatsByCategoryChartInstance.destroy();
		}

		// 파라미터
		const params = buildTypeParams();
		const rangeTitle = (params.selectUserInquiry === 'selectDays' && params.startDate && params.endDate)
			? `${params.startDate.replace(/-/g, '. ')}. ~ ${params.endDate.replace(/-/g, '. ')}.`
			: '';

		// 보라 팔레트(3색) + 호버색
		const purplePalette = ['#727CF5', '#0ACF97', '#FE849C'];
		const hoverColor = ['#6068D3', '#09B78A', '#E5778E'];

		axios.get('/admin/csmg/selectCounselingStatsByCategory.do', { params })
			.then(res => {
				const rows = Array.isArray(res.data) ? res.data : [];

				// (선택) 보기 좋게 건수 내림차순
				rows.sort((a, b) => (b.TOTAL_CONSULTATIONS || 0) - (a.TOTAL_CONSULTATIONS || 0));

				const labels = rows.map(r => r.CC_NAME || '-');
				const values = rows.map(r => Number(r.TOTAL_CONSULTATIONS ?? 0));

				const bgColors = values.map((_, i) => purplePalette[i % purplePalette.length]);

				// 이 부분을 수정해야 합니다.
				// 기존: const hoverColors = values.map(() => hoverColor);
				const hoverColors = values.map((_, i) => hoverColor[i % hoverColor.length]);

				window.counselingStatsByCategoryChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels,
						datasets: [{
							label: '카테고리별 상담건수',
							data: values,
							backgroundColor: bgColors,
							borderColor: bgColors,
							borderWidth: 1,
							hoverBackgroundColor: hoverColors,
							barThickness: 28
						}]
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						maintainAspectRatio: false,
						interaction: { mode: 'index', intersect: false },
						plugins: {
							legend: { display: false, position: 'bottom' },
							title: {
								display: !!rangeTitle,
								text: rangeTitle ? [rangeTitle] : []
							},
							tooltip: {
								callbacks: {
									title: (items) => items?.[0]?.label || '',
									label: (ctx) => {
										const v = ctx.parsed.x;
										const val = Number.isFinite(v) ? v.toLocaleString() : '0';
										return `${ctx.dataset.label}: ${val}건`;
									}
								}
							}
						},
						scales: {
							x: {
								beginAtZero: true,
								ticks: { callback: v => `${Number(v).toLocaleString()}건` }
							},
							y: {
								grid: { display: false },
								ticks: {
									maxRotation: 0,
									minRotation: 0,
									callback: function(_, index) {
										const label = this.getLabelForValue(index);
										return label.length > 8 ? label.slice(0, 8) + '…' : label;
									}
								}
							}
						}
					}
				});
			})
			.catch(err => {
				console.error('상담 종류별 통계 차트 로드 실패:', err);
			});
	}

	function counselingStatsByTimeChartCanvas() {
		const ctx = document.getElementById('counselingStatsByTimeChartCanvas').getContext('2d');

		// 기존 차트 파괴
		if (window.counselingStatsByTimeChartInstance) {
			window.counselingStatsByTimeChartInstance.destroy();
		}

		const params = buildHoursParams();

		// 09 ~ 18
		const hours = Array.from({ length: 10 }, (_, i) => String(i + 9).padStart(2, '0'));
		const labels = hours.map(h => `${h}시`);

		// 시리즈별 스타일(붉은계열 추가, 보라/그린/빨강 사용)
		const SERIES_STYLES = {
			'대면상담': {
				border: '#6C4DDC',
				point: '#6C4DDC',
				gradFrom: 'rgba(108,77,220,0.25)',
				gradTo: 'rgba(108,77,220,0.00)'
			},
			'채팅상담': {
				border: '#00C896',
				point: '#00C896',
				gradFrom: 'rgba(0,200,150,0.20)',
				gradTo: 'rgba(0,200,150,0.00)'
			},
			'화상상담': {
				border: '#E25858',
				point: '#E25858',
				gradFrom: 'rgba(226,88,88,0.20)',
				gradTo: 'rgba(226,88,88,0.00)'
			}
		};
		const HOVER_POINT = '#A858FF'; // 공통 hover 포인트 컬러(보라계열)

		const SHOW_ZERO_AS_GAP = false; // 0은 끊김(null) 처리해서 요동 줄임

		const rangeTitle = (params.selectUserInquiry === 'selectDays' && params.startDate && params.endDate)
			? `${params.startDate.replace(/-/g, '. ')}. ~ ${params.endDate.replace(/-/g, '. ')}.`
			: '';

		axios.get('/admin/csmg/selectCounselingStatsByTime.do', { params })
			.then(res => {
				const rows = Array.isArray(res.data) ? res.data : [];

				// 유형 고정 순서 + 응답에 새 유형 생겨도 반영
				const pref = ['대면상담', '채팅상담', '화상상담'];
				const found = Array.from(new Set(rows.map(r => r.CONSULTATION_TYPE)));
				const types = [...pref.filter(t => found.includes(t)), ...found.filter(t => !pref.includes(t))];

				// 데이터셋 구성 (시간대 매핑)
				const datasets = types.map(type => {
					const s = SERIES_STYLES[type] || { border: '#7F8CFF', point: '#7F8CFF', gradFrom: 'rgba(127,140,255,0.20)', gradTo: 'rgba(127,140,255,0.00)' };
					const data = hours.map(h => {
						const row = rows.find(r => r.CONSULTATION_TYPE === type && String(r.CONSULTATION_HOUR).padStart(2, '0') === h);
						const v = Number(row?.TOTAL_CONSULTATIONS ?? 0);
						return (SHOW_ZERO_AS_GAP && v === 0) ? null : v;
					});
					return {
						label: type,
						data,
						borderColor: s.border,
						borderWidth: 2,
						pointRadius: 2,
						pointHoverRadius: 5,
						pointBackgroundColor: s.point,
						pointHoverBackgroundColor: HOVER_POINT,
						tension: 0.2,
						cubicInterpolationMode: 'monotone',
						spanGaps: true,
						fill: true,
						backgroundColor: function(bgCtx) {
							const { ctx, chartArea } = bgCtx.chart; if (!chartArea) return null;
							const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
							g.addColorStop(0, s.gradFrom);
							g.addColorStop(1, s.gradTo);
							return g;
						}
					};
				});

				// y 최대값 소폭 여유
				const maxY = Math.max(1, ...datasets.flatMap(ds => ds.data.filter(v => v != null)));

				window.counselingStatsByTimeChartInstance = new Chart(ctx, {
					type: 'line',
					data: { labels, datasets },
					options: {
						responsive: true,
						maintainAspectRatio: false,
						interaction: { mode: 'index', intersect: false },
						plugins: {
							legend: { display: true, position: 'bottom', labels: { padding: 20 } },
							// 타이틀/기간표시는 기존 로직(selectDays일 때만) 그대로 두세요
							title: {
								display: !!rangeTitle,
								text: rangeTitle ? [rangeTitle] : []
							},
							tooltip: {
								mode: 'index',
								intersect: false,
								callbacks: {
									label: (context) => {
										const v = context.parsed.y;
										const val = Number.isFinite(v) ? v.toLocaleString() : '0';
										return `${context.dataset.label}: ${val}건`;
									}
								}
							}
						},
						scales: {
							y: {
								beginAtZero: true,
								suggestedMax: Math.ceil(maxY + 1),
								grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
								ticks: { stepSize: 1, callback: v => `${Number(v).toLocaleString()}건` }
							},
							x: { grid: { display: false, drawBorder: false } }
						}
					}
				});
			})
			.catch(err => {
				console.error('시간대별 상담 통계 차트(라인) 로드 실패:', err);
			});
	}
	// 상담 내역 sort 함수
	// 댓글 목록 정렬 처리 함수
	function handleReplySortClick(sortBy, userId, element) {
		const replyTbody = document.getElementById('userDetailReplyList');
		const replySortOrder = document.getElementById('memDetailReplySortOrder').value;

		replyTbody.dataset.sortBy = sortBy;
		replyTbody.dataset.sortOrder = replySortOrder;
		if (element) {
			setActiveButton(element);
		}
		const sortOrder = replyTbody.dataset.sortOrder;
		userDetailReplyList(userId, 1, sortBy, sortOrder);
	}


	// ===== 초기화 =====
	function setDefaultDateRangeForCate() {
		if (!cateStart || !cateEnd) return;
		const r = getRecentDaysRange(7);
		cateStart.value = r.start;
		cateEnd.value = r.end;
	}
	async function init() {
		setDefaultRange(cateStart, cateEnd);
		setDefaultRange(typeStart, typeEnd);
		setDefaultRange(top3Start, top3End);
		setDefaultRange(hoursStart, hoursEnd);

		bindChartSelectEvents(); // [ADD] 셀렉트 이벤트 연결

		consultMethodStatisticsChart();	// 상담 유형별 통계
		topCounselorListChart();		// 상담 TOP3
		counselingStatsByCategoryChart(); // 상담 종류별 통계
		counselingStatsByTimeChartCanvas(); // 상담 시간대 통계
		setupEventListeners();
		setDefaultDateRangeForCate();
		await loadCards();          // 상단 카드
		await fetchList(1);         // 상담사 목록
	}

	init();
}

counselorManagement();
