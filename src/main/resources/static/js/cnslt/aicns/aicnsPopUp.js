/**
 *
 */
document.addEventListener('DOMContentLoaded',function(){
	/* ========= State ========= */
	const chat   = document.getElementById('chat');
	const ta     = document.getElementById('ta');
	const send   = document.getElementById('btnSend');
	const errorB = document.getElementById('errorBar');
	const newBtn = document.getElementById('btnNewMsg');
	const topicBadge = document.getElementById('topicBadge');

	const roleIcon = role => role === 'mine' ? '👤' : '🤖';
	const nowStr = () => {
		const d = new Date();
		const p = n => String(n).padStart(2, '0');
		return `${String(d.getFullYear()).slice(-2)}.${p(d.getMonth() + 1)}.${p(d.getDate())}. ${p(d.getHours())}:${p(d.getMinutes())}`;
	};

	const sid = new URLSearchParams(location.search).get('sid');
	if (!sid) { 
		showConfirm2("세션 정보가 없습니다.","창을 닫습니다.",
			() => {
				closeOrFallback(); 
			}
		);
		return;
	}

	if(errorB.dataset.message && errorB.dataset.message!=''){
		// 서버에서 넘긴 오류메시지 있을경우 출력 후 윈도우 닫거나 뒤로가기
		showConfirm2(errorB.dataset.message,"",
			() => {
				closeOrFallback(); 
			}
		);
		return;
	}else{
		// 오류없으면 페이지 로그 기록 및 상담시작문구 출력
		const defaultChat_MIND = `
		안녕하세요. 찾아주셔서 감사합니다.<br/>
		저는 심리상담을 담당하는 AI 챗봇입니다.<br/>
		<br/>
		이곳은 당신의 마음을 편안하게 이야기하고, 함께 어려움을 헤쳐나갈 수 있도록 돕는 공간이에요. 어떤 이야기든 괜찮으니, 지금 어떤 기분이신지, 혹은 어떤 고민이 있으신지 편하게 이야기해주시면 제가 귀 기울여 듣고 함께 생각해볼게요.
		`;
		const defaultChat_STUDY=`
		안녕하세요. 찾아주셔서 감사합니다.<br/>
		저는 학업상담을 담당하는 AI 챗봇입니다.<br/>
		<br/>
		이곳은 학습 고민을 편하게 이야기하고, 당신에게 맞는 효율적인 공부 전략과 루틴을 함께 찾아가는 공간이에요. 목표(성적 향상·진학·루틴 만들기 등)와 현재 어려움(집중·시간관리·과목 이해 등)을 말씀해주시면, 오늘부터 실천할 수 있는 방법을 함께 설계해볼게요.
		`;
		const defaultChat_JOB=`
		안녕하세요. 찾아주셔서 감사합니다.<br/>
		저는 취업상담을 담당하는 AI 챗봇입니다.<br/>
		<br/>
		이곳은 커리어 방향과 구직 준비를 차분히 정리하고, 당신의 상황에 맞는 현실적인 다음 단계를 제안받는 공간이에요. 이력서·자소서·면접·직무 탐색 중 어디에서 막히셨는지, 그리고 희망 직무/업종·근무 형태 같은 조건을 알려주시면 맞춤 조언을 드릴게요.
		`;
		const data = {};
		switch (topicBadge.dataset.topic){
			case "MIND":
				data.cnsType = "G07003";
				addAI(defaultChat_MIND);
				break;
			case "STUDY":
				data.cnsType = "G07002";
				addAI(defaultChat_STUDY);
				break;
			case "JOB":
				data.cnsType = "G07001";
				addAI(defaultChat_JOB);
				break;
		}
		axios.post('/admin/las/aiCounselVisitLog.do', data);
		localStorage.setItem("AICNS_OPEN", "1");
	}



	let pending = false;
	let autoScroll = true;

	/* ========= Helpers ========= */
	// 종료 송신 함수
	function sendClose() {
	  if (!sid) return;
	  const payload = JSON.stringify({ sid });
	  if(localStorage.getItem("AICNS_OPEN")) localStorage.removeItem("AICNS_OPEN");

	  // 우선권: beforeunload에서도 동작하는 sendBeacon
	  if (navigator.sendBeacon) {
	    const blob = new Blob([payload], { type: 'application/json' });
	    navigator.sendBeacon('/ai/session/close', blob);
	  } else {
	    // 폴백: keepalive fetch (일부 브라우저에서만 보장)
	    fetch('/ai/session/close', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: payload,
	      keepalive: true
	    }).catch(() => {});
	  }
	}

	// 3) 팝업이 닫힐 때 자동 호출 (중복 방지 once)
	window.addEventListener('pagehide', sendClose, { once: true });
	window.addEventListener('beforeunload', sendClose, { once: true });

	const endBtn = document.getElementById('btn-close');
	if (endBtn) {
	  endBtn.addEventListener('click', () => {
	    sendClose();
	    closeOrFallback();
	  });
	}

	function showError(msg){
	  errorB.textContent = msg;
	  errorB.style.display = 'block';
	  setTimeout(()=> errorB.style.display='none', 4200);
	}

	function escapeHtml(s) {
		return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
	}

	function row(role, html, ts) {
		const wrap = document.createElement('div');
		wrap.className = `row ${role}`;
		wrap.innerHTML = `
	    ${role === 'mine' ? '' : `<div class="avatar" aria-hidden="true">${roleIcon(role)}</div>`}
	    <div>
	      <div class="bubble">${html}</div>
	      <div class="meta">
	        <span>${ts || nowStr()}</span>
	        <div class="tools">
	          <button class="tool" title="복사" onclick="navigator.clipboard.writeText(this.closest('.row').querySelector('.bubble').innerText)">복사</button>
	        </div>
	      </div>
	    </div>
	    ${role === 'mine' ? `<div class="avatar" aria-hidden="true">${roleIcon(role)}</div>` : ''}
	  `;
		return wrap;
	}

	function addMine(text) {
		chat.appendChild(row('mine', escapeHtml(text)));
		requestIdleCallback(scrollMaybe, { timeout: 0 });
	}
	function addAI(text) {
		chat.appendChild(row('ai', text));
		requestIdleCallback(scrollMaybe, { timeout: 0 });
	}

	function scrollMaybe() {
		if (autoScroll) {
			chat.scrollTop = chat.scrollHeight;
			newBtn.style.display = 'none';
		}
	}

	function addTyping() {
		const w = document.createElement('div');
		w.className = 'row ai';
		w.dataset.typing = '1';
		w.innerHTML = `
	    <div class="avatar" aria-hidden="true">🤖</div>
	    <div>
	      <div class="bubble"><span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span></div>
	    </div>
	  `;
		chat.appendChild(w);
		scrollMaybe();
		return w;
	}

	function removeTyping() {
		const t = chat.querySelector('[data-typing="1"]');
		if (t) t.remove();
	}

	/* ========= Composer ========= */
	ta.addEventListener('input', () => {
		ta.style.height = 'auto';
		ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
		send.disabled = !ta.value.trim() || pending;
	});

	ta.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			doSend();
		}
	});

	send.addEventListener('click', doSend);

	async function doSend() {
		const q = ta.value.trim();
		if (!q || pending) return;
		pending = true;
		send.disabled = true;

		addMine(q);
		ta.value = ''; ta.dispatchEvent(new Event('input'));

		try {
			const { data } = await axios.post('/ai/chatbot', { sid, message: q, topic:topicBadge.dataset.topic });
			removeTyping();
			if (data) {
				addAI(data);
			} else {
				showError((data && data.message) || '답변 생성에 실패했습니다.');
			}
		} catch (err) {
			console.error(err);
			removeTyping();
			showError('서버 통신 중 문제가 발생했습니다.');
		} finally {
			pending = false;
			send.disabled = !ta.value.trim();
		}
	}

	function closeOrFallback() {
	  if(localStorage.getItem("AICNS_OPEN")) localStorage.removeItem("AICNS_OPEN");
	  // 우리 팝업을 열 때 이름을 지정했다면(예: 'aiCounselWindow') 그걸 힌트로 사용
	  const isLikelyPopup =
	    (window.opener && !window.opener?.closed) || window.name === 'aiCounselWindow';
	  if (isLikelyPopup) {
	    window.close();
	    // 혹시 막히면 150ms 후 폴백
	    setTimeout(() => {
	      if (!window.closed) fallback();
	    }, 150);
	  } else {
	    fallback();
	  }

	  function fallback() {
	    if (history.length > 1) history.back();
	    else location.href = '/'; // 원하는 안전한 경로
	  }
	}

})