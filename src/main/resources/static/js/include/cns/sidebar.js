/**
 * 
 */

function sidebar(){
	const sidebar = document.querySelector('.admin-side-sidebar');
		  setTimeout(() => {
		    sidebar.classList.add('active');
		  }, 300);

		  document.querySelectorAll('.admin-side-menu-link').forEach(function (el) {
		    el.addEventListener('click', function (e) {
		      e.preventDefault();

		      const pageUrl = this.dataset.page;

			  removeOldFiles();
			  
		      fetch(pageUrl)
		        .then(response => {
		          if (!response.ok) throw new Error("불러오기 실패");
		          return response.text();
		        })
		        .then(html => {
		          document.getElementById('content').innerHTML = html;

		          const scripts = document.getElementById('content').querySelectorAll('script');
		          scripts.forEach(oldScript => {
		            const newScript = document.createElement('script');
		            if (oldScript.src) {

		              newScript.src = oldScript.src;
		            } else {

		              newScript.textContent = oldScript.textContent;
		            }
		            document.body.appendChild(newScript);

		            oldScript.remove();
		          });
		        })
		        .catch(err => {
		          document.getElementById('content').innerHTML = '<p>에러: 페이지를 불러올 수 없습니다.</p>';
		          console.error(err);
		        });
		    });
		  });
}

// 제거할 CSS 파일들을 명시적으로 지정
const removableFiles = [
    // CSS 파일 목록
    '/css/cns/scm/scheduleManagement.css',
    // JS 파일 목록 (새로 로드되는 페이지에만 필요한 스크립트)
    '/js/include/cns/scm/scheduleManagement.js',
	'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
	'/js/com/index.global.min.js'
];

function removeOldFiles() {
    // 모든 <link> 태그와 <script> 태그를 가져옵니다.
    const allLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const allScripts = document.querySelectorAll('script');
    
    // CSS 파일 제거
    allLinks.forEach(link => {
        if (removableFiles.some(file => link.href.includes(file))) {
            link.remove();
        }
    });

    // JS 파일 제거
    allScripts.forEach(script => {
        // src 속성이 있고, 제거 대상 목록에 포함된 스크립트만 제거
        if (script.src && removableFiles.some(file => script.src.includes(file))) {
            script.remove();
        }
    });
}

function showConfirm(message1, message2, onOk, onCancel) {
    const confirmBox = document.getElementById("customConfirm");
    const confirmMessage1 = document.getElementById("confirmMessage1");
    const confirmMessage2 = document.getElementById("confirmMessage2");
	const overlay = document.querySelector('.custom-confirm-overlay');
    confirmMessage1.innerHTML = message1; // 메시지 표시
    confirmMessage2.innerHTML = message2; // 메시지 표시
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