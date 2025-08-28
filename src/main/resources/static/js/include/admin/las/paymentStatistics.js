function paymentStatistics() {

	// 공용 달력 input 요소
	const hiddenInput = document.getElementById('comCalendarInput');

	// 각 차트별 select 요소들
	const revenueChartDaySel = document.getElementById('revenueChartDay');
	const revenueChartGenderSel = document.getElementById('revenueChartGender');
	const revenueChartAgeGroupSel = document.getElementById('revenueChartAgeGroup');
	const revenueChartResetBtn = document.getElementById('revenueChartReset');

	const productChartDaySel = document.getElementById('productChartDay');
	const productChartGenderSel = document.getElementById('productChartGender');
	const productChartAgeGroupSel = document.getElementById('productChartAgeGroup');
	const productChartResetBtn = document.getElementById('productChartReset');

	const subscriberChartDaySel = document.getElementById('subscriberChartDay');
	const subscriberChartGenderSel = document.getElementById('subscriberChartGender');
	const subscriberChartAgeGroupSel = document.getElementById('subscriberChartAgeGroup');
	const subscriberChartResetBtn = document.getElementById('subscriberChartReset');

	const aiServiceChartDaySel = document.getElementById('aiServiceChartDay');
	const aiServiceChartGenderSel = document.getElementById('aiServiceChartGender');
	const aiServiceChartAgeGroupSel = document.getElementById('aiServiceChartAgeGroup');
	const aiServiceChartTypeSel = document.getElementById('aiServiceChartType');
	const aiServiceChartResetBtn = document.getElementById('aiServiceChartReset');

	// 이벤트 리스너 등록
	setupEventListeners();

	function setupEventListeners() {
		// 구독 결제 매출 차트 이벤트
		revenueChartDaySel.addEventListener('change', eventDateRangeSelect);
		revenueChartGenderSel.addEventListener('change', loadRevenueChart);
		revenueChartAgeGroupSel.addEventListener('change', loadRevenueChart);
		revenueChartResetBtn.addEventListener('click', function() {
			resetChartFilters('revenue');
		});

		// 상품별 인기 통계 차트 이벤트
		productChartDaySel.addEventListener('change', eventDateRangeSelect);
		productChartGenderSel.addEventListener('change', loadProductChart);
		productChartAgeGroupSel.addEventListener('change', loadProductChart);
		productChartResetBtn.addEventListener('click', function() {
			resetChartFilters('product');
		});

		// 구독자 수 통계 차트 이벤트
		subscriberChartDaySel.addEventListener('change', eventDateRangeSelect);
		subscriberChartGenderSel.addEventListener('change', loadSubscriberChart);
		subscriberChartAgeGroupSel.addEventListener('change', loadSubscriberChart);
		subscriberChartResetBtn.addEventListener('click', function() {
			resetChartFilters('subscriber');
		});

		// 유료 컨텐츠 이용내역 차트 이벤트
		aiServiceChartDaySel.addEventListener('change', eventDateRangeSelect);
		aiServiceChartGenderSel.addEventListener('change', loadAiServiceChart);
		aiServiceChartAgeGroupSel.addEventListener('change', loadAiServiceChart);
		aiServiceChartTypeSel.addEventListener('change', loadAiServiceChart);
		aiServiceChartResetBtn.addEventListener('click', function() {
			resetChartFilters('aiService');
		});
	}

	// 차트 필터 리셋 함수
	function resetChartFilters(chartType) {
		const defaultRange = getRecentDaysRange(7); // 기본적으로 최근 7일

		switch (chartType) {
			case 'revenue':
				document.getElementById('revenueChartDay').value = 'daily';
				document.getElementById('revenueChartGender').value = '';
				document.getElementById('revenueChartAgeGroup').value = '';
				document.getElementById('revenueChartStartDay').value = defaultRange.start;
				document.getElementById('revenueChartEndDay').value = defaultRange.end;
				loadRevenueChart();
				break;
			case 'product':
				document.getElementById('productChartDay').value = 'daily';
				document.getElementById('productChartGender').value = '';
				document.getElementById('productChartAgeGroup').value = '';
				document.getElementById('productChartStartDay').value = defaultRange.start;
				document.getElementById('productChartEndDay').value = defaultRange.end;
				loadProductChart();
				break;
			case 'subscriber':
				document.getElementById('subscriberChartDay').value = 'daily';
				document.getElementById('subscriberChartGender').value = '';
				document.getElementById('subscriberChartAgeGroup').value = '';
				document.getElementById('subscriberChartStartDay').value = defaultRange.start;
				document.getElementById('subscriberChartEndDay').value = defaultRange.end;
				loadSubscriberChart();
				break;
			case 'aiService':
				document.getElementById('aiServiceChartDay').value = 'daily';
				document.getElementById('aiServiceChartGender').value = '';
				document.getElementById('aiServiceChartAgeGroup').value = '';
				document.getElementById('aiServiceChartType').value = '';
				document.getElementById('aiServiceChartStartDay').value = defaultRange.start;
				document.getElementById('aiServiceChartEndDay').value = defaultRange.end;
				loadAiServiceChart();
				break;
		}
	}

	// 날짜 형식 변환을 위한 헬퍼 함수들
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

	// 기본 날짜 범위 계산 함수들
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

	// 차트 로드 시 기본 날짜 범위 설정
	function setDefaultDateRange() {
		const weekRange = getRecentDaysRange(7); // 최근 7일

		// 모든 차트의 시작일과 종료일을 최근 7일로 설정
		document.getElementById('revenueChartStartDay').value = weekRange.start;
		document.getElementById('revenueChartEndDay').value = weekRange.end;
		document.getElementById('productChartStartDay').value = weekRange.start;
		document.getElementById('productChartEndDay').value = weekRange.end;
		document.getElementById('subscriberChartStartDay').value = weekRange.start;
		document.getElementById('subscriberChartEndDay').value = weekRange.end;
		document.getElementById('aiServiceChartStartDay').value = weekRange.start;
		document.getElementById('aiServiceChartEndDay').value = weekRange.end;

		return weekRange;
	}

	// 일별, 월별, 기간선택에 대해서 이벤트 바인딩 + 분기별 추가
	function eventDateRangeSelect(e) {
		const selectEl = e.target.nodeName == "SELECT" ? e.target : e.target.closest('select');
		const dateValue = selectEl.value;

		if (dateValue == 'daily') {
			// 일별 선택 시 최근 7일 범위 설정
			const dailyRange = getRecentDaysRange(7);

			if (selectEl.id == 'revenueChartDay') {
				document.getElementById("revenueChartStartDay").value = dailyRange.start;
				document.getElementById("revenueChartEndDay").value = dailyRange.end;
				loadRevenueChart();
			} else if (selectEl.id == 'productChartDay') {
				document.getElementById("productChartStartDay").value = dailyRange.start;
				document.getElementById("productChartEndDay").value = dailyRange.end;
				loadProductChart();
			} else if (selectEl.id == 'subscriberChartDay') {
				document.getElementById("subscriberChartStartDay").value = dailyRange.start;
				document.getElementById("subscriberChartEndDay").value = dailyRange.end;
				loadSubscriberChart();
			} else if (selectEl.id == 'aiServiceChartDay') {
				document.getElementById("aiServiceChartStartDay").value = dailyRange.start;
				document.getElementById("aiServiceChartEndDay").value = dailyRange.end;
				loadAiServiceChart();
			}
		} else if (dateValue == 'monthly') {
			// 월별 선택 시 올해 1월부터 현재까지 범위 설정
			const monthlyRange = getCurrentYearRange();

			if (selectEl.id == 'revenueChartDay') {
				document.getElementById("revenueChartStartDay").value = monthlyRange.start;
				document.getElementById("revenueChartEndDay").value = monthlyRange.end;
				loadRevenueChart();
			} else if (selectEl.id == 'productChartDay') {
				document.getElementById("productChartStartDay").value = monthlyRange.start;
				document.getElementById("productChartEndDay").value = monthlyRange.end;
				loadProductChart();
			} else if (selectEl.id == 'subscriberChartDay') {
				document.getElementById("subscriberChartStartDay").value = monthlyRange.start;
				document.getElementById("subscriberChartEndDay").value = monthlyRange.end;
				loadSubscriberChart();
			} else if (selectEl.id == 'aiServiceChartDay') {
				document.getElementById("aiServiceChartStartDay").value = monthlyRange.start;
				document.getElementById("aiServiceChartEndDay").value = monthlyRange.end;
				loadAiServiceChart();
			}
		} else if (dateValue == 'quarterly') {
			// 분기별 선택 시 올해 1월부터 현재까지 범위
			const quarterlyRange = getCurrentYearRange();

			if (selectEl.id == 'revenueChartDay') {
				document.getElementById("revenueChartStartDay").value = quarterlyRange.start;
				document.getElementById("revenueChartEndDay").value = quarterlyRange.end;
				loadRevenueChart();
			} else if (selectEl.id == 'productChartDay') {
				document.getElementById("productChartStartDay").value = quarterlyRange.start;
				document.getElementById("productChartEndDay").value = quarterlyRange.end;
				loadProductChart();
			} else if (selectEl.id == 'subscriberChartDay') {
				document.getElementById("subscriberChartStartDay").value = quarterlyRange.start;
				document.getElementById("subscriberChartEndDay").value = quarterlyRange.end;
				loadSubscriberChart();
			} else if (selectEl.id == 'aiServiceChartDay') {
				document.getElementById("aiServiceChartStartDay").value = quarterlyRange.start;
				document.getElementById("aiServiceChartEndDay").value = quarterlyRange.end;
				loadAiServiceChart();
			}
		} else if (dateValue == 'selectDays') {
			// flatpickr 중복 초기화 방지
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

						if (selectEl.id == 'revenueChartDay') {
							document.getElementById('revenueChartStartDay').value = formattedStartDate;
							document.getElementById('revenueChartEndDay').value = formattedEndDate;
							loadRevenueChart();
							if (window.revenueChartInstance) {
								window.revenueChartInstance.destroy();
							}
						} else if (selectEl.id == 'productChartDay') {
							document.getElementById('productChartStartDay').value = formattedStartDate;
							document.getElementById('productChartEndDay').value = formattedEndDate;
							loadProductChart();
							if (window.productChartInstance) {
								window.productChartInstance.destroy();
							}
						} else if (selectEl.id == 'subscriberChartDay') {
							document.getElementById('subscriberChartStartDay').value = formattedStartDate;
							document.getElementById('subscriberChartEndDay').value = formattedEndDate;
							loadSubscriberChart();
							if (window.subscriberChartInstance) {
								window.subscriberChartInstance.destroy();
							}
						} else if (selectEl.id == 'aiServiceChartDay') {
							document.getElementById('aiServiceChartStartDay').value = formattedStartDate;
							document.getElementById('aiServiceChartEndDay').value = formattedEndDate;
							loadAiServiceChart();
							if (window.aiServiceChartInstance) {
								window.aiServiceChartInstance.destroy();
							}
						}
					}
				}
			});

			hiddenInput._flatpickr.open();
			hiddenInput._flatpickr.clear();
		}
	}

	// 구독자 요약 정보 로드 (카드 1, 2번)
	async function loadSubscriberSummary() {
		try {
			const response = await axios.get('/admin/las/payment/subscriber-summary');
			const data = response.data;

			// 총 구독자 수
			document.getElementById('totalSubscribersCount').textContent = data.totalSubscribers?.toLocaleString() || '0';
			document.getElementById('totalSubscribersRate').textContent = `${data.totalSubscribersStatus === 'increase' ? '+' : data.totalSubscribersStatus === 'decrease' ? '-' : ''}${data.totalSubscribersRate || 0}%`;

			// 오늘 구독자 수
			document.getElementById('todaySubscribersCount').textContent = data.newSubscribersToday?.toLocaleString() || '0';
			document.getElementById('todaySubscribersRate').textContent = `${data.newSubscribersTodayStatus === 'increase' ? '+' : data.newSubscribersTodayStatus === 'decrease' ? '-' : ''}${data.newSubscribersTodayRate || 0}%`;

			// 상태에 따른 스타일 적용
			updateRateStyleByStatus('totalSubscribersRate', data.totalSubscribersStatus);
			updateRateStyleByStatus('todaySubscribersRate', data.newSubscribersTodayStatus);

		} catch (error) {
			console.error('구독자 요약 정보 로드 실패:', error);
			document.getElementById('totalSubscribersCount').textContent = '0';
			document.getElementById('todaySubscribersCount').textContent = '0';
			document.getElementById('totalSubscribersRate').textContent = '0%';
			document.getElementById('todaySubscribersRate').textContent = '0%';
		}
	}

	// 구독 결제 매출 차트 로드
	function loadRevenueChart() {
		const ctx = document.getElementById('revenueChartCanvas').getContext('2d');

		const dateValue = document.getElementById("revenueChartDay").value;
		const genderValue = document.getElementById("revenueChartGender").value;
		const ageGroupValue = document.getElementById("revenueChartAgeGroup").value;
		const startDateValue = document.getElementById("revenueChartStartDay").value;
		const endDateValue = document.getElementById("revenueChartEndDay").value;

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
		if (window.revenueChartInstance) {
			window.revenueChartInstance.destroy();
		}

		// --- 그라데이션 적용 시작 ---
		const gradientRevenue = ctx.createLinearGradient(0, 0, 0, 400);
		gradientRevenue.addColorStop(0, 'rgba(255, 99, 132, 0)');
		gradientRevenue.addColorStop(1, 'rgba(114, 124, 245, 0)');
		// --- 그라데이션 적용 끝 ---

		axios.get('/admin/las/payment/revenue-stats', { params })
			.then(res => {
				const responseData = res.data;

				let labels;
				let chartLabel;
				let compareLabel = ''
				if (dateValue === 'monthly') {
					labels = responseData.map(item => formatMonthlyDate(item.dt));
					chartLabel = '월별 매출';
					compareLabel = '전년 동일월';
				} else if (dateValue === 'quarterly') {
					labels = responseData.map(item => String(item.dt).replace('-Q', ' Q')); // "2025 Q1"
					chartLabel = '분기별 매출';
					compareLabel = '전년 동일 분기';
				} else {
					labels = responseData.map(item => formatDailyDate(item.dt));
					chartLabel = '일별 매출';
					compareLabel = '전월 동일일';
				}

				const dataValues = responseData.map(item => item.revenue || 0);
				const dataValuesPrev = responseData.map(item => item.revenuePrev || 0);

				window.revenueChartInstance = new Chart(ctx, {
					type: 'line',
					data: {
						labels: labels,
						datasets: [{
							label: chartLabel,
							data: dataValues,
							fill: true,
							borderColor: 'rgb(114, 124, 245)',
							backgroundColor: gradientRevenue,
							tension: 0.4,
							pointRadius: 3,
							pointHoverRadius: 6,
							pointStyle: 'circle'
						},
						{
							label: compareLabel,
							data: dataValuesPrev,
							fill: false,
							borderColor: 'rgba(255, 99, 132)',   // 비교선은 살짝 옅게
							borderDash: [4, 4],
							tension: 0.4,
							pointRadius: 0
						}
					]
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
							},
							// tooltip 설정 추가
							tooltip: {
								mode: 'index',
								intersect: false,
								callbacks: {
									label: function(context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null) {
											label += context.parsed.y.toLocaleString() + '원';
										}
										return label;
									}
								}
							}
						},
						scales: {
							x: { grid: { display: false } },
							y: {
								beginAtZero: true,
								ticks: {
									callback: value => value.toLocaleString() + '원'
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
				console.error("구독 결제 매출 데이터 조회 중 에러:", error);
			});
	}


	// 상품별 인기 통계 차트 로드
	function loadProductChart() {
		const ctx = document.getElementById('productChartCanvas').getContext('2d');

		const dateValue = document.getElementById("productChartDay").value;
		const genderValue = document.getElementById("productChartGender").value;
		const ageGroupValue = document.getElementById("productChartAgeGroup").value;
		const startDateValue = document.getElementById("productChartStartDay").value;
		const endDateValue = document.getElementById("productChartEndDay").value;

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
		if (window.productChartInstance) {
			window.productChartInstance.destroy();
		}

		ctx.canvas.style.maxHeight = '400px';

		axios.get('/admin/las/payment/product-popularity', { params })
			.then(res => {
				const responseData = res.data;

				// 상품별로 데이터 그룹화
				const products = {};
				responseData.forEach(item => {
					const productName = item.subName;
					const period = item.dt;
					const count = item.count || 0;

					if (!products[productName]) {
						products[productName] = [];
					}
					products[productName].push({
						period: period,
						count: count
					});
				});

				// 라벨 추출
				const allPeriods = [...new Set(responseData.map(item => item.dt))].sort();

				// 데이터셋 생성
				const datasets = [];
				const colors = ['#2DCF97', '#727cf5', '#FE849C', '#FF6B6B', '#9C88FF'];
				let colorIndex = 0;
				
				// 라벨 생성 직전
				let labelsRaw = allPeriods;

				// 분기 표시 보정
				if (dateValue === 'quarterly') {
				  // 백엔드가 "2025-Q1"처럼 내려주면 "2025 Q1"로 표기
				  labelsRaw = labelsRaw.map(s => String(s).replace('-Q', ' Q'));
				}

				Object.keys(products).forEach(productName => {
					const productData = allPeriods.map(period => {
						const found = products[productName].find(item => item.period === period);
						return found ? found.count : 0;
					});

					datasets.push({
						label: productName,
						data: productData,
						backgroundColor: colors[colorIndex % colors.length],
						borderRadius: 4
					});
					colorIndex++;
				});

				window.productChartInstance = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labelsRaw,
						datasets: datasets
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true,
								position: 'bottom'
							},
							title: {
								display: true,
								text: [
									chartRange
								],
							},
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
				console.error("상품별 인기 통계 데이터 조회 중 에러:", error);
			});
	}

	// 구독자 수 차트 로드
	function loadSubscriberChart() {
		const ctx = document.getElementById('subscriberChartCanvas').getContext('2d');

		const dateValue = document.getElementById("subscriberChartDay").value;
		const genderValue = document.getElementById("subscriberChartGender").value;
		const ageGroupValue = document.getElementById("subscriberChartAgeGroup").value;
		const startDateValue = document.getElementById("subscriberChartStartDay").value;
		const endDateValue = document.getElementById("subscriberChartEndDay").value;

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
		if (window.subscriberChartInstance) {
			window.subscriberChartInstance.destroy();
		}

		ctx.canvas.style.maxHeight = '600px';

		// --- 그라데이션 적용 시작 ---
		const gradientSubscriber = ctx.createLinearGradient(0, 0, 0, 600);
		gradientSubscriber.addColorStop(0, 'rgba(114, 124, 245, 0)');
		gradientSubscriber.addColorStop(1, 'rgba(45, 207, 151, 0)');
		// --- 그라데이션 적용 끝 ---

		axios.get('/admin/las/payment/subscriber-stats', { params })
			.then(res => {
				const responseData = res.data;

				let labels;
				let chartLabel;
				let compareLabel;
				if (dateValue === 'monthly') {
					labels = responseData.map(item => formatMonthlyDate(item.dt));
					chartLabel = '월별 구독자 수';
					compareLabel = '전년 동일월';
				} else if (dateValue === 'quarterly') {
					// 혹시 분기 옵션 추가할 경우 대비
					labels = responseData.map(item => String(item.dt).replace('-Q', ' Q')); // "2025 Q1" 형태일 때
					chartLabel = '분기별 구독자 수';
					compareLabel = '전년 동일 분기';
				} else {
					labels = responseData.map(item => formatDailyDate(item.dt));
					chartLabel = '일별 구독자 수';
					compareLabel = '전월 동일일';
				}

				const dataValues = responseData.map(item => item.count || 0);
				const dataValuesPrev = responseData.map(item => item.countPrev || 0);

				window.subscriberChartInstance = new Chart(ctx, {
					type: 'line',
					data: {
						labels: labels,
						datasets: [{
							label: chartLabel,
							data: dataValues,
							fill: true,
							borderColor: 'rgb(45, 207, 151)',
							backgroundColor: gradientSubscriber, // 수정된 부분
							tension: 0.4,
							pointRadius: 3,
							pointHoverRadius: 6,
							pointStyle: 'circle'
						},
						{
							label: compareLabel,
							data: dataValuesPrev,
							fill: false,
							borderColor: 'rgba(114, 124, 245)',
							borderDash: [4, 4],
							tension: 0.4,
							pointRadius: 0
						}]
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
							},
							// tooltip 설정 추가
							tooltip: {
								mode: 'index',
								intersect: false,
								callbacks: {
									label: function(context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null) {
											label += context.parsed.y.toLocaleString() + '명';
										}
										return label;
									}
								}
							}
						},
						scales: {
							x: { grid: { display: false } },
							y: {
								beginAtZero: true,
								ticks: {
									stepSize: 1,
									callback: value => value + '명'
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
				console.error("구독자 수 통계 데이터 조회 중 에러:", error);
			});
	}

	// 유료 컨텐츠 이용내역 차트 로드 (라인 차트로 변경)
	function loadAiServiceChart() {
		const ctx = document.getElementById('aiServiceChartCanvas').getContext('2d');

		const dateValue = document.getElementById("aiServiceChartDay").value;
		const genderValue = document.getElementById("aiServiceChartGender").value;
		const ageGroupValue = document.getElementById("aiServiceChartAgeGroup").value;
		const serviceTypeValue = document.getElementById("aiServiceChartType").value;
		const startDateValue = document.getElementById("aiServiceChartStartDay").value;
		const endDateValue = document.getElementById("aiServiceChartEndDay").value;

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
			serviceType: serviceTypeValue
		};

		// 기존 차트 파괴
		if (window.aiServiceChartInstance) {
			window.aiServiceChartInstance.destroy();
		}

		ctx.canvas.style.maxHeight = '400px';

		// --- 그라데이션 적용 시작 ---
		const gradientResume = ctx.createLinearGradient(0, 0, 0, 400);
		gradientResume.addColorStop(0, 'rgba(45, 207, 151, 0.1)');
		gradientResume.addColorStop(1, 'rgba(45, 207, 151, 0)');

		const gradientCover = ctx.createLinearGradient(0, 0, 0, 400);
		gradientCover.addColorStop(0, 'rgba(255, 199, 90, 0.1)');
		gradientCover.addColorStop(1, 'rgba(255, 199, 90, 0)');

		const gradientMock = ctx.createLinearGradient(0, 0, 0, 400);
		gradientMock.addColorStop(0, 'rgba(114, 124, 245, 0.1)');
		gradientMock.addColorStop(1, 'rgba(114, 124, 245, 0)');

		const gradientCounseling = ctx.createLinearGradient(0, 0, 0, 400);
		gradientCounseling.addColorStop(0, 'rgba(255, 99, 132, 0.1)');
		gradientCounseling.addColorStop(1, 'rgba(255, 99, 132, 0)');
		// --- 그라데이션 적용 끝 ---

		axios.get('/admin/las/payment/ai-service-usage', { params })
			.then(res => {
				const responseData = res.data;

				// 날짜별로 데이터 정리
				const labels = responseData.map(item => {
					if (dateValue === 'monthly') {
						return formatMonthlyDate(item.dt);
					} else if (dateValue === 'quarterly')	{
						return String(item.dt).replace('-Q', ' Q');
					} else {
						return formatDailyDate(item.dt);
					}
				});

				// 서비스 유형에 따른 데이터셋 생성
				let datasets = [];

				if (serviceTypeValue === '' || serviceTypeValue === 'resume') {
					const aiResumeData = responseData.map(item => parseInt(item.resumeCnt) || 0);
					datasets.push({
						label: '이력서 첨삭',
						data: aiResumeData,
						borderColor: 'rgb(45, 207, 151)',
						backgroundColor: gradientResume,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 6,
						pointBackgroundColor: 'rgb(45, 207, 151)',
						fill: true
					});
				}

				if (serviceTypeValue === '' || serviceTypeValue === 'cover') {
					const aiCoverData = responseData.map(item => parseInt(item.coverCnt) || 0);
					datasets.push({
						label: '자기소개서 첨삭',
						data: aiCoverData,
						borderColor: 'rgb(255, 199, 90)',
						backgroundColor: gradientCover,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 6,
						pointBackgroundColor: 'rgb(255, 199, 90)',
						fill: true
					});
				}

				if (serviceTypeValue === '' || serviceTypeValue === 'mock') {
					const aiMockData = responseData.map(item => parseInt(item.mockCnt) || 0);
					datasets.push({
						label: '모의면접',
						data: aiMockData,
						borderColor: 'rgb(114, 124, 245)',
						backgroundColor: gradientMock,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 6,
						pointBackgroundColor: 'rgb(114, 124, 245)',
						fill: true
					});
				}

				if (serviceTypeValue === '' || serviceTypeValue === 'counseling') {
					const aiCounselingData = responseData.map(item => parseInt(item.counselingCnt) || 0);
					datasets.push({
						label: 'AI 상담',
						data: aiCounselingData,
						borderColor: 'rgb(255, 99, 132)',
						backgroundColor: gradientCounseling,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 6,
						pointBackgroundColor: 'rgb(255, 99, 132)',
						fill: true
					});
				}

				// 선택된 서비스 유형에 따른 제목 설정
				let chartTitle = '유료 컨텐츠 이용내역';
				if (serviceTypeValue) {
					const serviceNames = {
						'resume': '이력서 첨삭',
						'cover': '자기소개서 첨삭',
						'mock': '모의면접',
						'counseling': 'AI 상담'
					};
					chartTitle = serviceNames[serviceTypeValue] + ' 이용내역';
				}

				window.aiServiceChartInstance = new Chart(ctx, {
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
								labels: {
									padding: 20
								}
							},
							title: {
								display: true,
								text: [
									chartRange
								],
							},
							tooltip: {
								mode: 'index',
								intersect: false,
								callbacks: {
									label: function(context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null) {
											label += context.parsed.y.toLocaleString() + '회';
										}
										return label;
									}
								}
							}
						},
						scales: {
							x: {
								grid: {
									display: false,
									drawBorder: false
								}
							},
							y: {
								beginAtZero: true,
								ticks: {
									stepSize: 10,
									callback: value => value + '회'
								},
								grid: {
									color: 'rgba(0, 0, 0, 0.05)',
									drawBorder: false
								}
							}
						}
					}
				});
			})
			.catch(error => {
				console.error("AI 서비스 이용내역 데이터 조회 중 에러:", error);
			});
	}

	// 상태에 따른 스타일 업데이트
	function updateRateStyleByStatus(elementId, status) {
		const element = document.getElementById(elementId);
		if (!element) return;

		element.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal', 'public-span-new');

		switch (status) {
			case 'increase':
				element.classList.add('public-span-increase');
				break;
			case 'decrease':
				element.classList.add('public-span-decrease');
				break;
			case 'equal':
				element.classList.add('public-span-equal');
				break;
			case 'new_entry':
				element.classList.add('public-span-new');
				break;
			default:
				element.classList.add('public-span-equal');
		}
	}

	// 초기 데이터 로드
	setDefaultDateRange(); // 기본적으로 이번주 범위 설정
	
	// 분기별 초기 설정 - 구독 결제 매출
	if (document.getElementById('revenueChartDay').value === 'quarterly') {
		const quarterlyRange = getCurrentYearRange();
		document.getElementById('revenueChartStartDay').value = quarterlyRange.start;
		document.getElementById('revenueChartEndDay').value = quarterlyRange.end;
	}

	// 분기별 초기 설정 - 구독자 수
	if (document.getElementById('subscriberChartDay').value === 'quarterly') {
		const quarterlyRange = getCurrentYearRange();
		document.getElementById('subscriberChartStartDay').value = quarterlyRange.start;
		document.getElementById('subscriberChartEndDay').value = quarterlyRange.end;
	}

	// 분기별 초기 설정 - 상품별 인기 통계
	if (document.getElementById('productChartDay').value === 'quarterly') {
		const quarterlyRange = getCurrentYearRange();
		document.getElementById('productChartStartDay').value = quarterlyRange.start;
		document.getElementById('productChartEndDay').value = quarterlyRange.end;
	}

	// 분기별 초기 설정 - 유료 콘텐츠 이용내역
	if (document.getElementById('aiServiceChartDay').value === 'quarterly') {
		const quarterlyRange = getCurrentYearRange();
		document.getElementById('aiServiceChartStartDay').value = quarterlyRange.start;
		document.getElementById('aiServiceChartEndDay').value = quarterlyRange.end;
	}
	
	loadSubscriberSummary();
	loadRevenueChart();
	loadProductChart();
	loadSubscriberChart();
	loadAiServiceChart();

	// 데이터 자동 새로고침 (5분마다)
	setInterval(() => {
		loadSubscriberSummary();
	}, 5 * 60 * 1000);
}

paymentStatistics();