function reviewManagement() {
	let irStatusObj = "";

	document.querySelector("#reviewList").addEventListener("click", function(e) {
		const target = e.target.closest(".review-item");
		if (target) {
			const irId = target.dataset.irId
			selectReviewDetail(irId);
		}
	});

	document.getElementById('review-modify-button').addEventListener('click', function() {
	    updateReviewDetail();
	});

	const updateReviewDetail = () => {
	    const irId = document.getElementById('review-detail-irId').value;
	    const irStatus = document.getElementById('review-detail-status-select').value;
	    const veriReason = document.getElementById('review-detail-reject-reason').value;

	    const irType = document.getElementById('review-detail-irType').dataset.irType;

	    const updateData = {
	        irId: irId,
	        irStatus: irStatus,
	        veriReason: veriReason,
	        irType: irType
	    };

	    axios.post('/admin/cmg/updateReviewDetail', updateData)
	        .then(response => {
	            if (response.data.success) {
					showConfirm2("후기 정보가 성공적으로 수정되었습니다","",
						() => {
						}
					);
	                selectReviewList();
	            } else {
					showConfirm2("후기 정보 수정에 실패했습니다.","",
						() => {
						}
					);
	                return;
	            }
	        })
	        .catch(error => {
	            console.error('수정 요청 중 오류 발생:', error);
				showConfirm2("후기 정보 수정 중 문제가 발생했습니다.","",
					() => {
					}
				);
	        });
	};

	const selectReviewDetail = (irId) => {
		axios.get(`/admin/cmg/selectReviewDetail?irId=${irId}`)
			.then(({ data }) => {
				// 날짜 형식 변환 함수 (기존 코드와 동일)
				const formatDate = (dateString) => {
					if (!dateString) return '';
					const date = new Date(dateString);
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1)
					const day = String(date.getDate())
					return `${year}. ${month}. ${day}.`;
				};

				// DOM 요소에 데이터 바인딩 (기존 코드와 동일)
				document.getElementById('review-detail-irId').value = data.irId;
				document.getElementById('review-detail-memName').value = data.memName;
				document.getElementById('review-detail-targetName').value = data.targetName;
				document.getElementById('review-detail-application').value = data.irApplication;
				document.getElementById('review-detail-interviewAt').value = formatDate(data.irInterviewAt);
				document.getElementById('review-detail-irType').value = (data.irType === 'G02001' ? '대학' : '기업');
				document.getElementById('review-detail-status-text').value = irStatusObj[data.irStatus];
				document.getElementById('review-detail-modAt').value = formatDate(data.irModAt);
				document.getElementById('review-detail-createdAt').value = formatDate(data.irCreatedAt);
				document.getElementById('review-detail-content').value = data.irContent;
				document.getElementById('review-detail-reject-reason').value = data.veriReason;

				const irTypeInput = document.getElementById('review-detail-irType');
				irTypeInput.value = (data.irType === 'G02001' ? '대학' : '기업');
				irTypeInput.dataset.irType = data.irType;

				const rejectReasonContainer = document.getElementById('reject-reason-container');
				if (data.irStatus === 'S06004') {
				    rejectReasonContainer.style.display = 'block';
				} else {
				    rejectReasonContainer.style.display = 'none';
				}

				// 증빙 자료 파일 링크 및 미리보기 처리
				const fileLinkElement = document.getElementById('review-detail-file-link');

				if (data.fileGroupId) {
					// 다운로드 링크 설정
					fileLinkElement.textContent = '파일 다운로드';
					fileLinkElement.href = `/download?fileGroupId=${data.fileGroupId}`;
				} else {
					// 파일이 없을 경우
					fileLinkElement.textContent = '-';
					fileLinkElement.href = '#';
				}
			})
			.catch(error => {
				console.error("데이터를 가져오는 중 오류 발생:", error);
				showConfirm2("후기 상세 정보를 불러오는 데 실패했습니다.","",
					() => {
					}
				);
			});
	};

	const selectReviewList = (page = 1) => {
		const keyword = document.querySelector("input[name='keyword']").value;
		const status = document.querySelector("select[name='status']").value;

		axios.get("/admin/cmg/selectReviewList", {
			params: {
				size: 10,
				currentPage: page,
				keyword: keyword,
				status: status,
			}
		}).then(({ data }) => {
			// 페이지 정보
			document.getElementById("reviewListPage").innerText = data.articlePage.currentPage;
			document.getElementById("reviewListTotalPage").innerText = data.articlePage.totalPages;

			const reviewList = document.querySelector("#reviewList");
			const reviewListCount = document.querySelector("#reviewList-count");
			const irStatusSelect = document.querySelector("select[name='irStatus']");

			const articlePage = data.articlePage;
			const contentList = articlePage.content;
			irStatusObj = data.irStatus;

			let reviewListHtml = "";

			if (contentList.length < 1 && keyword.trim() !== '') {
				reviewList.innerHTML = `<tr><td colspan='2' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
			}

			const optionsHtml = Object.entries(irStatusObj).map(([key, value]) => {
				return `<option value="${key}">${value}</option>`;
			}).join('');

			irStatusSelect.innerHTML = optionsHtml;

			contentList.forEach(value => {
				const date = new Date(value.irCreatedAt)
				const formattedDate = formatDate(date);
				const irStatus = irStatusObj[value.irStatus]
				let irType = ""

				switch (value.irType) {
					case "G02001":
						irType = "대학";
						break;
					case "G02002":
						irType = "기업";
						break;
				}

				reviewListHtml += `
					<tr class="review-item" data-ir-id="${value.irId}">
						<td>${value.rnum}</td>
						<td>${value.memName}</td>
						<td>${irType}</td>
						<td>${value.targetName}</td>
						<td>${value.irApplication}</td>
						<td>${irStatus}</td>
						<td>${formattedDate}</td>
					</tr>
				`;
			});

			reviewListCount.innerHTML = articlePage.total;
			reviewList.innerHTML = reviewListHtml;
			renderPaginationReview(data.articlePage);
		}).catch((err) => {
			console.error(err);
		});
	}

	const renderPaginationReview = ({ startPage, endPage, currentPage, totalPages }) => {
		let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;

		for (let p = startPage; p <= endPage; p++) {
			html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}

		html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

		const footer = document.querySelector('.reviewListPageination');
		if (footer) footer.innerHTML = html;
	}

	const reviewListPangingFn = () => {
		const reviewListPaginationContainer = document.querySelector('.panel-footer.pagination');
		if (reviewListPaginationContainer) {

			reviewListPaginationContainer.addEventListener('click', e => {
				e.preventDefault();
				const link = e.target.closest('.page-link');

				if (!link || link.parentElement.classList.contains('disabled')) {
					return;
				}

				const page = parseInt(link.dataset.page, 10);

				if (!isNaN(page) && page > 0) {
					selectReviewList(page);
				}
			});
		}
	}

	document.getElementById('review-detail-status-select').addEventListener('change', function() {
	    const rejectReasonContainer = document.getElementById('reject-reason-container');
	    if (this.value === 'S06004') {
	        rejectReasonContainer.style.display = 'block';
	    } else {
	        rejectReasonContainer.style.display = 'none';
	    }
	});

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1)
		const day = String(date.getDate())

		return `${year}. ${month}. ${day}.`;
	}

	const searchBtn = document.querySelector('.searchReportBtn');
	const inputKeyword = document.getElementById('search');

	searchBtn.addEventListener('click',function(){
		selectReviewList(1);
	})
	inputKeyword.addEventListener('keydown', function(e){
		if(e.code === 'Enter'){
			searchBtn.click();
		}
	})

	reviewListPangingFn();
	selectReviewList();
}

reviewManagement();