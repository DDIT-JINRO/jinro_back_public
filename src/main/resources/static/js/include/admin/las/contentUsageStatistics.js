function contentUsageStatistics() {
	// 공용 달력 input 요소
	const hiddenInput = document.getElementById('comCalendarInput');

	// 각 차트별 select 요소들 (payment.js 패턴과 동일)
	const roadmapChartDaySel = document.getElementById('roadmapChartDay');
	const roadmapChartGenderSel = document.getElementById('roadmapChartGender');
	const roadmapChartAgeGroupSel = document.getElementById('roadmapChartAgeGroup');
	const roadmapAndWorldCupChartResetBtn = document.getElementById('roadmapAndWorldCupChartReset');

	const commUsageChartDaySel = document.getElementById('commUsageChartDay');
	const commUsageChartGenderSel = document.getElementById('commUsageChartGender');
	const commUsageChartAgeGroupSel = document.getElementById('commUsageChartAgeGroup');
	const commUsageChartCategorySel = document.getElementById('commUsageChartCategory');
	const commUsageChartResetBtn = document.getElementById('commUsageChartReset');

	const bookmarkCategoryChartDaySel = document.getElementById('bookmarkCategoryChartDay');
	const bookmarkCategoryChartGenderSel = document.getElementById('bookmarkCategoryChartGender');
	const bookmarkCategoryChartAgeGroupSel = document.getElementById('bookmarkCategoryChartAgeGroup');
	const bookmarkCategoryChartResetBtn = document.getElementById('bookmarkCategoryChartReset');

	const bookmarkTopChartDaySel = document.getElementById('bookmarkTopChartDay');
	const bookmarkTopChartGenderSel = document.getElementById('bookmarkTopChartGender');
	const bookmarkTopChartAgeGroupSel = document.getElementById('bookmarkTopChartAgeGroup');
	const bookmarkTopChartResetBtn = document.getElementById('bookmarkTopChartReset');

	// 이벤트 리스너 등록
	setupEventListeners();

	function setupEventListeners() {
		// 월드컵 로드맵 차트 이벤트
		roadmapChartDaySel.addEventListener('change', eventDateRangeSelect);
		roadmapChartGenderSel.addEventListener('change', loadWorldcupRoadmapChart);
		roadmapChartAgeGroupSel.addEventListener('change', loadWorldcupRoadmapChart);
		roadmapAndWorldCupChartResetBtn.addEventListener('click', function() {
			resetChartFilters('roadmapAndWorldCup');
		});

		// 커뮤니티 이용통계 차트 이벤트
		commUsageChartDaySel.addEventListener('change', eventDateRangeSelect);
		commUsageChartGenderSel.addEventListener('change', loadCommunityUsageChart);
		commUsageChartAgeGroupSel.addEventListener('change', loadCommunityUsageChart);
		commUsageChartCategorySel.addEventListener('change', loadCommunityUsageChart);
		commUsageChartResetBtn.addEventListener('click', function() {
			resetChartFilters('communityUsage');
		});

		// 북마크 카테고리 차트 이벤트
		bookmarkCategoryChartDaySel.addEventListener('change', eventDateRangeSelect);
		bookmarkCategoryChartGenderSel.addEventListener('change', loadBookmarkCategoryChart);
		bookmarkCategoryChartAgeGroupSel.addEventListener('change', loadBookmarkCategoryChart);
		bookmarkCategoryChartResetBtn.addEventListener('click', function() {
			resetChartFilters('bookmarkCategory');
		});

		// 북마크 TOP 차트 이벤트
		bookmarkTopChartDaySel.addEventListener('change', eventDateRangeSelect);
		bookmarkTopChartGenderSel.addEventListener('change', loadBookmarkTopChart);
		bookmarkTopChartAgeGroupSel.addEventListener('change', loadBookmarkTopChart);
		bookmarkTopChartResetBtn.addEventListener('click', function() {
			resetChartFilters('bookmarkTop');
		});
	}

	// 차트 필터 리셋 함수 (payment.js 패턴과 동일)
	function resetChartFilters(chartType) {
		const defaultRange = getRecentDaysRange(7); // 기본적으로 최근 7일

		switch (chartType) {
			case 'communityUsage':
				document.getElementById('commUsageChartDay').value = 'daily';
				document.getElementById('commUsageChartGender').value = '';
				document.getElementById('commUsageChartAgeGroup').value = '';
				document.getElementById('commUsageChartCategory').value = '';
				document.getElementById('commUsageChartStartDay').value = defaultRange.start;
				document.getElementById('commUsageChartEndDay').value = defaultRange.end;
				loadCommunityUsageChart();
				break;
			case 'bookmarkCategory':
				document.getElementById('bookmarkCategoryChartDay').value = 'daily';
				document.getElementById('bookmarkCategoryChartGender').value = '';
				document.getElementById('bookmarkCategoryChartAgeGroup').value = '';
				document.getElementById('bookmarkCategoryChartStartDay').value = defaultRange.start;
				document.getElementById('bookmarkCategoryChartEndDay').value = defaultRange.end;
				loadBookmarkCategoryChart();
				break;
			case 'bookmarkTop':
				document.getElementById('bookmarkTopChartDay').value = 'daily';
				document.getElementById('bookmarkTopChartGender').value = '';
				document.getElementById('bookmarkTopChartAgeGroup').value = '';
				document.getElementById('bookmarkTopChartStartDay').value = defaultRange.start;
				document.getElementById('bookmarkTopChartEndDay').value = defaultRange.end;
				loadBookmarkTopChart();
				break;
			case 'roadmapAndWorldCup':
				document.getElementById('roadmapChartDay').value = 'daily';
				document.getElementById('roadmapChartGender').value = '';
				document.getElementById('roadmapChartAgeGroup').value = '';
				document.getElementById('roadmapChartStartDay').value = defaultRange.start;
				document.getElementById('roadmapChartEndDay').value = defaultRange.end;
				loadWorldcupRoadmapChart();
				break;
		}
	}

	// 날짜 형식 변환을 위한 헬퍼 함수들 (payment.js와 동일)
	function formatDateCal(d) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function formatDateRange(fS, fE) {
		return `${fS} ~ ${fE} 기간`;
	}

	function formatDailyDate(isoString) {
		const date = new Date(isoString);
		return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
	}

	function formatMonthlyDate(isoString) {
		const date = new Date(isoString);
		return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`;
	}

	// 기본 날짜 범위 계산 함수들 (payment.js와 동일)
	function getRecentDaysRange(days = 7) {
		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(today.getDate() - (days - 1));

		return {
			start: formatDateCal(startDate),
			end: formatDateCal(today)
		};
	}

	function getCurrentYearRange() {
		const today = new Date();
		const startDate = new Date(today.getFullYear(), 0, 1); // 올해 1월 1일

		return {
			start: formatDateCal(startDate),
			end: formatDateCal(today)
		};
	}

	// 차트 로드 시 기본 날짜 범위 설정 (payment.js와 동일)
	function setDefaultDateRange() {
		const weekRange = getRecentDaysRange(7); // 최근 7일

		// 모든 차트의 시작일과 종료일을 최근 7일로 설정
		document.getElementById('roadmapChartStartDay').value = weekRange.start;
		document.getElementById('roadmapChartEndDay').value = weekRange.end;
		document.getElementById('commUsageChartStartDay').value = weekRange.start;
		document.getElementById('commUsageChartEndDay').value = weekRange.end;
		document.getElementById('bookmarkCategoryChartStartDay').value = weekRange.start;
		document.getElementById('bookmarkCategoryChartEndDay').value = weekRange.end;
		document.getElementById('bookmarkTopChartStartDay').value = weekRange.start;
		document.getElementById('bookmarkTopChartEndDay').value = weekRange.end;

		return weekRange;
	}

	// 일별, 월별, 기간선택에 대해서 이벤트 바인딩 (payment.js와 동일)
	function eventDateRangeSelect(e) {
		const selectEl = e.target.nodeName == "SELECT" ? e.target : e.target.closest('select');
		const dateValue = selectEl.value;

		if (dateValue == 'daily') {
			// 일별 선택 시 최근 7일 범위 설정
			const dailyRange = getRecentDaysRange(7);

			if (selectEl.id == 'roadmapChartDay') {
				document.getElementById("roadmapChartStartDay").value = dailyRange.start;
				document.getElementById("roadmapChartEndDay").value = dailyRange.end;
				loadWorldcupRoadmapChart();
			} else if (selectEl.id == 'commUsageChartDay') {
				document.getElementById("commUsageChartStartDay").value = dailyRange.start;
				document.getElementById("commUsageChartEndDay").value = dailyRange.end;
				loadCommunityUsageChart();
			} else if (selectEl.id == 'bookmarkCategoryChartDay') {
				document.getElementById("bookmarkCategoryChartStartDay").value = dailyRange.start;
				document.getElementById("bookmarkCategoryChartEndDay").value = dailyRange.end;
				loadBookmarkCategoryChart();
			} else if (selectEl.id == 'bookmarkTopChartDay') {
				document.getElementById("bookmarkTopChartStartDay").value = dailyRange.start;
				document.getElementById("bookmarkTopChartEndDay").value = dailyRange.end;
				loadBookmarkTopChart();
			}
		} else if (dateValue == 'monthly') {
			// 월별 선택 시 올해 1월부터 현재까지 범위 설정
			const monthlyRange = getCurrentYearRange();

			if (selectEl.id == 'roadmapChartDay') {
				document.getElementById("roadmapChartStartDay").value = monthlyRange.start;
				document.getElementById("roadmapChartEndDay").value = monthlyRange.end;
				loadWorldcupRoadmapChart();
			} else if (selectEl.id == 'commUsageChartDay') {
				document.getElementById("commUsageChartStartDay").value = monthlyRange.start;
				document.getElementById("commUsageChartEndDay").value = monthlyRange.end;
				loadCommunityUsageChart();
			} else if (selectEl.id == 'bookmarkCategoryChartDay') {
				document.getElementById("bookmarkCategoryChartStartDay").value = monthlyRange.start;
				document.getElementById("bookmarkCategoryChartEndDay").value = monthlyRange.end;
				loadBookmarkCategoryChart();
			} else if (selectEl.id == 'bookmarkTopChartDay') {
				document.getElementById("bookmarkTopChartStartDay").value = monthlyRange.start;
				document.getElementById("bookmarkTopChartEndDay").value = monthlyRange.end;
				loadBookmarkTopChart();
			}
		} else if (dateValue == 'selectDays') {
			// flatpickr 중복 초기화 방지 (payment.js와 동일)
			if (hiddenInput._flatpickr) {
				hiddenInput._flatpickr.destroy();
			}

			flatpickr(hiddenInput, {
				mode: "range",
				maxDate: "today",
				disable: [date => date > new Date()],
				positionElement: selectEl,
				onChange: function(selectedDates) {
					if (selectedDates.length === 2) {
						const startDate = selectedDates[0];
						const endDate = selectedDates[1];
						const formattedStartDate = formatDateCal(startDate);
						const formattedEndDate = formatDateCal(endDate);

						if (selectEl.id == 'roadmapChartDay') {
							document.getElementById('roadmapChartStartDay').value = formattedStartDate;
							document.getElementById('roadmapChartEndDay').value = formattedEndDate;
							loadWorldcupRoadmapChart();
							if (window.worldcupRoadmapChartInstance) {
								window.worldcupRoadmapChartInstance.destroy();
							}
						} else if (selectEl.id == 'commUsageChartDay') {
							document.getElementById('commUsageChartStartDay').value = formattedStartDate;
							document.getElementById('commUsageChartEndDay').value = formattedEndDate;
							loadCommunityUsageChart();
							if (window.communityUsageChartInstance) {
								window.communityUsageChartInstance.destroy();
							}
						} else if (selectEl.id == 'bookmarkCategoryChartDay') {
							document.getElementById('bookmarkCategoryChartStartDay').value = formattedStartDate;
							document.getElementById('bookmarkCategoryChartEndDay').value = formattedEndDate;
							loadBookmarkCategoryChart();
							if (window.bookmarkCategoryChartInstance) {
								window.bookmarkCategoryChartInstance.destroy();
							}
						} else if (selectEl.id == 'bookmarkTopChartDay') {
							document.getElementById('bookmarkTopChartStartDay').value = formattedStartDate;
							document.getElementById('bookmarkTopChartEndDay').value = formattedEndDate;
							loadBookmarkTopChart();
							if (window.bookmarkTopChartInstance) {
								window.bookmarkTopChartInstance.destroy();
							}
						}
					}
				}
			});

			hiddenInput._flatpickr.open();
			hiddenInput._flatpickr.clear();
		}
	}

	// ========================= 월드컵 로드맵 차트 (payment.js 패턴 적용) =========================
	function loadWorldcupRoadmapChart() {
		const ctx = document.getElementById('roadmapAndWorldSelectGroupChartCanvas').getContext('2d');

		const dateValue = document.getElementById("roadmapChartDay").value;
		const genderValue = document.getElementById("roadmapChartGender").value;
		const ageGroupValue = document.getElementById("roadmapChartAgeGroup").value;
		const startDateValue = document.getElementById("roadmapChartStartDay").value;
		const endDateValue = document.getElementById("roadmapChartEndDay").value;

		let chartRange = "";
		if (startDateValue && endDateValue) {
			chartRange = formatDateRange(startDateValue, endDateValue);
		}

		const params = {
			period: dateValue,
			startDate: startDateValue,
			endDate: endDateValue,
			gender: genderValue,
			ageGroup: ageGroupValue
		};

		// 기존 차트 파괴 (payment.js 패턴)
		if (window.worldcupRoadmapChartInstance) {
			window.worldcupRoadmapChartInstance.destroy();
		}




		axios.get('/admin/las/cont/worldcup-roadmap/usage-stats', { params })
			.then(res => {
				const responseData = res.data;

				let labels;
				let chartLabel1, chartLabel2;
				if (dateValue === 'monthly') {
					labels = responseData.map(item => formatMonthlyDate(item.dt));
					chartLabel1 = '월별 월드컵 이용';
					chartLabel2 = '월별 로드맵 이용';
				} else {
					labels = responseData.map(item => formatDailyDate(item.dt));
					chartLabel1 = '일별 월드컵 이용';
					chartLabel2 = '일별 로드맵 이용';
				}

				const worldcupData = responseData.map(item => item.worldcupCnt || 0);
				const roadmapData = responseData.map(item => item.roadmapCnt || 0);

				window.worldcupRoadmapChartInstance = new Chart(ctx, {
					type: 'line',
					data: {
						labels: labels,
						datasets: [{
							label: chartLabel1,
							data: worldcupData,
							borderColor: 'rgb(255, 99, 132)',
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							tension: 0.4,
							pointRadius: 3,
							pointHoverRadius: 6,
							pointStyle: 'circle',
							fill: false
						}, {
							label: chartLabel2,
							data: roadmapData,
							borderColor: 'rgb(54, 162, 235)',
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							tension: 0.4,
							pointRadius: 3,
							pointHoverRadius: 6,
							pointStyle: 'circle',
							fill: false
						}]
					},
					options: {
						animation: {
							duration: 1000, // 애니메이션이 1초(1000ms) 동안 실행됩니다.
							easing: 'easeInOutQuad', // 애니메이션 효과의 속도 곡선을 설정합니다.
							// onComplete, onProgress 등 다양한 콜백 함수도 사용할 수 있습니다.
						},
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true,
								position: 'bottom',
							},
							title: {
								display: true,
								text: [
									chartRange
								],
							}
						},
						scales: {
							x: { grid: { display: false } },
							y: {
								beginAtZero: true,
								// y축 tick 설정 개선
								ticks: {
									stepSize: Math.ceil(Math.max(...worldcupData, ...roadmapData) / 10) || 1,
									callback: function(value) {
										return value.toLocaleString();
									}
								},
								grid: {
									borderDash: [3],
									color: '#e5e5e5'
								}
							}
						}
					}
				});
			})
			.catch(error => {
				console.error("월드컵 로드맵 데이터 조회 중 에러:", error);
			});
	}

	// ========================= 커뮤니티 이용통계 차트 =========================
	function loadCommunityUsageChart() {
		const ctx = document.getElementById('communityUsageChart').getContext('2d');

		const dateValue = document.getElementById("commUsageChartDay").value;
		const genderValue = document.getElementById("commUsageChartGender").value;
		const ageGroupValue = document.getElementById("commUsageChartAgeGroup").value;
		const categoryValue = document.getElementById("commUsageChartCategory").value;
		const startDateValue = document.getElementById("commUsageChartStartDay").value;
		const endDateValue = document.getElementById("commUsageChartEndDay").value;

		let chartRange = "";
		if (startDateValue && endDateValue) {
			chartRange = formatDateRange(startDateValue, endDateValue);
		}

		const params = {
			period: dateValue,
			startDate: startDateValue,
			endDate: endDateValue,
			gender: genderValue,
			ageGroup: ageGroupValue,
			category: categoryValue  // 카테고리 파라미터 추가
		};

		// 기존 차트 파괴
		if (window.communityUsageChartInstance) {
			window.communityUsageChartInstance.destroy();
		}

		ctx.canvas.style.maxHeight = '300px';

		axios.get('/admin/las/cont/community/usage-stats', { params })
			.then(res => {
				const responseData = res.data;


				let labels;
				if (dateValue === 'monthly') {
					labels = responseData.map(item => formatMonthlyDate(item.dt));
				} else {
					labels = responseData.map(item => formatDailyDate(item.dt));
				}

				// 카테고리 필터링이 있는 경우와 없는 경우 구분
				let datasets = [];

				if (categoryValue && categoryValue !== '') {
					// 특정 카테고리만 선택된 경우
					const categoryNames = {
						'G09006': '청년 커뮤니티',
						'G09001': '청소년 커뮤니티',
						'G09002': '진로진학 커뮤니티',
						'G09004': '이력서 템플릿',
						'G09005': '스터디그룹'
					};
					const categoryFields = {
						'G09006': 'youthCnt',
						'G09001': 'teenCnt',
						'G09002': 'noticeCnt',
						'G09004': 'resumeTemplateCnt',
						'G09005': 'studyGroupCnt'
					};

					datasets = [{
						label: categoryNames[categoryValue] || '선택된 카테고리',
						data: responseData.map(item => item[categoryFields[categoryValue]] || 0),
						borderColor: 'rgb(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.1)',
						tension: 0.1,
						fill: false
					}];
				} else {
					// 전체 카테고리 표시
					datasets = [{
						label: '청년 커뮤니티',
						data: responseData.map(item => item.youthCnt || 0),
						borderColor: 'rgb(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.1)',
						tension: 0.1,
						fill: false
					}, {
						label: '청소년 커뮤니티',
						data: responseData.map(item => item.teenCnt || 0),
						borderColor: 'rgb(54, 162, 235)',
						backgroundColor: 'rgba(54, 162, 235, 0.1)',
						tension: 0.1,
						fill: false
					}, {
						label: '진로진학 커뮤니티',
						data: responseData.map(item => item.noticeCnt || 0),
						borderColor: 'rgb(255, 205, 86)',
						backgroundColor: 'rgba(255, 205, 86, 0.1)',
						tension: 0.1,
						fill: false
					}, {
						label: '이력서 템플릿',
						data: responseData.map(item => item.resumeTemplateCnt || 0),
						borderColor: 'rgb(75, 192, 192)',
						backgroundColor: 'rgba(75, 192, 192, 0.1)',
						tension: 0.1,
						fill: false
					}, {
						label: '스터디그룹',
						data: responseData.map(item => item.studyGroupCnt || 0),
						borderColor: 'rgb(153, 102, 255)',
						backgroundColor: 'rgba(153, 102, 255, 0.1)',
						tension: 0.1,
						fill: false
					}];
				}

				window.communityUsageChartInstance = new Chart(ctx, {
					type: 'line',
					data: {
						labels: labels,
						datasets: datasets
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true,
								position: 'bottom',
							},
							title: {
								display: true,
								text: [
									chartRange
								],
							}
						},
						scales: {
							x: { grid: { display: false } },
							y: {
								beginAtZero: true,
								grid: {
									borderDash: [3],
									color: '#e5e5e5'
								}
							}
						}
					}
				});
			})
			.catch(error => {
				console.error("커뮤니티 이용통계 데이터 조회 중 에러:", error);
			});
	}

	// ========================= 북마크 카테고리별 통계현황 차트 =========================
	function loadBookmarkCategoryChart() {
		const ctx = document.getElementById('bookmarkCategoryChart').getContext('2d');

		const dateValue = document.getElementById("bookmarkCategoryChartDay").value;
		const genderValue = document.getElementById("bookmarkCategoryChartGender").value;
		const ageGroupValue = document.getElementById("bookmarkCategoryChartAgeGroup").value;
		const startDateValue = document.getElementById("bookmarkCategoryChartStartDay").value;
		const endDateValue = document.getElementById("bookmarkCategoryChartEndDay").value;

		let chartRange = "";
		if (startDateValue && endDateValue) {
			chartRange = formatDateRange(startDateValue, endDateValue);
		}

		const params = {
			period: dateValue,
			startDate: startDateValue,
			endDate: endDateValue,
			gender: genderValue,
			ageGroup: ageGroupValue
		};

		// 기존 차트 파괴
		if (window.bookmarkCategoryChartInstance) {
			window.bookmarkCategoryChartInstance.destroy();
		}

		axios.get('/admin/las/cont/bookmark/category-stacked', { params })
			.then(res => {
				const responseData = res.data;

				// 고정된 5개 카테고리 정의 (ServiceImpl 참고)
				const fixedCategories = ['대학', '기업', '직업', '이력서템플릿', '학과'];
				const categoryIds = ['G03001', 'G03002', 'G03004', 'G03005', 'G03006'];

				// API 응답 데이터를 카테고리별로 매핑
				const categoryDataMap = {};
				responseData.forEach(item => {
					const categoryName = item.categoryName;
					const maleCnt = item.maleCnt || 0;
					const femaleCnt = item.femaleCnt || 0;
					categoryDataMap[categoryName] = (categoryDataMap[categoryName] || 0) + (maleCnt + femaleCnt);
				});

				// 고정된 순서로 데이터 구성 (없는 카테고리는 0으로 설정)
				const counts = fixedCategories.map(category => categoryDataMap[category] || 0);

				window.bookmarkCategoryChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: fixedCategories, // 고정된 카테고리 사용
						datasets: [{
							label: '북마크 수',
							data: counts, // 고정된 순서의 데이터
							backgroundColor: [
								'rgba(255, 99, 132, 0.8)',
								'rgba(54, 162, 235, 0.8)',
								'rgba(255, 205, 86, 0.8)',
								'rgba(75, 192, 192, 0.8)',
								'rgba(153, 102, 255, 0.8)'
							],
							borderColor: [
								'rgba(255, 99, 132, 1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 205, 86, 1)',
								'rgba(75, 192, 192, 1)',
								'rgba(153, 102, 255, 1)'
							],
							borderWidth: 1,
							borderRadius: 4,
							barPercentage: 0.4,
							categoryPercentage: 0.8
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
								display: true,
								text: [
									chartRange
								],
							}
						},
						scales: {
							x: { grid: { display: false } },
							y: {
								beginAtZero: true,
								grid: {
									borderDash: [3],
									color: '#e5e5e5'
								}
							}
						}
					}
				});
			})
			.catch(error => {
				console.error("북마크 카테고리 데이터 조회 중 에러:", error);
			});
	}

	// ========================= 북마크 상세 현황(TOP) 차트 =========================
	function loadBookmarkTopChart() {
		const ctx = document.getElementById('bookmarkTopChart').getContext('2d');

		const dateValue = document.getElementById("bookmarkTopChartDay").value;
		const genderValue = document.getElementById("bookmarkTopChartGender").value;
		const ageGroupValue = document.getElementById("bookmarkTopChartAgeGroup").value;
		const startDateValue = document.getElementById("bookmarkTopChartStartDay").value;
		const endDateValue = document.getElementById("bookmarkTopChartEndDay").value;

		let chartRange = "";
		if (startDateValue && endDateValue) {
			chartRange = formatDateRange(startDateValue, endDateValue);
		}

		const params = {
			period: dateValue,
			startDate: startDateValue,
			endDate: endDateValue,
			gender: genderValue,
			ageGroup: ageGroupValue
		};

		// 기존 차트 파괴
		if (window.bookmarkTopChartInstance) {
			window.bookmarkTopChartInstance.destroy();
		}

		axios.get('/admin/las/cont/bookmark/top', { params })
			.then(res => {
				const responseData = res.data;

				const labels = responseData.map(item =>
					item.TARGETNAME || item.targetName
				);
				const counts = responseData.map(item =>
					item.CNT || item.cnt
				);

				window.bookmarkTopChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labels,
						datasets: [{
							label: '북마크 수',
							data: counts,

							backgroundColor: [
								'rgba(255, 99, 132, 0.8)',
								'rgba(54, 162, 235, 0.8)',
								'rgba(255, 205, 86, 0.8)',
								'rgba(75, 192, 192, 0.8)',
								'rgba(153, 102, 255, 0.8)'],
							borderColor: [
								'rgba(255, 99, 132, 1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 205, 86, 1)',
								'rgba(75, 192, 192, 1)',
								'rgba(153, 102, 255, 1)'],
							borderWidth: 1,
							borderRadius: 4,
							barPercentage: 0.4,
							categoryPercentage: 0.8
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						indexAxis: 'y',
						plugins: {
							legend: {
								display: false
							},
							title: {
								display: true,
								text: [
									chartRange
								],
							}
						},
						scales: {
							x: {
								beginAtZero: true,
								grid: {
									borderDash: [3],
									color: '#e5e5e5'
								}
							},
							y: { grid: { display: false } }
						}
					}
				});
			})
			.catch(error => {
				console.error("북마크 TOP 데이터 조회 중 에러:", error);
			});
	}

	// ========================= 기존 함수들 =========================
	function loadDailySummary() {
		axios.get('/admin/las/cont/daily-summary')
			.then(res => {
				const chartData = res.data;
				updateDailySummary(chartData);
			})
			.catch(err => {
				console.error('일일 요약 데이터 로드 실패:', err);
			});
	}

	function loadRoadmapStepDistribution() {
		axios.get('/admin/las/cont/roadmap/step-distribution')
			.then(res => {
				displayStepPercentages(res.data);
				const worldcupTopJobs = res.data.worldcupTopJobs;
				if (worldcupTopJobs) {
					displayTopJobs(worldcupTopJobs);
				}
			})
			.catch(err => {
				console.error('로드맵 단계 분포 데이터 로드 실패:', err);
			});
	}

	function setupCommunityStatsEvents() {
		fetchAndDisplayCommunityStats();

		const weekBtn = document.getElementById('commOnceView-weekBtn');
		const monthBtn = document.getElementById('commOnceView-monthBtn');

		if (weekBtn) {
			weekBtn.addEventListener('click', function() {
				setActiveButton(this);
				fetchAndDisplayCommunityStats('week');
			});
		}

		if (monthBtn) {
			monthBtn.addEventListener('click', function() {
				setActiveButton(this);
				fetchAndDisplayCommunityStats('month');
			});
		}
	}

	function fetchAndDisplayCommunityStats(period) {
		const params = {};
		if (period) {
			params.period = period;
		}
		axios.get('/admin/las/cont/community/activity-stats', { params })
			.then(res => {
				updateCommunityStats(res.data.stats, period || 'week');
			})
			.catch(err => {
				console.error('커뮤니티 통계 데이터 로드 실패:', err);
			});
	}

	function updateDailySummary(chartData) {
		const summaryMap = {
			'dailyPosts': {
				countId: 'dailyPosts',
				rateId: 'dailyPostsRate'
			},
			'dailyBookmarks': {
				countId: 'dailyBookmarks',
				rateId: 'dailyBookmarksRate'
			},
			'dailyChatRooms': {
				countId: 'dailyChatRooms',
				rateId: 'dailyChatRoomsRate'
			}
		};

		for (const key in summaryMap) {
			const count = chartData[key];
			const status = chartData[key + 'Status'];
			const rate = chartData[key + 'Rate'];

			const ids = summaryMap[key];

			const countElement = document.getElementById(ids.countId);
			const rateElement = document.getElementById(ids.rateId);

			if (countElement && typeof formatNumberWithCommasByAdminDashboard === 'function') {
				countElement.innerHTML = formatNumberWithCommasByAdminDashboard(count);
			}
			if (rateElement) {
				updateStatusUI(rateElement, status, rate);
			}
		}
	}

	function updateStatusUI(element, status, rate) {
		element.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');

		if (status === "increase") {
			element.innerHTML = `&#9650;&nbsp;${rate}%`;
			element.classList.add('public-span-increase');
		} else if (status === "decrease") {
			element.innerHTML = `&#9660;&nbsp;${rate}%`;
			element.classList.add('public-span-decrease');
		} else if (status === "equal") {
			element.innerHTML = `- ${rate}%`;
			element.classList.add('public-span-equal');
		} else {
			element.innerHTML = `NEW`;
			element.classList.add('public-span-increase');
		}
	}

	function updateCommunityStats(stats, period) {
		const statsMap = {
			'POST': 'stats-box-post',
			'POST_LIKE': 'stats-box-post-like',
			'REPLY': 'stats-box-reply',
			'REPLY_LIKE': 'stats-box-reply-like'
		};

		const sinceText = period === 'month' ? 'Since last month' : 'Since last week';
		for (const key in statsMap) {
			if (stats.hasOwnProperty(key)) {
				const data = stats[key];
				const boxId = statsMap[key];

				const boxElement = document.getElementById(boxId);

				if (boxElement) {
					const countElement = boxElement.querySelector('.commOnceView-box-cnt');
					const rateElement = boxElement.querySelector('.commOnceView-rate span');
					const sinceElement = boxElement.querySelector('.public-span-since');

					if (countElement) {
						countElement.textContent = data.currentPeriod.toLocaleString();
					}
					if (rateElement) {
						updateRateUI(rateElement, data.growthStatus, data.growthRate);
					}
					if (sinceElement) {
						sinceElement.textContent = sinceText;
					}
				}
			}
		}
	}

	function updateRateUI(element, status, rate) {
		element.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');

		if (status === "increase") {
			element.innerHTML = `&#9650;&nbsp;${rate}%`;
			element.classList.add('public-span-increase');
		} else if (status === "decrease") {
			element.innerHTML = `&#9660;&nbsp;${rate}%`;
			element.classList.add('public-span-decrease');
		} else {
			element.innerHTML = `- ${rate}%`;
			element.classList.add('public-span-equal');
		}
	}

	function displayTopJobs(jobsArray) {
		const container = document.getElementById('worldcupRn');

		if (!container) {
			console.error('ID가 "worldcupRn"인 요소를 찾을 수 없습니다.');
			return;
		}

		container.innerHTML = '';

		if (jobsArray && jobsArray.length > 0) {
			jobsArray.forEach(job => {
				const p = document.createElement('p');
				p.textContent = `${job.RN}. ${job.JOBNAME}`;
				container.appendChild(p);
			});
		} else {
			const p = document.createElement('p');
			p.textContent = '데이터가 없습니다.';
			container.appendChild(p);
		}
	}

	function displayStepPercentages(responseData) {
		const noStepElement = document.getElementById('roadmapStepCount-noStep');
		if (noStepElement) {
			const percentage = responseData.nonParticipatingPercentage;
			noStepElement.textContent = `${parseFloat(percentage).toFixed(1)}%`;
		}

		const apiNameToIdMap = {
			'1단계': 'roadmapStepCount-step1',
			'2단계': 'roadmapStepCount-step2',
			'3단계': 'roadmapStepCount-step3',
			'4단계': 'roadmapStepCount-step4',
			'완성': 'roadmapStepCount-complete'
		};

		const stepIds = [
			'roadmapStepCount-step1',
			'roadmapStepCount-step2',
			'roadmapStepCount-step3',
			'roadmapStepCount-step4',
			'roadmapStepCount-complete'
		];
		stepIds.forEach(id => {
			const element = document.getElementById(id);
			if (element) {
				element.textContent = '0%';
			}
		});

		if (responseData.stepDistribution) {
			responseData.stepDistribution.forEach(stepData => {
				const stepName = stepData.stepName;
				const elementId = apiNameToIdMap[stepName];

				if (elementId) {
					const targetElement = document.getElementById(elementId);
					if (targetElement) {
						targetElement.textContent = `${parseFloat(stepData.percentage).toFixed(1)}%`;
					}
				}
			});
		}
	}

	// 초기 데이터 로드 (payment.js 패턴과 동일)
	setDefaultDateRange(); // 기본적으로 이번주 범위 설정
	loadDailySummary();
	loadRoadmapStepDistribution();
	setupCommunityStatsEvents();
	loadWorldcupRoadmapChart();
	loadCommunityUsageChart();
	loadBookmarkCategoryChart();
	loadBookmarkTopChart();
}

// DOM이 완전히 로드된 후 함수 실행
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', contentUsageStatistics);
} else {
	contentUsageStatistics();
}