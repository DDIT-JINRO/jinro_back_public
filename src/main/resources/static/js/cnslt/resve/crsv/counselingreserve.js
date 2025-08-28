// 전역 변수 (함수에서 공통으로 사용하는 변수)
let calendar;
let selectedDate = null;
let selectedTime = null;
let selectedCounselorId; // 이 변수에는 DOM 로드 후 값이 할당될 것입니다.


document.addEventListener('DOMContentLoaded', function() {
	// 이 안의 코드는 HTML 문서가 완전히 로드된 후에 실행됩니다.

	const btn = document.getElementById('goToCounselingReserveHistory');
	if (btn) {
	    btn.addEventListener("click", (e) => {
	        if (!memId || memId === 'anonymousUser') {
	            e.preventDefault(); // 기본 이동 막기
	            showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
	                () => {
	                    // 확인 클릭 시 컨트롤러 이동
						sessionStorage.setItem("redirectUrl", location.href);
	                    location.href = btn.getAttribute('href');
	                },
	                () => {
	                    // 취소 클릭 시 아무 동작 없음
	                }
	            );
	        }
	    });
	}
	
	
	
	// 1. HTML 요소에 접근해서 변수에 할당
	let counselorSelect = document.getElementById('counselorSelect');
	selectedCounselorId = counselorSelect.value;
	const selectedOption = counselorSelect.options[counselorSelect.selectedIndex];
	const counselorName = selectedOption.text;

	var calendarEl = document.getElementById('calendar');
	calendar = new FullCalendar.Calendar(calendarEl, {
		locale: 'ko',
		initialView: 'dayGridMonth',

		// 헤더 툴바의 버튼 위치 조정
		headerToolbar: {
			left: 'prev', // 이전 달 버튼을 왼쪽 끝으로
			center: 'title', // 제목(날짜)을 중앙으로
			right: 'next' // '오늘' 버튼과 다음 달 버튼을 오른쪽 끝으로
		},

		validRange: {
			start: new Date()
		},

		// 날짜를 클릭했을 때 호출되는 이벤트
		dateClick: function(info) {
			// 이전에 선택된 날짜의 시각적 효과 제거
			const prevSelected = document.querySelector('.fc-day.selected');
			if (prevSelected) {
				prevSelected.classList.remove('selected');
			}
			// 현재 클릭한 날짜에 시각적 효과 추가
			info.dayEl.classList.add('selected');

			selectedDate = info.dateStr;
			document.getElementById('selectedDateText').textContent = selectedDate + "의 예약 가능한 시간";
			fetchAvailableTimes(selectedCounselorId, selectedDate, memId);
		},

		// 월이 변경될 때마다 호출되는 이벤트
		datesSet: function(info) {
			let currentDate = new Date();
			let year = currentDate.getFullYear();
			let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
			let day = currentDate.getDate().toString().padStart(2, '0');

			let todayStr = `${year}-${month}-${day}`;

			// 캘린더가 렌더링될 때, 오늘 날짜로 예약 가능 시간을 바로 불러오도록 수정
			// 선택된 날짜가 없을 경우에만 실행
			if (!selectedDate) {
				selectedDate = todayStr;
				if (memId == null || memId == 'anonymousUser') {
					document.getElementById('selectedDateText').textContent = "로그인 시 예약시간을 확인할 수 있습니다.";
				} else {
					document.getElementById('selectedDateText').textContent = selectedDate + "의 예약 가능한 시간";
				}
				fetchAvailableTimes(selectedCounselorId, selectedDate, memId);

				// 캘린더 초기 로드 시 오늘 날짜에 시각적 효과 추가
				const todayEl = document.querySelector(`.fc-day[data-date="${todayStr}"]`);
				if (todayEl) {
					todayEl.classList.add('selected');
				}
			}
		}
	});
	calendar.render();

	// 2. HTML 요소에 이벤트 리스너 추가
	counselorSelect.addEventListener('change', function() {
		selectedCounselorId = this.value;

		fetchAvailableTimes(selectedCounselorId,selectedDate,memId)
	});

	// 이 코드를 DOMContentLoaded 안으로 옮겼습니다.
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

		// 클릭 이벤트도 로그인 페이지로 이동하도록 변경합니다.
		nextBtn.addEventListener('click', function(event) {
			event.preventDefault();
			showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
				() => {
					sessionStorage.setItem("redirectUrl", location.href);
					location.href = "/login";
				},
				() => {

				}
			);
		});
	} else {

		nextBtn.addEventListener('click', function(event) {
			event.preventDefault(); // 기본 폼 제출 동작을 막음


			const counsel = document.getElementById('counselorSelect').value;

			if (!memId || memId === 'anonymousUser') {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					
					() => {

					}
				);
				return;
			}

			if (!selectedTime) {

				showConfirm2('모든 필수 정보를 선택해주세요.',"",
					() => {
						return;
					}
				);
			}

			if (selectedDate && selectedTime) {
				const selectedOption = counselorSelect.options[counselorSelect.selectedIndex];
				const counselorName = selectedOption.text;
				showConfirm("상담사: " + counselorName,"날짜: " + selectedDate +" " + selectedTime,
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
									// 남은 횟수가 1 이상이면 폼 제출
									const date = selectedDate;
									const time = selectedTime;
									const combinedDateTime = `${date} ${time}`;
									document.getElementById('counselReqDatetimeInput').value = combinedDateTime;
									document.getElementById('payId').value = payId;
									document.getElementById('reservationForm').submit();
								} else {
									// 남은 횟수가 없으면 결제 페이지로 이동 안내
									showConfirm2('이용 가능한 상담 횟수가 없습니다.',"구독 상품을 구매해주세요.",
										() => {
											window.location.href = '/mpg/pay/selectPaymentView.do';
										}
									);
								}
							})
							.catch(error => {
								console.error('구독 정보 확인 중 오류 발생:', error.message);
								showConfirm2('구독 정보를 불러오는 중 오류가 발생했습니다.',"",
									() => {
										return; 
									}
								);
							});
					},
					() => {
						
					}
				);
			} else {
				showConfirm2("날짜와 시간을 선택해주세요.","",
					() => {
						return;
					}
				);
			}
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
				showConfirm2('예약 정보를 불러올 수 없습니다.',"다시 시도해 주세요.",
					() => {
						return; 
					}
				);
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
