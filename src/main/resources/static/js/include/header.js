function showConfirm(message1, message2, onOk, onCancel) {
	const confirmBox = document.getElementById("customConfirm");
	const confirmMessage1 = document.getElementById("confirmMessage1");
	const confirmMessage2 = document.getElementById("confirmMessage2");
	const overlay = document.querySelector('.custom-confirm-overlay');
	confirmMessage1.textContent = message1; // 메시지 표시
	confirmMessage2.textContent = message2; // 메시지 표시
	confirmBox.style.display = "flex";
	overlay.style.display = "block"

	const okBtn = document.getElementById("confirmOk");
	const cancelBtn = document.getElementById("confirmCancel");

	okBtn.focus();

	okBtn.onclick = () => {
		confirmBox.style.display = "none";
		overlay.style.display = "none"
		if (onOk) onOk();
	};

	cancelBtn.onclick = () => {
		confirmBox.style.display = "none";
		overlay.style.display = "none"
		if (onCancel) onCancel();
	};
}

function showConfirm2(message1, message2, onOk) {
	const confirmBox = document.getElementById("customConfirm2");
	const confirmMessage1 = document.getElementById("confirmMessage3");
	const confirmMessage2 = document.getElementById("confirmMessage4");
	const overlay = document.querySelector('.custom-confirm-overlay');
	confirmMessage1.innerHTML = message1; // 메시지 표시
	confirmMessage2.innerHTML = message2; // 메시지 표시
	confirmBox.style.display = "flex";
	overlay.style.display = "block"

	const okBtn = document.getElementById("confirmOk2");
	okBtn.focus();

	okBtn.onclick = () => {
		confirmBox.style.display = "none";
		overlay.style.display = "none"
		if (onOk) onOk();
	};
}


function header() {
	// --- 모바일 슬라이드 메뉴 로직 ---
	const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
	const mobileNavPanel = document.getElementById('mobileNavPanel');
	const mobileNavClose = document.getElementById('mobileNavClose');
	const overlay = document.getElementById('overlay');

	function openMobileMenu() {
		if (mobileNavPanel) mobileNavPanel.classList.add('is-active');
		if (overlay) overlay.classList.add('is-active');
	}

	function closeMobileMenu() {
		if (mobileNavPanel) mobileNavPanel.classList.remove('is-active');
		if (overlay) overlay.classList.remove('is-active');
	}

	if (mobileMenuTrigger && mobileNavPanel && mobileNavClose && overlay) {
		mobileMenuTrigger.addEventListener('click', openMobileMenu);
		mobileNavClose.addEventListener('click', closeMobileMenu);
		overlay.addEventListener('click', closeMobileMenu);
	}

	// --- 데스크톱 메가 메뉴 로직 ---
	const menuIcon = document.getElementById("megaMenuToggle");
	const dropdown = document.getElementById("megaMenu");

	if (menuIcon && dropdown) {
		menuIcon.addEventListener("click", () => {
			dropdown.classList.toggle("mega-menu--hidden");
		});

		document.addEventListener("click", (event) => {
			if (!dropdown.contains(event.target) && !menuIcon.contains(event.target)) {
				dropdown.classList.add("mega-menu--hidden");
			}
		});
	}
	// 경력관리 로직
	const careerButtons = [
	    "goTologin1",
	    "goTologin2",
	    "goTologin3",
	    "goTologin4",
	    "goTologin5",
	    "goTologin6",
	    "goTologin7",
	    "goTologin8",
	    "goTologin9",
	    "goTologin10",
	    "goTologin11",
	    "goTologin12"
	];

	careerButtons.forEach(id => {
	    const btn = document.getElementById(id);
	    if (!btn) return;

	    btn.addEventListener("click", (e) => {
	        if (!memId || memId === 'anonymousUser') {
	            e.preventDefault(); // 기본 이동 막기
	            showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
	                () => {
	                    // 확인 클릭 시 컨트롤러 이동
	                    location.href = btn.getAttribute('href');
	                },
	                () => {
	                    // 취소 클릭 시 아무 동작 없음
	                }
	            );
	        }
	    });
	});


	// --- 사이드바 버튼 로직 ---
	const worldcup = document.getElementById("worldcup");
	const roadmap = document.getElementById("roadmap");

	if (roadmap) {
		roadmap.addEventListener("click", () => {
			if (!memId || memId == 'anonymousUser') {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					() => {

					}
				);
			} else {
				const roadmapUrl = FRONT_URL + '/roadmap';
				const width = 1084;
				const height = 736;
				const screenWidth = window.screen.width;
				const screenHeight = window.screen.height;
				const left = Math.floor((screenWidth - width) / 2);
				const top = Math.floor((screenHeight - height) / 2);
				axios.post("/admin/las/roadMapVisitLog.do");
				window.open(roadmapUrl, 'Roadmap', `width=${width}, height=${height}, left=${left}, top=${top}`);
			}
		});
	}

	window.addEventListener("message", (event) => {
		if (event.origin !== FRONT_URL) {
			return;
		}
		const messageData = event.data;
		if (messageData && messageData.type === 'navigateParent') {
			const targetUrl = messageData.url;
			if (targetUrl) {
				window.location.href = targetUrl;
			} else {
				console.error('메시지에 이동할 URL이 없습니다.');
			}
		}
	});

	if (worldcup) {
		worldcup.addEventListener("click", () => {
			if (!memId || memId == 'anonymousUser') {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					() => {

					}
				);
			} else {
				axios.post("/admin/las/worldCupVisitLog.do")
				const worldcupUrl = FRONT_URL + '/worldcup';
				const width = 1200;
				const height = 800;
				const screenWidth = window.screen.width;
				const screenHeight = window.screen.height;
				const left = Math.floor((screenWidth - width) / 2);
				const top = Math.floor((screenHeight - height) / 2);
				window.open(worldcupUrl, 'worldcup', `width=${width}, height=${height}, left=${left}, top=${top}`);
			}
		});
	}
}

