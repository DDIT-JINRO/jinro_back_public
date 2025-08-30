var calendarInstance = null; // 전역 변수로 선언
var selectedDate = null;
var currentViewMonth = null;

document.getElementById('cns-logout').addEventListener('click', function() {
	location.href = '/logoutProcess';
});

	function initCalendar() {
		var calendarEl = document.getElementById('calendar');
		if (!calendarEl) {
			console.warn("캘린더 엘리먼트를 찾을 수 없습니다.");
			return;
		}

		// 이미 캘린더 인스턴스가 존재하면 중단
		if (calendarInstance) {
			return;
		}

		calendarInstance = new FullCalendar.Calendar(calendarEl, {
			locale: 'ko',
			initialView: 'dayGridMonth',

			// 헤더 툴바의 버튼 위치 조정
			headerToolbar: {
				left: 'prev', // 이전 달 버튼을 왼쪽 끝으로
				center: 'title', // 제목(날짜)을 중앙으로
				right: 'next' // '오늘' 버튼과 다음 달 버튼을 오른쪽 끝으로
			},
			height: '90%',
			events: function(fetchInfo, successCallback, failureCallback) {
			            // datesSet에서 설정된 정확한 월을 사용
			            if (!currentViewMonth) {
			                 // 초기 로딩 시 currentViewMonth가 없으면 오늘 날짜를 기준으로 설정
			                 const today = new Date();
			                 const year = today.getFullYear();
			                 const month = (today.getMonth() + 1).toString().padStart(2, '0');
			                 currentViewMonth = `${year}-${month}`;
			            }
			            axios.get('/api/cns/counseling/monthly-counts.do', {
			                params: {
			                    counselReqDatetime: currentViewMonth // 정확한 YYYY-MM 형식 전달
			                }
			            })
			            .then(response => {
			                const data = response.data;
			                const eventCounts = {};

			                data.forEach(item => {
			                    const dateStr = new Date(item.counselReqDatetime).toISOString().slice(0, 10);
			                    eventCounts[dateStr] = (eventCounts[dateStr] || 0) + 1;
			                });

			                const events = Object.keys(eventCounts).map(dateStr => {
			                    return {
			                        title: `${eventCounts[dateStr]}건`,
			                        start: dateStr,
			                        display: 'background'
			                    };
			                });

			                successCallback(events);
			            })
			            .catch(error => {
			                console.error("월별 상담 데이터 로드 실패:", error);
			                failureCallback(error);
			            });
			        },
			dateClick: function(info) {
				const prevSelected = document.querySelector('.fc-day.selected');
				if (prevSelected) {
					prevSelected.classList.remove('selected');
				}
				info.dayEl.classList.add('selected');

				let selectedDate = info.dateStr;
				document.getElementById("selectedDateText").textContent =
					`${selectedDate} 상담 리스트`;
				selectCounselingSchedules(selectedDate);
			},
			// 월이 변경될 때마다 호출되는 이벤트
			datesSet: function(info) {

				let currentDate = new Date();
				let year = currentDate.getFullYear();
				let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
				let day = currentDate.getDate().toString().padStart(2, '0');
				let todayStr = `${year}-${month}-${day}`;

				const title = info.view.title;

				   // 정규식을 사용하여 년도와 월을 추출합니다.
				   const match = title.match(/(\d+)년 (\d+)월/);
				   if (!match) {
				       console.error("캘린더 제목에서 날짜를 파싱할 수 없습니다:", title);
				       return;
				   }

				   const viewyear = match[1];
				   const viewmonth = match[2].padStart(2, '0');
				  	currentViewMonth = `${viewyear}-${viewmonth}`;

					if (calendarInstance) {
						calendarInstance.refetchEvents();
					}

				// 캘린더가 렌더링될 때, 오늘 날짜로 예약 가능 시간을 바로 불러오도록 수정
				// 선택된 날짜가 없을 경우에만 실행
				if (!selectedDate) {
					selectedDate = todayStr;

					document.getElementById('selectedDateText').textContent = selectedDate + "의 상담리스트";

					selectCounselingSchedules(selectedDate);

					// 캘린더 초기 로드 시 오늘 날짜에 시각적 효과 추가
					const todayEl = document.querySelector(`.fc-day[data-date="${todayStr}"]`);
					if (todayEl) {
						todayEl.classList.add('selected');
					}
				}
			}

		});
		calendarInstance.render();
	}

	// 상담 데이터 불러오기
	function selectCounselingSchedules(date) {
		axios.get('/api/cns/bookedScheduleList.do', {
			params: { counselReqDatetime: date }
		})
			.then(function(response) {
				let data = response.data;
				counselingData = data;
				let container = document.getElementById('bookedSchedulesContainer');
				container.innerHTML = '';

				if (!data || data.length === 0) {
					container.innerHTML = `<tr><td colspan="6" style="text-align:center;">데이터가 없습니다</td></tr>`;
					document.getElementById('schedule-count').textContent = 0;
					return;
				}

				let rows = data.map((item, idx) => `
                <tr onclick="counselDetail(${item.counselId})">
                    <td>${idx + 1}</td>
                    <td>${item.memName}</td>
                    <td>${calculateAge(new Date(item.memBirth))}</td>
                    <td>${item.memEmail}</td>
                    <td>${item.memPhoneNumber}</td>
                    <td>${item.counselStatusStr}</td>
                </tr>
            `).join('');

				container.innerHTML = rows;
				document.getElementById('schedule-count').textContent = data.length;
			})
			.catch(function(error) {
				console.error("상담 데이터 로드 실패:", error);
			});
	}
	// 비동기 로딩된 JSP에서도 바로 실행
	setTimeout(function() {
	    initCalendar();
	}, 100);

