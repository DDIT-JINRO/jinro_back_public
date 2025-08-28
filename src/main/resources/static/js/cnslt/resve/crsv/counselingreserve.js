// 전역 변수
let calendar;
let selectedDate = null;
let selectedTime = null;
let selectedCounselorId;

document.addEventListener('DOMContentLoaded', function() {
	const btn = document.getElementById('goToCounselingReserveHistory');
	if (btn) {
	    btn.addEventListener("click", (e) => {
	        if (!memId || memId === 'anonymousUser') {
	            e.preventDefault();
	            showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
	                () => {
						sessionStorage.setItem("redirectUrl", location.href);
	                    location.href = btn.getAttribute('href');
	                },
	                () => {
	                    // 취소 시 아무것도 하지 않음
	                }
	            );
	        }
	    });
	}
	
	// HTML 요소에 접근해서 변수에 할당
	let counselorSelect = document.getElementById('counselorSelect');
	selectedCounselorId = counselorSelect.value;
	const selectedOption = counselorSelect.options[counselorSelect.selectedIndex];
	const counselorName = selectedOption.text;

	var calendarEl = document.getElementById('calendar');
	calendar = new FullCalendar.Calendar(calendarEl, {
		locale: 'ko',
		initialView: 'dayGridMonth',

		headerToolbar: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},

		validRange: {
			start: new Date()
		},

		dateClick: function(info) {
			const prevSelected = document.querySelector('.fc-day.selected');
			if (prevSelected) {
				prevSelected.classList.remove('selected');
			}
			info.dayEl.classList.add('selected');

			selectedDate = info.dateStr;
			document.getElementById('selectedDateText').textContent = selectedDate + "의 예약 가능한 시간";
			fetchAvailableTimes(selectedCounselorId, selectedDate, memId);
		},

		datesSet: function(info) {
			let currentDate = new Date();
			let year = currentDate.getFullYear();
			let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
			let day = currentDate.getDate().toString().padStart(2, '0');

			let todayStr = `${year}-${month}-${day}`;

			if (!selectedDate) {
				selectedDate = todayStr;
				if (memId == null || memId == 'anonymousUser') {
					document.getElementById('selectedDateText').textContent = "로그인 시 예약시간을 확인할 수 있습니다.";
				} else {
					document.getElementById('selectedDateText').textContent = selectedDate + "의 예약 가능한 시간";
				}
				fetchAvailableTimes(selectedCounselorId, selectedDate, memId);

				const todayEl = document.querySelector(`.fc-day[data-date="${todayStr}"]`);
				if (todayEl) {
					todayEl.classList.add('selected');
				}
			}
		}
	});
	calendar.render();

	counselorSelect.addEventListener('change', function() {
		selectedCounselorId = this.value;
		fetchAvailableTimes(selectedCounselorId, selectedDate, memId);
	});

	document.getElementById('timeSlotButtons').addEventListener('click', function(event) {
		if (event.target && event.target.matches('.time-slot-btn.available')) {
			document.querySelectorAll('.time-slot-btn.available.selected').forEach(btn => {
				btn.classList.remove('selected');
			});
			event.target.classList.add('selected');
			selectedTime = event.target.dataset.time;
		}
	});

	const nextBtn = document.getElementById('nextBtn');
	if (memId === 'null' || memId === 'anonymousUser') {
		nextBtn.id = 'loginBtn';
		nextBtn.textContent = '로그인 하러가기';

		nextBtn.addEventListener('click', function(event) {
			event.preventDefault();
			showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
				() => {
					sessionStorage.setItem("redirectUrl", location.href);
					location.href = "/login";
				},
				() => {
					// 취소 시 아무것도 하지 않음
				}
			);
		});
	} else {
		nextBtn.addEventListener('click', function(event) {
			event.preventDefault();

			if (!memId || memId === 'anonymousUser') {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					() => {
						// 취소 시 아무것도 하지 않음
					}
				);
				return;
			}

			if (!selectedDate) {
				showConfirm2('날짜를 선택해주세요.', "", () => {
					// 필요시 UI 처리
				});
				return;
			}

			if (!selectedTime) {
				showConfirm2('시간을 선택해주세요.', "", () => {
					// 필요시 UI 처리
				});
				return;
			}

			// 모든 validation 통과 시에만 예약 프로세스 진행
			const selectedOption = counselorSelect.options[counselorSelect.selectedIndex];
			const counselorName = selectedOption.text;
			
			showConfirm("상담사: " + counselorName, "날짜: " + selectedDate + " " + selectedTime,
				() => {
					axios.get('/cnslt/resve/checkSubscription', {
						params: {
							memId: memId
						}
					})
					.then(response => {
						const payConsultCnt = response.data.payConsultCnt;
						const payId = response.data.payId;
						if (payConsultCnt > 0) {
							const date = selectedDate;
							const time = selectedTime;
							const combinedDateTime = `${date} ${time}`;
							document.getElementById('counselReqDatetimeInput').value = combinedDateTime;
							document.getElementById('payId').value = payId;
							document.getElementById('reservationForm').submit();
						} else {
							showConfirm2('이용 가능한 상담 횟수가 없습니다.', "구독 상품을 구매해주세요.", () => {
								window.location.href = '/mpg/pay/selectPaymentView.do';
							});
						}
					})
					.catch(error => {
						console.error('구독 정보 확인 중 오류 발생:', error.message);
						showConfirm2('구독 정보를 불러오는 중 오류가 발생했습니다.', "", () => {
							// 필요시 UI 처리
						});
					});
				},
				() => {
					// 취소 시 아무것도 하지 않음
				}
			);
		});
	}
});

// 백엔드 API를 호출하여 예약 가능 시간 목록을 가져오는 함수
function fetchAvailableTimes(counselId, date, memId) {
	if (memId != null && memId != 'anonymousUser') {
		axios.get('/cnslt/resve/availableTimes', {
			params: {
				counsel: counselId,
				counselReqDatetime: date,
				memId: memId
			}
		})
		.then(function(response) {
			renderTimeSlots(response.data);
		})
		.catch(function(error) {
			console.error("예약 가능 시간을 불러오는 데 실패했습니다.", error);
			showConfirm2('예약 정보를 불러올 수 없습니다.', "다시 시도해 주세요.", () => {
				// 필요시 UI 처리
			});
		});
	}
}

// 예약 가능한 시간 슬롯을 화면에 그리는 함수
function renderTimeSlots(availableTimes) {
	let timeSlotButtonsHtml = '';
	const timeSlotButtonsContainer = document.getElementById('timeSlotButtons');
	timeSlotButtonsContainer.innerHTML = '';

	if (availableTimes.length > 0) {
		availableTimes.forEach(function(time) {
			const button = document.createElement('button');
			button.className = 'time-slot-btn available';
			button.type = 'button';
			button.dataset.time = time;
			button.textContent = time;
			timeSlotButtonsContainer.appendChild(button);
		});
	} else {
		timeSlotButtonsContainer.innerHTML = '<div>예약 가능한 시간이 없습니다.</div>';
	}
}