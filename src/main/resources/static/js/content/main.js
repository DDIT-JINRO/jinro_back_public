/**
 *
 */

const text = "관심 진로와 관련된 유튜브 콘텐츠를 한눈에 확인해보세요.";
const target = document.getElementById("typing-js");

let index = 0;
let isDeleting = false;


function typingLoop() {
	if (isDeleting) {
		target.textContent = text.substring(0, index--);
	} else {
		target.textContent = text.substring(0, index++);
	}
	if (!isDeleting && index === text.length + 1) {
		isDeleting = true;
		setTimeout(typingLoop, 1500); // 타이핑 다 끝난 후 멈추는 시간
		return;
	}

	if (isDeleting && index === 0) {
		isDeleting = false;
	}

	const speed = isDeleting ? 50 : 100; // 지울 때는 더 빠르게
	setTimeout(typingLoop, speed);
}

typingLoop();

// --- 슬라이더 스크립트 시작 ---
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let currentSlide = 1; // 클론 때문에 1번부터 시작
const totalSlides = slides.length;

// --- 클론 추가 ---
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[totalSlides - 1].cloneNode(true);
firstClone.id = "first-clone";
lastClone.id = "last-clone";

slidesContainer.appendChild(firstClone);
slidesContainer.insertBefore(lastClone, slidesContainer.firstChild);

const allSlides = document.querySelectorAll('.slide');
const totalAllSlides = allSlides.length;

// 초기 위치
slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

// --- 자동 슬라이드 관리 변수 ---
let slideInterval;

// --- 자동 슬라이드 제어 함수 ---
function pauseSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function resumeSlide() {
    pauseSlide(); // 기존 타이머 정리
    slideInterval = setInterval(nextSlide, 3000);
}

function resetSlideTimer() {
    pauseSlide();
    resumeSlide();
}

const slideColors = [
    '#CCDCFE',
    '#FFF4CC',
    '#FFE5E5',

];
const banner = document.querySelector('.main-banner');
// --- 슬라이드 이동 함수 ---
function showSlide(index) {
    slidesContainer.style.transition = "transform 0.5s ease-in-out";
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;

    // dot 업데이트
    dots.forEach(dot => dot.classList.remove('active'));
    let dotIndex = index - 1; // 클론 때문에 보정
    if (dotIndex < 0) dotIndex = totalSlides - 1;
    if (dotIndex >= totalSlides) dotIndex = 0;
    if (dots[dotIndex]) dots[dotIndex].classList.add("active");

	if (slideColors[dotIndex]) {
	       banner.style.backgroundColor = slideColors[dotIndex];
	}
}

// --- transition 끝나면 클론 보정 ---
slidesContainer.addEventListener("transitionend", () => {
    if (allSlides[currentSlide].id === "first-clone") {
        slidesContainer.style.transition = "none";
        currentSlide = 1;
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    if (allSlides[currentSlide].id === "last-clone") {
        slidesContainer.style.transition = "none";
        currentSlide = totalSlides;
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
});

// --- 다음/이전 버튼 ---
function nextSlide() {
    if (currentSlide >= totalAllSlides - 1) return;
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    if (currentSlide <= 0) return;
    currentSlide--;
    showSlide(currentSlide);
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetSlideTimer(); // 버튼 클릭 시 타이머 리셋
    });
    nextBtn.addEventListener("mouseenter", pauseSlide);
    nextBtn.addEventListener("mouseleave", resumeSlide);
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetSlideTimer(); // 버튼 클릭 시 타이머 리셋
    });
    prevBtn.addEventListener("mouseenter", pauseSlide);
    prevBtn.addEventListener("mouseleave", resumeSlide);
}

// --- dot 클릭 이벤트 (타이머 리셋 기능 추가) ---
if (dots) {
    dots.forEach(dot => {
        dot.addEventListener("click", e => {
            const slideIndex = parseInt(e.target.dataset.slideIndex);
            currentSlide = slideIndex + 1; // 클론 때문에 +1
            showSlide(currentSlide);
            resetSlideTimer(); // dot 클릭 시 타이머 리셋
        });
    });
}

// --- 자동 슬라이드 시작 ---
resumeSlide();

// 초기 슬라이드 표시
showSlide(currentSlide);
// --- 슬라이더 스크립트 끝 ---

document.addEventListener('DOMContentLoaded', function() {
	fn_init();
	fn_TopsWidget();
	fn_ContestBanner();
    if(memId && memId !='anonymousUser') {
    	roadmapPopup();
	}
});