// 나이 반환
function calculateAge(birthDate) {
	// 생년월일을 '년', '월', '일'로 분리합니다.
	var birthYear = birthDate.getFullYear();
	var birthMonth = birthDate.getMonth();
	var birthDay = birthDate.getDate();

	// 현재 날짜를 가져옵니다.
	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDay = currentDate.getDate();

	// 만 나이를 계산합니다.
	var age = currentYear - birthYear;

	// 현재 월과 생일의 월을 비교합니다.
	if (currentMonth < birthMonth) {
		age--;
	}
	// 현재 월과 생일의 월이 같은 경우, 현재 일과 생일의 일을 비교합니다.
	else if (currentMonth === birthMonth && currentDay < birthDay) {
		age--;
	}
	return age;
}

function renderCounselDetail(counselData) {
	if (!counselData) {
		console.error("렌더링할 상담 데이터가 없습니다.");
		// 데이터가 없을 때 UI를 초기화하는 로직 추가
		document.getElementById('counselCategory').textContent = '';
		document.getElementById('counselMethod').textContent = '';
		document.getElementById('counselReqDate').textContent = '';
		document.getElementById('counselReqTime').textContent = '';
		document.getElementById('counselStatus').textContent = '';
		document.getElementById('counselStatusSelect').value = '';
		document.getElementById('counselDescription').value = '';
		document.getElementById('memName').textContent = '';
		document.getElementById('memAge').textContent = '';
		document.getElementById('memEmail').textContent = '';
		document.getElementById('memPhoneNumber').textContent = '';
		return;
	}

	// 상담 정보 채우기
	document.getElementById('counselCategory').textContent = counselData.counselCategoryStr || '';
	document.getElementById('counselMethod').textContent = counselData.counselMethodStr || '';
	document.querySelector('.counsel-info-summary').dataset.csId = counselData.counselId || '';

	// 날짜 및 시간 처리
	if (counselData.counselReqDatetime) {
		const datetime = new Date(counselData.counselReqDatetime);
		const dateStr = formatDateMMDD(counselData.counselReqDatetime);
		const timeStr = datetime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

		document.getElementById('counselReqDate').textContent = dateStr;
		document.getElementById('counselReqTime').textContent = timeStr;
	} else {
		document.getElementById('counselReqDate').textContent = '';
		document.getElementById('counselReqTime').textContent = '';
	}

	// 상태 정보 채우기
	document.getElementById('counselStatus').textContent = counselData.counselStatusStr || '';

	statusBtn(counselData.counselStatus, counselData.counselId, counselData.counselMethod, counselData.counselReqDatetime, counselData.counselUrlCou, counselData.memId);


	// 신청 동기 채우기
	document.getElementById('counselDescription').value = counselData.counselDescription || '';

	// 인적 사항 채우기
	document.getElementById('memName').textContent = counselData.memName || '';
	document.getElementById('memAge').textContent = calculateAge(new Date(counselData.memBirth));
	document.getElementById('memEmail').textContent = counselData.memEmail || '';
	document.getElementById('memPhoneNumber').textContent = counselData.memPhoneNumber || '';
}

