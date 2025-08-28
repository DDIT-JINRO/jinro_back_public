let doughnutChart = null;

document.addEventListener('DOMContentLoaded', function() {

	/************************ PNG 다운로드 *******************************/
	let monthPng = document.getElementById("monthPng");
	function downloadCanvas(chart, filename, mime='image/png') {
	    const link = document.createElement('a');
	    link.href = chart.toBase64Image(mime); // Chart.js 내장
	    link.download = filename;
	    link.click();
	}

	/************************ 월별 사용자 통계 및 카드 데이터 *******************************/
	axios.get('/admin/chart/getAdminDashboard.do').then(res => {
		const chartData = res.data;

		// --- 카드 데이터 UI 업데이트 ---
		const liveUserCount = document.getElementById('liveUserCount');
		const monthUserCount = document.getElementById('monthUserCount');
		const allUserCount = document.getElementById('allUserCount');
		liveUserCount.innerHTML = formatNumberWithCommasByAdminDashboard(chartData.liveUserCount);
		monthUserCount.innerHTML = formatNumberWithCommasByAdminDashboard(chartData.monthUserCount);
		allUserCount.innerHTML = formatNumberWithCommasByAdminDashboard(chartData.allUserCount);

		const monthUserRate = document.getElementById('monthUserRate');
		const allUserRate = document.getElementById('allUserRate');
		if (chartData.monthUserCountStatus === "increase") {
			monthUserRate.innerHTML = `&#9650;&nbsp;${chartData.monthUserCountRate}%`;
			monthUserRate.classList.add('public-span-increase');
			monthUserRate.classList.remove('public-span-decrease', 'public-span-equal');
		} else if (chartData.monthUserCountStatus === "decrease") {
			monthUserRate.innerHTML = `&#9660;&nbsp;${chartData.monthUserCountRate}%`;
			monthUserRate.classList.add('public-span-decrease');
			monthUserRate.classList.remove('public-span-increase', 'public-span-equal');
		} else {
			monthUserRate.innerHTML = `${chartData.monthUserCountRate}%`;
			monthUserRate.classList.add('public-span-equal');
			monthUserRate.classList.remove('public-span-increase', 'public-span-decrease');
		}
		if (chartData.allUserCountStatus === "increase") {
			allUserRate.innerHTML = `&#9650;&nbsp;${chartData.allUserCountRate}%`;
			allUserRate.classList.add('public-span-increase');
			allUserRate.classList.remove('public-span-decrease');
		} else if (chartData.allUserCountStatus === "decrease") {
			allUserRate.innerHTML = `&#9660;&nbsp;${chartData.allUserCountRate}%`;
			allUserRate.classList.add('public-span-decrease');
			allUserRate.classList.remove('public-span-increase');
		} else {
			allUserRate.innerHTML = `${chartData.allUserCountRate}%`;
			allUserRate.classList.remove('public-span-increase', 'public-span-decrease');
		}

		// --- 월별 사용자 통계 차트 생성 ---
		const totalUsersData = chartData.monthlyChart.map(item => item.CUMULATIVE_USER_COUNT);
		const newUsersData = chartData.newUserChart.map(item => item.MONTHLY_USER_COUNT);
		const secessionUsersData = chartData.secessionChart.map(item => item.MONTHLY_DELETION_COUNT);
		const monthLabels = chartData.monthlyChart.map(item => item.MONTH + '월');
		const ctxUser = document.getElementById('lineChart');
		
		if (ctxUser) {
			 newChart = new Chart(ctxUser, {
				type: 'line',
				data: {
					labels: monthLabels,
					datasets: [{
						label: '전체 사용자수',
						data: totalUsersData,
						fill: true,
						borderColor: 'rgb(114, 124, 245)',
						tension: 0.4,
						pointBackgroundColor: 'rgb(114, 124, 245)',
						backgroundColor: function(context) {
							const { ctx, chartArea } = context.chart;
							if (!chartArea) { return null; }
							const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
							gradient.addColorStop(0, 'rgba(114, 124, 245, 0.5)');
							gradient.addColorStop(1, 'rgba(114, 124, 245, 0)');
							return gradient;
						}
					}, {
						label: '신규 유입',
						data: newUsersData,
						fill: true,
						borderColor: 'rgb(0, 200, 150)',
						backgroundColor: 'rgba(0, 200, 150, 0.2)',
						tension: 0.4,
						pointBackgroundColor: 'rgb(0, 200, 150)'
					}, {
						label: '이탈자',
						data: secessionUsersData,
						fill: true,
						borderColor: 'rgb(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						tension: 0.4,
						pointBackgroundColor: 'rgb(255, 99, 132)'
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: { display: false },
						legend: { display: true, position: 'bottom', labels: { padding: 20 } },
						tooltip: {
							mode: 'index',
							intersect: false,
							callbacks: {
								label: function(context) {
									let label = context.dataset.label || '';
									if (label) { label += ': '; }
									if (context.parsed.y !== null) {
										label += context.parsed.y.toLocaleString() + '명';
									}
									return label;
								}
							}
						}
					},
					scales: {
						y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false } },
						x: { grid: { display: false, drawBorder: false } }
					}
				}
			});
		}
	});
	document.getElementById('monthPng').onclick = () =>{
	    downloadCanvas(newChart, '월별이용자통계.png', 'image/png');
	}
	/********************* 결제/구독 통계 *******************************/
	axios.get('/admin/las/payment/monthly-users').then(res => {
		const responseData = res.data;
		const labels = responseData.map(item => item.month + '월');
		const totalUsersData = responseData.map(item => item.totalUsers);
		const subscriberData = responseData.map(item => item.subscribers);
		const ctxPayment = document.getElementById('revenueChart')?.getContext('2d');
		if (ctxPayment) {
			newMoneyChart= new Chart(ctxPayment, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: '전체 사용자수',
						data: totalUsersData,
						borderColor: '#8e6ee4',
						backgroundColor: 'rgba(142, 110, 228, 0.2)',
						fill: true,
						tension: 0.4
					}, {

						label: '구독자 수',
						data: subscriberData,
						borderColor: '#00e396',
						backgroundColor: 'rgba(0, 227, 150, 0.2)',
						fill: true,
						tension: 0.4
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: { display: false },
						legend: { position: 'top' },
						tooltip: {
							mode: 'index',
							intersect: false,
							callbacks: {
								label: function(context) {
									let label = context.dataset.label || '';
									if (label) { label += ': '; }
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
						y: { beginAtZero: true }
					}
				}
			});
		}
	});
	document.getElementById('moneyPng').onclick = () =>{
	    downloadCanvas(newMoneyChart, '결제/구독 통계.png', 'image/png');
	}
	/********************* 컨텐츠 이용 통계 (도넛) *******************************/
	const youthBtn = document.getElementById('youthBtn');
	const teenBtn = document.getElementById('teenBtn');
	const ctxDoughnut = document.getElementById('nestedDoughnutChart');
	
	function updateDoughnutChart(param) {
		if (!ctxDoughnut) return;
		if (doughnutChart) {
			doughnutChart.destroy();
		}

		axios.get(`/admin/chart/getContentsUseChart.do?param=${param}`).then(res => {
			const contentData = res.data;
			const doughnutLabels = contentData.map(item => item.title);
			const doughnutDataValues = contentData.map(item => item.cnt);
			const purplePalette = [
				'rgba(153, 102, 255, 0.8)',
				'rgba(75, 192, 192, 0.8)',
				'rgba(255, 205, 86, 0.8)',
				'rgba(54, 162, 235, 0.8)',
				'rgba(255, 99, 132, 0.8)',
			];

			doughnutChart = new Chart(ctxDoughnut, {
				type: 'doughnut',
				data: {
					labels: doughnutLabels,
					datasets: [{
						label: '컨텐츠 이용 현황',
						data: doughnutDataValues,
						backgroundColor: purplePalette.slice(0, doughnutDataValues.length),
						borderWidth: 0,
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
						legend: {
							display: true,
							position: 'bottom',
							labels: { color: '#555', padding: 25, font: { size: 14 } }
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
					}
				}
			});
		});
	}

	axios.get('/admin/las/payment/revenue-summary').then(res => {
		const avgPreviousRevenue = res.data.avgPreviousRevenue;
		const estimatedCurrentRevenue = res.data.estimatedCurrentRevenue;
		const spanAvgPreviousRevenue = document.getElementById('avgPreviousRevenue');
		const spanEstimatedCurrentRevenue = document.getElementById('estimatedCurrentRevenue');

		spanAvgPreviousRevenue.textContent = `${formatNumberWithCommasByAdminDashboard(avgPreviousRevenue)}원`;

		const valueWrapper = spanEstimatedCurrentRevenue.parentElement;

		const existingArrow = valueWrapper.querySelector('.arrow');
		if (existingArrow) {
			existingArrow.remove();
		}

		spanEstimatedCurrentRevenue.textContent = `${formatNumberWithCommasByAdminDashboard(estimatedCurrentRevenue)}원`;

		if (estimatedCurrentRevenue > avgPreviousRevenue) {
			const arrowSpan = document.createElement('span');
			arrowSpan.className = 'arrow increase';
			arrowSpan.innerHTML = '&#9650;'; // 상승 화살표
			// --- 수정: 숫자(span) 뒤에 화살표를 추가합니다. ---
			valueWrapper.appendChild(arrowSpan);

		} else if (estimatedCurrentRevenue < avgPreviousRevenue) {
			const arrowSpan = document.createElement('span');
			arrowSpan.className = 'arrow decrease';
			arrowSpan.innerHTML = '&#9660;'; // 하락 화살표
			// --- 수정: 숫자(span) 뒤에 화살표를 추가합니다. ---
			valueWrapper.appendChild(arrowSpan);
		}
	});


	updateDoughnutChart('teen');
	setActiveButton(teenBtn);


	youthBtn.addEventListener('click', function() {
		updateDoughnutChart('youth');
		setActiveButton(this);
	});

	teenBtn.addEventListener('click', function() {
		updateDoughnutChart('teen');
		setActiveButton(this);
	});

	document.getElementById('contentBtn').onclick = () => {
	    if (doughnutChart) {
	        downloadCanvas(doughnutChart, '컨텐츠 이용 통계.png', 'image/png');
	    }
	}
	

});

// 공통 함수
function formatNumberWithCommasByAdminDashboard(num) {
	if (isNaN(num)) { return "유효하지 않은 숫자입니다."; }
	return num.toLocaleString();
}

function setActiveButton(activeBtn) {
	const buttons = activeBtn.parentElement.querySelectorAll('.public-toggle-button');
	buttons.forEach(btn => btn.classList.remove('active'));
	activeBtn.classList.add('active');
}

function updateLocalTime() {
	// 새로운 Date 객체를 생성하여 현재 시간을 가져옴
	const now = new Date();

	// 시간을 'HH:mm:ss' 형식으로 포맷팅
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	const timeString = `Current time ${hours}:${minutes}:${seconds}`;

	// HTML 요소에 시간 업데이트
	const timeSection = document.getElementById('localTimeDisplay')
	if (timeSection) {
		timeSection.textContent = timeString;
	}
}

function animateNumberChange(elementId, newValue) {
	const element = document.getElementById(elementId);
	if (!element) return;

	const currentValue = element.textContent.replace(/[^0-9.]/g, ''); // 숫자만 추출
	if (currentValue !== String(newValue)) {
		// 클래스를 토글하여 애니메이션 효과 적용
		element.classList.add('number-change');
		setTimeout(() => {
			element.textContent = newValue;
			element.classList.remove('number-change');
		}, 300); // CSS transition 시간과 일치
	}
}

function getRateStatus(status) {
	let symbol = '';
	let className = '';
	switch (status) {
		case 'increase':
			symbol = '▲';
			className = 'public-span-increase';
			break;
		case 'decrease':
			symbol = '▼';
			className = 'public-span-decrease';
			break;
		case 'equal':
			symbol = '-';
			className = 'public-span-equal';
			break;
		default:
			symbol = '';
			className = '';
	}
	return { symbol, className };
}

function showConfirm(message1, message2, onOk, onCancel) {
    const confirmBox = document.getElementById("customConfirm");
    const confirmMessage1 = document.getElementById("confirmMessage1");
    const confirmMessage2 = document.getElementById("confirmMessage2");
    confirmMessage1.innerHTML = message1; // 메시지 표시
    confirmMessage2.innerHTML = message2; // 메시지 표시
    confirmBox.style.display = "flex";

	const okBtn = document.getElementById("confirmOk");
    const cancelBtn = document.getElementById("confirmCancel");

    okBtn.onclick = () => {
        confirmBox.style.display = "none";
        if (onOk) onOk();
    };

    cancelBtn.onclick = () => {
        confirmBox.style.display = "none";
        if (onCancel) onCancel();
    };
}

function showConfirm2(message1, message2, onOk) {
    const confirmBox = document.getElementById("customConfirm2");
    const confirmMessage1 = document.getElementById("confirmMessage3");
    const confirmMessage2 = document.getElementById("confirmMessage4");
    confirmMessage1.innerHTML = message1; // 메시지 표시
    confirmMessage2.innerHTML = message2; // 메시지 표시
    confirmBox.style.display = "flex";

    const okBtn = document.getElementById("confirmOk2");
	
    okBtn.onclick = () => {
        confirmBox.style.display = "none";
        if (onOk) onOk();
    };
}

document.getElementById('admin-logout').addEventListener('click', function() {
	location.href = '/logoutProcess';
});

// 1초(1000밀리초)마다 updateLocalTime 함수를 실행하여 시간을 갱신
setInterval(updateLocalTime, 1000);

// 페이지 로드 시 즉시 한 번 실행
updateLocalTime();