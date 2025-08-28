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
    '/js/com/index.global.min.js',
    '/css/cnsLeader/scm/scheduleManagement.css',
    'https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js',
	'https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.min.js',
	'/js/include/cnsLeader/scm/scheduleManagement.js'
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