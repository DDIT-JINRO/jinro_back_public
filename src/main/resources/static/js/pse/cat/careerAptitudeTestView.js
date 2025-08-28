/**
 *
 */
const cardData = {
	student: [{
		title: "직업 흥미 검사(K)",
		desc: "다양한 직업에서 이루어지는 활동들에 대해 얼마나 흥미를 느끼고 있는가를 알아봄으로써, 장래에 자신에게 알맞은<br/>직업군을 탐색하는 데 도움을 주기 위한 것입니다.",
		time: "15~20분",
		img: "/images/main/readingGlasses.png",
		type: "1"
	}, {
		title: "직업 흥미 검사(H)",
		desc: "나의 흥미유형 및 세부 직업과 관련하여 어떤 흥미를<br/> 가지고 있는지 알아볼 수 있습니다.",
		time: "15~20분",
		img: "/images/main/readingGlasses.png",
		type: "2"
	}, {
		title: "직업 가치관 검사",
		desc: "직업과 관련된 다양한 가치 중, 어떤 가치를 중요하게<br/> 여기는지 알아볼 수 있습니다.",
		time: "15~20분",
		img: "/images/main/readingGlasses.png",
		type: "3"
	}, {
		title: "직업 적성 검사",
		desc: "직업과 관련된 다양한 능력을 어느정도로 갖추고 있는지<br/> 알아볼 수 있습니다.",
		time: "중학생 20분, 고등학생 30분",
		img: "/images/main/readingGlasses.png",
		type: "4"
	}],
	adult: [{
		title: "직업 가치관 검사",
		desc: "직업과 관련된 다양한 가치 중, 어떤 가치를 중요하게<br/> 여기는지 알아볼 수 있습니다.",
		time: "20분",
		img: "/images/main/readingGlasses.png",
		type: "5"
	}, {
		title: "진로 개발 준비도 검사",
		desc: "진로목표 달성을 위해 필요한 사항들에 대한 준비 정도를 알아볼 수 있습니다.",
		time: "25분~30분",
		img: "/images/main/readingGlasses.png",
		type: "6"
	}, {
		title: "이공계 전공 적합도 검사",
		desc: "이공계 대학생이 전공을 선택하고자 할 때, 전공교과별 자신과 관련 직업에 대한 흥미를 기초로 전공군별 상대적인 적합도를 평가해 볼 수 있도록 도와주는 검사입니다.",
		time: "10분",
		img: "/images/main/readingGlasses.png",
		type: "7"
	}, {
		title: "주요 능력 효능감 검사",
		desc: "특정 능력에 대한 자신감을 측정하는 심리 검사입니다.<br/> 이 검사는 대학생 및 일반인들이 자신의 능력에 대한<br/> 믿음을 파악하고, 직업 적합성을 판단하는 데<br/> 도움을 줄 수 있습니다.",
		time: "10분",
		img: "/images/main/readingGlasses.png",
		type: "8"
	}]
};

// ⭐ 수정: BEM 클래스명으로 선택자 변경
const tabs = document.querySelectorAll(".test-intro__tab");
const cardGrid = document.getElementById("cardGrid");

// 카드 목록을 화면에 렌더링하는 함수
function renderCards(type) {
	cardGrid.innerHTML = "";
	const cards = cardData[type];
	cards.forEach(card => {
		const buttonHTML = window.isLoggedIn
			? `<button class="test-card__button" onclick="startTest(${card.type}, '${card.title}')">검사 시작</button>`
			: `<button class="test-card__button" onclick="logReq()">검사 시작</button>`;

		// ⭐ 수정: 카드 HTML 내부 클래스명을 모두 BEM 방식으로 변경
		const cardHTML = `
		    <div class="test-card">
		      <div class="test-card__icon"><img alt="" src="${card.img}"></div>
		      <h3 class="test-card__title">${card.title}</h3>
		      <p class="test-card__description">${card.desc}</p>
		      <span class="test-card__meta">평균 소요시간 : ${card.time}</span>
		      ${buttonHTML}
		    </div>
		  `;
		cardGrid.insertAdjacentHTML("beforeend", cardHTML);
	});
}

// 탭 클릭 이벤트를 설정하는 함수
function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // 모든 탭에서 active 클래스 제거
            tabs.forEach(t => t.classList.remove("test-intro__tab--active"));
            // 클릭된 탭에만 active 클래스 추가
            tab.classList.add("test-intro__tab--active");

            // 데이터 타입에 맞는 카드 렌더링
            const type = tab.dataset.type;
            renderCards(type);
        });
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderCards("student"); // 기본으로 학생용 카드 표시
    setupTabs(); // 탭 이벤트 리스너 설정
});


// 검사 시작 함수 (로그인 시)
function startTest(type, title) {

	axios.post("/admin/las/careerAptitudeTest.do", {
		type: type,
		title: title,
	})
		.then(response => {

			const width = 1000;
			const height = 800;
			const left = window.screenX + (window.outerWidth - width) / 2;
			const top = window.screenY + (window.outerHeight - height) / 2;
			window.open(`${FRONT_URL}/aptiTest/${type}`, title, `width=${width},height=${height},left=${left},top=${top},resizable=no`);
		})
		.catch(error => {
			console.error("요청 실패:", error);
			showConfirm2("검사 시작에 실패했습니다.","", 
			   () => {
			    }
			);
		});
}

// 로그인 필요 알림 함수 (비로그인 시)
function logReq() {
	showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
		() => {
			sessionStorage.setItem("redirectUrl", location.href);
			location.href = "/login";
		},
		() => {

		}
	);
}