const fn_init = () => {
	const banner = document.querySelector('.main-banner');
	banner.classList.add('animate-in');

	// 로드맵 바로가기 버튼
	const roadmap = document.querySelector('.roadmapBtn');
	roadmap.addEventListener("click", () => {
		if(!memId || memId=='anonymousUser') {
			showConfirm("로그인 후 이용 가능합니다.","로그인하시겠습니까?",
			    () => {
			        sessionStorage.setItem("redirectUrl", location.href);
			        location.href = "/login";
			    },
			    () => {

			    }
			);
		} else {
			const roadmapUrl = FRONT_URL + '/roadmap';

			const width  = 1084;
			const height = 736;
			const screenWidth  = window.screen.width;
			const screenHeight = window.screen.height;
            const left = Math.floor((screenWidth - width) / 2);
            const top  = Math.floor((screenHeight - height) / 2);

            axios.post("/admin/las/roadMapVisitLog.do");

			window.open(roadmapUrl, 'Roadmap', `width=\${width}, height=\${height}, left=\${left}, top=\${top}`);
		}
	});

	const worldcup = document.getElementById('worldcupBtn')
	worldcup.addEventListener("click", () => {
		if(!memId || memId=='anonymousUser') {
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

			const width  = 1200;
			const height = 800;
			const screenWidth  = window.screen.width;
			const screenHeight = window.screen.height;
			const left = Math.floor((screenWidth - width) / 2);
			const top  = Math.floor((screenHeight - height) / 2);

			window.open(worldcupUrl, 'worldcup', `width=\${width}, height=\${height}, left=\${left}, top=\${top}`);
		}
	});

	const goToRoadMapBtn = document.getElementById('goToRoadMapBtn');
	if(goToRoadMapBtn){
		goToRoadMapBtn.addEventListener('click', roadmapPopup);
	}
}

const roadmapPopup = () => {
	const popupCookie = getCookie('popup');

	if(popupCookie != 'done') {
		const roadmapUrl = FRONT_URL + '/roadmap';

		const width  = 1084;
		const height = 736;
		const screenWidth  = window.screen.width;
		const screenHeight = window.screen.height;
		const left = Math.floor((screenWidth - width) / 2);
		const top  = Math.floor((screenHeight - height) / 2);

		window.open(roadmapUrl, 'Roadmap', `width=${width}, height=${height}, left=${left}, top=${top}`);
	}
};

const getCookie = (name) => {
	const nameOfCookie = name + "="
	const cookieArray = document.cookie.split('; ');

	for (const cookie of cookieArray) {
		if (cookie.startsWith(nameOfCookie)) {
			return decodeURIComponent(cookie.substring(nameOfCookie.length));
		}
	}

	return null;
};

// fetch 함수화
const fetchJSON = async (url) => {
  try{
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
    if(!res.ok) return [];
    return await res.json();
  }catch(e){ return []; }
};

const fn_TopsWidget = () =>{
	// 컨텐츠 4종류 요소 배열로 받음
	const widgets = Array.from(document.querySelectorAll('.trend-widget'));


	// 위젯 로딩 함수
	const initWidget = async (section) => {
	  const endpoint = section.dataset.endpoint;	// jsp 요소에 삽입해둔 fetch url
	  const roller  = section.querySelector('.trend-roller');	// 순위별로 번갈아가며 출력될 요소
	  const viewport= section.querySelector('.trend-viewport'); // 순위별로 번갈아가며 출력될 요소 컨테이너
	  const panel   = section.querySelector('.trend-panel');	// 순위전체 목록이 들어갈 요소

	  let items = (await fetchJSON(endpoint)).slice(0,5).map((x,i)=>({
	    rank: i+1,
	    text: x.TARGETNAME || '제목 없음',
	    href: x.TARGET_URL  || '#'
	  }));

	  // 데이터 없을 때 기본 표시 방지
	  if(items.length === 0){
	    roller.innerHTML = `<li class="trend-item"><span class="trend-text">데이터가 없습니다</span></li>`;
	    button.disabled = true;
	    return;
	  }

	  // ① 롤러(한 줄) 렌더
	  let idx = 0;	// setTimeout에서 idx 값 변화 시키면서 렌더링함
	  const renderRoller = () => {
	    const it = items[idx % items.length];
	    roller.innerHTML = `
	      <li class="trend-item">
	        <span class="trend-rank">${it.rank}</span>
	        <a class="trend-text" href="${it.href}" title="${it.text}">${it.text}</a>
	      </li>`;
	  };
	  renderRoller();

	  // ② 패널(전체) 렌더
	  const renderPanel = () => {
	    panel.innerHTML = items.map(it => `
	      <a class="panel-item" href="${it.href}">
	        <span class="panel-rank">${it.rank}</span>
	        <span class="panel-text">${it.text}</span>
	      </a>`).join('');
	  };
	  renderPanel();

	  // ③ 순환 타이머
	  let hovering = false, focused = false, timer = null;
	  const tick = () => {
	    if(hovering || focused || items.length === 0) return;
	    idx = (idx + 1) % items.length;
	    renderRoller();
	  };
	  const start = () => { stop(); timer = setInterval(tick, 2300); };	// 순위변화 시간 조절
	  const stop  = () => { if(timer) clearInterval(timer); timer = null; };
	  start();

	  // ④ 인터랙션 (hover/버튼/포커스)
	  const openPanel = () => { panel.classList.remove('hidden'); };
	  const closePanel= () => { panel.classList.add('hidden'); };

	  section.addEventListener('mouseenter', ()=>{ hovering = true; openPanel(); });
	  section.addEventListener('mouseleave', ()=>{ hovering = false; closePanel(); });
	  viewport.addEventListener('focusin',  ()=>{ focused = true; });
	  viewport.addEventListener('focusout', ()=>{ focused = false; });

	  // 페이지 이탈 시 정리
	  window.addEventListener('beforeunload', stop);
	};

	widgets.forEach(initWidget);

	document.addEventListener('click', (e) => {
	    if (!e.target.closest('.trend-widget')) {
	        widgets.forEach(widget => {
	            widget.querySelector('.trend-panel').classList.add('hidden');
	        });
	    }
	});
}

