document.addEventListener("DOMContentLoaded", function () {
	let editorInstance;
	const fileInput = document.getElementById('fileInput');
	const boardId = document.getElementById('boardId').value;
	
	ClassicEditor
		.create(document.querySelector('#editor'))
		.then(editor => {
			editorInstance = editor;

			if (typeof boardContent !== 'undefined') {
				editor.setData(boardContent);
			}
		})
		.catch(error => {
			console.error(error);
		});

	document.getElementById("submitBtn").addEventListener("click", async function () {
		const title = document.getElementById("title").value.trim();
		const content = editorInstance.getData();

		if (!title || !content) {

			showConfirm2("제목과 내용을 모두 입력해 주세요.","",
				() => {
					return;
				}
			);
		}

		const formData = new FormData();
		formData.append('boardId', boardId);
		formData.append('title', title);
		formData.append('content', content);

		const files = fileInput.files;
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		try {
			const response = await axios.post("/comm/peer/teen/teenBoardInUpdate.do", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			if (response.status === 200) {
				showConfirm2("등록 성공","",
					() => {
						switch (ccId) {
							case "G09001":
								window.location.href = "/comm/peer/teen/teenList.do";
								break;
							case "G09002":
								window.location.href = "/comm/path/pathList.do";
								break;
							case "G09006":
								window.location.href = "/comm/peer/youth/youthList.do";
								break;
						}
					}
				);
			}
		} catch (error) {
			console.error("등록 중 오류:", error);
			showConfirm2("등록에 실패했습니다.","",
				() => {
				    return;
				}
			);
		}
	});

	document.getElementById("backBtn").addEventListener("click", function () {
		window.history.back();
	});
});