function statusBtn(status, id, method, date, url ,memId) {
	const datetime = new Date(date);
	const subBtn = document.querySelector('.btn.btn-save');
	const cancelBtn = document.querySelector('.btn.btn-cancel');

	// 1. 기존 버튼을 복제하여 새로운 버튼 생성 (이전 이벤트 리스너 제거)
	const newSubBtn = subBtn.cloneNode(true);
	const newCancelBtn = cancelBtn.cloneNode(true);

	// 2. 기존 버튼을 새로운 버튼으로 교체
	subBtn.parentNode.replaceChild(newSubBtn, subBtn);
	cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

	// 3. 변수 이름을 새 버튼으로 업데이트
	const updatedSubBtn = newSubBtn;
	const updatedCancelBtn = newCancelBtn;

	if (status == 'S04001') {
		updatedSubBtn.textContent = '상담확정'
		updatedSubBtn.style.display = 'block';
		updatedSubBtn.addEventListener("click", function() {
			axios.get('/api/cns/updateCounselStatus.do', {
				params: {
					counselId: id,
					counselStatus: "S04003"
				}
			})
				.then(response => {
					document.getElementById("counselStatus").textContent = "확정";
					selectCounselingSchedules(datetime);
					statusBtn('S04003', id, method, date)
					updatedCancelBtn.style.display = 'none';
				})
		});

		updatedCancelBtn.textContent = '상담취소';
		updatedCancelBtn.style.display = 'block';
		updatedCancelBtn.addEventListener("click",async function() {
			const payVO = await axios.get('/cnslt/resve/checkSubscription',{
				params: {
					memId : memId
				}
			});

			const payId = payVO.data.payId;
			await axios.get('/api/cns/updateCounselStatus.do', {
				params: {
					counselId: id,
					counselStatus: "S04002",
					payId :payId
				}
			})
				.then(response => {
					document.getElementById("counselStatus").textContent = "취소"
					selectCounselingSchedules(datetime);
					statusBtn('S04002', id, method, date);
					updatedCancelBtn.style.display = 'none';
				});
			updatedCancelBtn.style.display = 'none';
		})
	} else if (status == 'S04002') {
		updatedSubBtn.style.display = 'none';
		updatedCancelBtn.style.display = 'none ';
	} else if (status == 'S04003') {
		updatedCancelBtn.style.display = 'none';
		updatedSubBtn.textContent = '상담개설'
		updatedSubBtn.style.display = 'block';
		updatedSubBtn.addEventListener("click", function() {
			axios.get('/api/cns/updateCounselStatus.do', {
				params: {
					counselId: id,
					counselStatus: "S04005",
					counselMethod: method
				}
			})
				.then(response => {
					if (response.data) {
						document.getElementById("counselStatus").textContent = "개설"
						selectCounselingSchedules(datetime);
						let url = response.data;
						statusBtn('S04005', id, method, date, url);
						if (method != 'G08001') {
							updatedCancelBtn.style.display = 'block';
							updatedCancelBtn.addEventListener("click", function() {
								openCounselingPopup(url);
							});
						}
					} else {
						document.getElementById("counselStatus").textContent = "개설"
						selectCounselingSchedules(datetime);
						statusBtn('S04005', id, method, date);
					}
				});
		});
	} else if (status == 'S04004') {
		updatedCancelBtn.style.display = 'none';
		updatedSubBtn.textContent = '일지작성'
		updatedSubBtn.style.display = 'block';
		updatedSubBtn.addEventListener("click", function() {
			const pageBtn = document.querySelector('a[data-page="/cns/cnsMoveController.do?target=csl/counselingLog"]');
			const counselId = document.querySelector('.counsel-info-summary').dataset.csId;
			sessionStorage.setItem('cnsIdForLog', counselId);
			pageBtn.click();
		});
	} else if (status == 'S04005') {
		if (method != 'G08001') {

			updatedCancelBtn.textContent = '상담시작'
			updatedCancelBtn.style.display = 'block';
			updatedCancelBtn.addEventListener("click", function() {
				openCounselingPopup(url);
			})
		}
		updatedSubBtn.textContent = '상담완료'
		updatedSubBtn.style.display = 'block';
		updatedSubBtn.addEventListener("click", function() {
			axios.get('/api/cns/updateCounselStatus.do', {
				params: {
					counselId: id,
					counselStatus: "S04004",
				}
			})
				.then(response => {
					document.getElementById("counselStatus").textContent = "완료"
					selectCounselingSchedules(datetime);
					statusBtn('S04004', id, method, date);
				});
		})
	}
}

// helper: ISO 문자열 → "MM.DD" 포맷
function formatDateMMDD(iso) {
	const d = new Date(iso);
	const mm = String(d.getMonth() + 1);
	const dd = String(d.getDate());
	const fullYear = String(d.getFullYear());
	return `${fullYear}. ${mm}. ${dd}.`;
}


function counselDetail(counselId) {
	// ID를 이용해 데이터 배열에서 해당 객체를 찾음
	const selectedItem = counselingData.find(item => item.counselId === counselId);
	if (selectedItem) {
		renderCounselDetail(selectedItem)
	} else {
		console.error("해당 ID의 데이터를 찾을 수 없습니다:", counselId);
		// 데이터가 없을 경우 상세 패널 초기화
		renderCounselDetail(null);
	}
}

function openCounselingPopup(url) {
	// 팝업 창의 크기와 위치를 설정합니다.
	const width = 1200;
	const height = 800;
	const left = (screen.width / 2) - (width / 2);
	const top = (screen.height / 2) - (height / 2);

	// 새 팝업 창을 엽니다.
	window.open(url, 'counselingPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}