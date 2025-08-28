async function naverLogin() {
    let CLIENT_ID = "";
    const CALLBACK_URL = BACK_URL + '/lgn/naverCallback.do';

    await axios.post('/lgn/naverClientKey.do')
    .then(response => {
        CLIENT_ID = response.data;
    })
    .catch(error => {
        console.error(error);
    });

    const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=STATE_STRING&redirect_uri=${CALLBACK_URL}`;
    window.location.href = naverAuthURL;
}

async function kakaoLogin() {
    let REST_API_KEY = "";
    const REDIRECT_URI = BACK_URL + '/lgn/kakaoCallback.do';

    await axios.post('/lgn/kakaoRestApiKey.do')
    .then(response => {
        REST_API_KEY = response.data;
    })
    .catch(error => {
        console.error(error);
    });

    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login`;
    console.log("kakaoAuthURL", kakaoAuthURL);
    window.location.href = kakaoAuthURL;
}

document.addEventListener("DOMContentLoaded", () => {
    checkRegist();
});

function checkRegist() {
    const registMessage = document.querySelector("#public-wrapper-main-login").dataset.registMessage;
    if (registMessage) {
        showConfirm2(registMessage, "", () => {
            // 필요시 UI 처리
        });
    }
}

function loginBtn() {
    const getUserId = document.getElementById('login-user-email').value.trim();
    const getUserPw = document.getElementById('login-user-password').value.trim();

    if (!getUserId) {
        showConfirm2("이메일을 입력해주세요.", "", () => {
            document.getElementById('login-user-email').focus();
        });
        return;
    }

    if (!getUserPw) {
        showConfirm2("비밀번호를 입력해주세요.", "", () => {
            document.getElementById('login-user-password').focus();
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(getUserId)) {
        showConfirm2("올바른 이메일 형식을 입력해주세요.", "", () => {
            document.getElementById('login-user-email').focus();
        });
        return;
    }

    fetch('/memberLogin', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            memEmail: getUserId,
            memPassword: getUserPw,
            loginType: "normal"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status == 'success') {
            const redirectUrl = sessionStorage.getItem("redirectUrl");
            if (redirectUrl) {
                sessionStorage.removeItem("redirectUrl");
                location.href = redirectUrl;
                return;
            }

            const memRole = data.memRole;
            switch (memRole) {
                case "R01001":
                    location.href = "/";
                    break;
                case "R01002":
                    location.href = "/admin";
                    break;
                case "R01003":
                    location.href = "/cns";
                    break;
                case "R01004":
                    location.href = "/cnsLeader";
                    break;
                default:
                    location.href = "/";
            }

        } else if (data.status == 'delRequest') {
            showConfirm('탈퇴 신청 계정입니다.', '탈퇴 신청을 취소하시겠습니까?', () => {
                const memId = data.memId;
                axios.post('/lgn/cancelWithdrawal.do', {
                    memId: memId
                })
                .then(response => {
                    if (response.data.result == 'success') {
                        showConfirm2(`탈퇴 신청 취소가 완료되었습니다.`, "다시 로그인 바랍니다.", () => {
                            location.reload();
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            }, () => {
            });

        } else if (data.status == 'suspend') {
            showConfirm2(`정지된 계정입니다.`, `정지 사유 : ${data.mpWarnReason} <br/> 정지 기간 : ${formatIsoDate(data.mpCompleteAt)}까지`, () => {
                // 필요시 UI 처리
            });

        } else if (data.status == 'delComplete') {
            showConfirm2(`탈퇴한 계정입니다.`, "", () => {
                // 필요시 UI 처리
            });

        } else if (data.status == 'failed') {
            showConfirm2("아이디 또는 비밀번호가 일치하지 않습니다.", "", () => {
                document.getElementById('login-user-password').focus();
            });
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
        showConfirm2("서버 연결에 실패했습니다.", "잠시 후 다시 시도해주세요.", () => {
            // 필요시 UI 처리
        });
    });
}

function formatIsoDate(isoDateString) {
    const datePart = isoDateString.split('T')[0];
    return datePart.replace(/-/g, '.') + '.';
}

const emailInput = document.getElementById('login-user-email');
const pwInput = document.getElementById('login-user-password');

emailInput.addEventListener('keydown', function(e) {
    if (e.code === 'Enter') loginBtn();
});

pwInput.addEventListener('keydown', function(e) {
    if (e.code === 'Enter') loginBtn();
});