const fn_ContestBanner = async () =>{
	const datas = await fetchJSON('/contest-banner')
	const slideContainer = document.querySelector('.feature-slider__slides');
	const banners = datas.map(d =>
		`
		<a href="${d.contestUrl}" data-title="${d.contestTitle}" class="feature-slider__anchor">
			<img src="${d.filePath}" alt="${d.contestTitle.slice(1,6)}.." title="${d.contestTitle}" class="feature-slider__image">
		</a>
		`
	).join('');
	slideContainer.innerHTML = banners + banners;
}

// 유튜브
async function yotubeInMain() {
	let channelId = "";
	let result = "";
	let apiKey = "";
	let jobCode = "";
	let jobName = "";
	try {
		await axios.get("/main/youtube")
			.then(response => {

				channelId = response.data.channelId;
				result = response.data.RESULT;
				apiKey = response.data.apikey;
				jobCode = response.data.JOBCODE;
				jobName = response.data.JOB;
				if(result != '직업' && jobCode != null){
					document.getElementById("goToTestJobName").innerText= jobName.trim();
					document.getElementById("getKeyword").style.display = "flex";
					document.getElementById("nonKeyword").style.display = "none";
					let btn = document.getElementById("getKeywordBtn");
					btn.value=jobCode;
				}else{
					document.getElementById("getKeyword").style.display = "none";
					document.getElementById("nonKeyword").style.display = "flex";
				}


			});
		await axios.get('https://youtube.googleapis.com/youtube/v3/search', {
			params: {
				"part": "snippet",
				"maxResults": 4,
				"channelId": channelId,
				"q": result,
				type: "video",
				"regionCode": "kr",
				"key": apiKey
			}
		})
			.then(response => {

				let html = "";

				const arr = response.data.items;

				arr.forEach(item => {
					let id = item.id.videoId;
					let title = item.snippet.title;

					if(title.length>22){
						if (title.indexOf("(") !== -1) {
						    title = title.substring(0, title.indexOf("(")).trim();
						} else if (title.indexOf("&quot;") !== -1) {
						    title = title.substring(0, title.indexOf("&quot;")).trim();
						}
						title=textLengthOverCut(title, 22, "...");
					}

					html += `
						<div class="content-card">
							<p style ="margin-bottom:16px; font-size: 14px; line-height: 1.25; color: #1f2d3d; font-weight: 600;">${title}</p>
							<iframe width="300px" height="215px"
						    	src="https://www.youtube.com/embed/${id}"
						    	frameborder="0"
						    	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						    	allowfullscreen>
							</iframe>
						</div>
					`;
					document.querySelector(".content-showcase__list").innerHTML = html;
				})
			});
	} catch (err) {
		console.error("error : ", err);
	}
}

function textLengthOverCut(txt, len, lastTxt) {
	if (txt.length > len) {
		txt = txt.substr(0, len) + lastTxt;
	}
	return txt;
}

// 임시로 주석처리 중
yotubeInMain();

getKeywordBtn.addEventListener("click", function() {
    const jobCode = this.value;
    location.href = `/pse/cr/crl/selectCareerDetail.do?jobCode=${jobCode}`;
});

/*AI 섹션 이동 */
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.ai-card').forEach(card => {
		card.addEventListener('click', e => {
			e.preventDefault(); // 기본 링크 이동 막기
			const url = card.getAttribute('href');

			if (!memId || memId === 'anonymousUser') {
				// showConfirm가 로드되어 있어야 함
				if (typeof showConfirm === 'function') {
					showConfirm(
						"로그인 후 이용 가능합니다.",
						"로그인하시겠습니까?",
						() => {
							sessionStorage.setItem("redirectUrl", location.href);
							location.href = "/login";
						},
						() => { }
					);
				}
			} else {
				location.href = url;
			}
		});
	});
});
