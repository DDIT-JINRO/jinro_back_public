/**
 * 
 */
document.addEventListener("DOMContentLoaded", function() {
	let editorInstance;
	const fileInput = document.getElementById('fileInput');

	ClassicEditor
		.create(document.querySelector('#editor'))
		.then(editor => {
			editorInstance = editor;
		})
		.catch(error => {
			console.error(error);
		});

	document.getElementById("submitBtn").addEventListener("click", async function() {
		const title = document.getElementById("title").value.trim();
		const content = editorInstance.getData();

		if (!title || !content) {
			showConfirm2("제목과 내용을 모두 입력해 주세요.","",
				() => {
				}
			);
			return;
		}

		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);

		const files = fileInput.files;
		if (files.length == 0) {
			showConfirm2("템플릿 파일을 등록해주세요.","",
				() => {
				}
			);
			return;
		}

		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		try {
			const response = await axios.post("/cdp/rsm/rsmb/resumeBoardInsert.do", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			if (response.status === 200) {
				showConfirm2("등록 성공","",
					() => {
						window.location.href = "/cdp/rsm/rsmb/resumeBoardList.do";
					}
				);
			}
		} catch (error) {
			console.error("등록 중 오류:", error);
			showConfirm2("등록에 실패했습니다.","",
				() => {
				}
			);
		}
	});

	document.getElementById("backBtn").addEventListener("click", function() {
		window.history.back();
	});
});

document.getElementById('fileInput').addEventListener('change', function(event) {
	const mainPreviewContainer = document.getElementById('preview-container'); // 이름 변경
	const previewList = document.getElementById('preview-list');

	// 이전에 생성된 미리보기가 있다면 모두 삭제
	previewList.innerHTML = '';

	const files = event.target.files;
	let pdfFound = false;

	// 선택된 모든 파일을 순회
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		// 파일 타입이 PDF인 경우에만 미리보기 항목 생성
		if (file.type === 'application/pdf') {
			pdfFound = true;

			// 파일 아이템 컨테이너 생성
			const fileItem = document.createElement('div');
			fileItem.className = 'pdf-file-item';

			// 파일 헤더 (파일명 + 버튼) 생성
			const fileHeader = document.createElement('div');
			fileHeader.className = 'pdf-file-header';

			// 파일 이름
			const fileName = document.createElement('div');
			fileName.className = 'pdf-file-name';
			fileName.textContent = file.name;

			// 미리보기 토글 버튼
			const previewBtn = document.createElement('button');
			previewBtn.className = 'btn-pdf-preview';
			previewBtn.textContent = '미리보기 보기';
			previewBtn.type = 'button';

			// 미리보기 컨테이너 생성 (이름 변경)
			const pdfPreviewContainer = document.createElement('div');
			pdfPreviewContainer.className = 'pdf-preview-container';

			// PDF iframe 생성
			const iframe = document.createElement('iframe');
			iframe.className = 'pdf-iframe';
			iframe.title = file.name + ' 미리보기';

			previewBtn.addEventListener('click', function() {
				if (pdfPreviewContainer.classList.contains('open')) {
					pdfPreviewContainer.classList.remove('open');
					previewBtn.textContent = '미리보기 보기';
				} else {
					// 다른 모든 미리보기 닫기
					const allPreviews = document.querySelectorAll('.pdf-preview-container.open');
					const allButtons = document.querySelectorAll('.btn-pdf-preview');

					allPreviews.forEach(preview => preview.classList.remove('open'));
					allButtons.forEach(btn => btn.textContent = '미리보기 보기');

					// iframe이 아직 로드되지 않았다면 지금 로드
					if (!iframe.src) {
						const fileURL = URL.createObjectURL(file);
						const viewerURL = `/js/pdfjs/web/viewer.html?file=${encodeURIComponent(fileURL)}&locale=en-US#zoom=page-fit`;
						iframe.src = viewerURL;
					}

					pdfPreviewContainer.classList.add('open');
					previewBtn.textContent = '미리보기 닫기';
				}
			});

			// 요소들 조립
			fileHeader.appendChild(fileName);
			fileHeader.appendChild(previewBtn);
			pdfPreviewContainer.appendChild(iframe);
			fileItem.appendChild(fileHeader);
			fileItem.appendChild(pdfPreviewContainer);
			previewList.appendChild(fileItem);
		}
	}

	// PDF 파일이 하나라도 있었으면 전체 컨테이너를 보여줌
	if (pdfFound) {
		mainPreviewContainer.style.display = 'block'; // 올바른 변수 사용
	} else {
		mainPreviewContainer.style.display = 'none';
	}
});