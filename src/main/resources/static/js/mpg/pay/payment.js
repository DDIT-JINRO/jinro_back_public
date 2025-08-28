/**
 * 
 */

/*전역변수로 IMP 초기화*/
IMP = window.IMP;
IMP.init('imp55613015') //가맹점 식별코드


document.addEventListener('DOMContentLoaded', () => {
    // 컨트롤러가 전달한 사용자 정보를 JS 변수로 저장
    const userInfo = {
        email: "<c:out value='${loginUser.memEmail}' />",
        name: "<c:out value='${loginUser.memName}' />",
        tel: "<c:out value='${loginUser.memPhoneNumber}' />"
    };

    // '구독하기' 버튼 이벤트
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subInfo = {
                id: parseInt(btn.dataset.subId),
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price)
            };
            requestSubscription(subInfo, userInfo); 
        });
    });

    // '구독 취소' 링크 이벤트
    const cancelLink = document.getElementById('cancel-link');
    if (cancelLink) {
        cancelLink.addEventListener('click', (event) => {
            event.preventDefault(); // a 태그의 기본 동작(페이지 이동)을 막습니다.
            cancelSubscription(); // payment.js의 구독 취소 함수 호출
        });
    }
    
    // '구독 변경' 버튼 이벤트
    document.querySelectorAll('.change-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextSubId = btn.dataset.subId;
			showConfirm("다음 결제부터 구독 상품을 변경하시겠습니까?", "",
				() => {
					const formData = new FormData();
					formData.append('subId', nextSubId);

					fetch('/mpg/change-subscription', {
						method: 'POST',
						body: formData
					})
						.then(response => response.text())
						.then(message => {

							showConfirm2(message, "",
								() => {
									location.reload();
								}
							);
						}); 
				},
				() => {
					return;
				}
			);

        });
    });
    
    // '예약 취소' 링크에 이벤트 추가
    const cancelReservationLink = document.getElementById('cancel-reservation-link');
    if (cancelReservationLink) {
        cancelReservationLink.addEventListener('click', (event) => {
            event.preventDefault();
			showConfirm("구독 변경 예약을 취소하시겠습니까?", "",
				() => {
					fetch('/mpg/cancel-change', { method: 'POST' })
						.then(response => response.text())
						.then(message => {
							showConfirm2(message,"", 
							   () => {
									location.reload();
							    }
							);
						});
				},
				() => {
					return;
				}
			);
        });
    }
});

/**
 * 구독 신청 결제창 열기
 * @param {object} subInfo - 구독 상품 정보 {id, name, price}
 * @param {object} userInfo - 로그인 사용자 정보 {email, name, tel}
 */

function requestSubscription(subInfo, userInfo) {
	const customerUid = "userInfo.id_" + new Date().getTime();
	const merchantUid = "order_" + new Date().getTime();

	try {
		IMP.request_pay(
			{
				customer_uid: customerUid,
				channelKey: "channel-key-c07f6500-7039-49dd-8ea4-359da1f6ea77",
				pay_method: "card",
				merchant_uid: merchantUid,
				name: subInfo.name,
				amount: subInfo.price,
				buyer_email: userInfo.email,
				buyer_name: userInfo.name,
				buyer_tel: userInfo.tel,
			},
			function(rsp) {

				//callback
				if (rsp.success) {
					//결제 성공 시 , 서버로 검증요청
					fetch('/mpg/verify', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							impUid: rsp.imp_uid,	// 아임포트 결제 고유번호
							customerUid: rsp.customer_uid,	// 빌링키
							merchantUid: rsp.merchant_uid,	// 주문번호
							amount: rsp.paid_amount,	// 클리이언트가 결제한 금액
							subId: subInfo.id // 어떤 상품을 구독했는지 전송
						})
					})
						.then(response => response.json())
						.then(data => {
							if (data.status === 'success') {
								showConfirm2("결제가 성공적으로 완료되었습니다.","",
									() => {
										location.reload();
										
									}
								);
							} else {
								showConfirm2("결제를 처리하지 못했습니다.","잠시 후 다시 시도해주세요.",
									() => {
										return;
									}
								);
							}
						})
						.catch(error => {
							console.error("서버 검증 중 오류:", error);
							showConfirm2("결제를 처리하지 못했습니다.","잠시 후 다시 시도해주세요.",
								() => {
									return;
								}
							);
						});

				} else { // 실패시

					// error_code, status가 없는 경우도 있음
					const errorCode = rsp.error_code?.toUpperCase() || '';
					const status = rsp.status?.toUpperCase() || '';
					const errorMsg = rsp.error_msg || '';

					// "취소"로 볼 수 있는 모든 상황


					const rawMsg = rsp.error_msg || "";

					let userMsg = "결제를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";

					if (
						errorCode === "F1001" ||
						status === "PAY_PROCESS_CANCELED" ||
						errorMsg.includes("사용자가 결제를 취소")
					) {
						userMsg = "결제를 취소하셨습니다.";
					} else if (errorMsg.includes("INVALID_CARD_NUMBER")) {
						userMsg = "입력하신 카드 번호가 유효하지 않습니다. 다시 확인해주세요.";
					} else if (errorMsg.includes("카드사 응답이 지연")) {
						userMsg = "카드사 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.";
					} else if (errorMsg.includes("빌링키 발급 요청에 실패")) {
						userMsg = "카드 정보를 다시 확인해주세요. 오류가 반복되면 다른 카드를 사용해 주세요.";
					}

					showConfirm2(userMsg,"",
						() => {
							return;
						}
					);
				}
			},
		);
	} catch (error) {
		console.error("IMP.request_pay() 호출 중 예외 발생:", error);
		showConfirm2("결제창을 여는 도중 오류가 발생했습니다.","새로고침 후 다시 시도해주세요.", 
		   () => {
				return;
		    }
		);
	}


}
/**
 * 구독 취소 요청
 */
function cancelSubscription() {
	showConfirm("정말로 구독을 취소하시겠습니까?", "",
		() => {
			// 백엔드의 /mpg/cancel-subscription 주소로 POST 요청을 보냄
			fetch('/mpg/cancel-subscription', { method: 'POST' }) // 취소는 기존 PayController 사용
				.then(response => {
					if (response.ok) {
						return response.text();
					}
					// 서버에서 4xx, 5xx 에러 응답 시
					return Promise.reject('구독 취소에 실패했습니다. 잠시 후 다시 시도해주세요.');
				})
				.then(message => {
					showConfirm2("구독 취소 신청이 완료되었습니다!","", 
					   () => {
							location.reload(); // 성공 시 페이지 새로고침
					    }
					);
				})
				.catch(error => {
					console.Error("Error : ", error);
					showConfirm2("취소 중 에러가 발생했습니다.","", 
					   () => {
							return;
					    }
					);	
				});
		},
		() => {
			return;
		}
	);


}