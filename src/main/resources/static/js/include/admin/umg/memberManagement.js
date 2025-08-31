function memberManagement() {
	let personChartInstance = null;
	let userOnlineChartInstance = null;
	let pageVisitChartInstance = null;
	let doughnutChart = null;

	let currentSortOrder = 'asc';
	let currentSortBy = '';
	let currentPage = 1;

	const hiddenInput = document.getElementById('comCalendarInput');

	const userListIdBtn = document.getElementById('userListId');
	const userListNameBtn = document.getElementById('userListName');
	const userListEmailBtn = document.getElementById('userListEmail');
	const userListSortOrder = document.getElementById('userListSortOrder');

	const boardListIdBtn = document.getElementById('memDetailBoardList-orderBtn-id');
	const boardListDateBtn = document.getElementById('memDetailBoardList-orderBtn-date');
	const boardListdelYnBtn = document.getElementById('memDetailBoardList-orderBtn-delYn');
	const boardListSortOrder = document.getElementById("memDetailSortOrder");

	const replyListIdBtn = document.getElementById('memDetailReplyList-orderBtn-id');
	const replyListDateBtn = document.getElementById('memDetailReplyList-orderBtn-date');
	const replyListDelYnBtn = document.getElementById('memDetailReplyList-orderBtn-delYn');
	const replyListSortOrder = document.getElementById("memDetailReplySortOrder");

	/* 사용자 접속 통계 셀렉트 요소로 수정 */
	const userOnlineChartDaySel = document.getElementById('userOnlineChartDay');
	const userOnlineChartGenderSel = document.getElementById('userOnlineChartGender');
	const userOnlineChartAgeGroupSel = document.getElementById('userOnlineChartAgeGroup');

	/* 페이지 방문 통계 셀렉트 요소로 수정 */
	const pageVisitChartDaySel = document.getElementById('pageVisitChartDay');
	const pageVisitChartGenderSel = document.getElementById('pageVisitChartGender');
	const pageVisitChartAgeGroupSel = document.getElementById('pageVisitChartAgeGroup');

	const selector = document.getElementById('tableSelector');
	const table1 = document.getElementById('tableContainer1');
	const table2 = document.getElementById('tableContainer2');
	const table3 = document.getElementById('tableContainer3');

	const searchInput = document.getElementById('search');
	searchInput.addEventListener('keydown', function(e) {
		if (e.code === 'Enter') {
			document.querySelector('.searchUserBtn')?.click();
		}
	})

	userOnlineChartDaySel.addEventListener('change', eventDateRangeSelect);
	userOnlineChartGenderSel.addEventListener('change', userOnlineChart);
	userOnlineChartAgeGroupSel.addEventListener('change', userOnlineChart);

	pageVisitChartDaySel.addEventListener('change', eventDateRangeSelect);
	pageVisitChartGenderSel.addEventListener('change', pageVisitChart);
	pageVisitChartAgeGroupSel.addEventListener('change', pageVisitChart);

	const memberMngBtn = document.getElementById('memberMngBtn');
	const memberChartAllBtn = document.getElementById('memberChartAllBtn');

	const memberMngSpace = document.getElementById('memberMngSpace');
	const memberChartAllSpace = document.getElementById('memberChartAllSpace');

	const topButtons = [memberMngBtn, memberChartAllBtn];

	memberChartAllBtn.classList.add('active');

	topButtons.forEach(button => {
		button.addEventListener('click', () => {
			topButtons.forEach(btn => btn.classList.remove('active'));

			button.classList.add('active');
		});
	});

	memberMngBtn.addEventListener('click', function() {
		memberChartAllSpace.style = "display:none;"
		memberMngSpace.style = "display:block;"
	});

	memberChartAllBtn.addEventListener('click', function() {
		memberMngSpace.style = "display:none;"
		memberChartAllSpace.style = "display:block;"
	});

	replyListSortOrder.addEventListener('click', function() {
		const userId = document.getElementById('mem-id').value;
		if (!userId) {
			showConfirm2("회원을 선택하세요.", "",
				() => {
				}
			);
			return;
		}
	})

	function getBoardUrl(ccId, boardId) {
		let url;
		switch (ccId) {
			case 'G09001': // 청소년 커뮤니티
				url = `/comm/peer/teen/teenDetail.do?boardId=${boardId}`;
				break;
			case 'G09002': // 진로 진학 커뮤니티
				url = `/comm/path/pathDetail.do?boardId=${boardId}`;
				break;
			case 'G09003': // 면접후기 커뮤니티
				url = `/empt/ivfb/interViewFeedback.do?boardId=${boardId}`;
				break;
			case 'G09004': // 이력서 템플릿 게시판
				url = `/cdp/rsm/rsmb/resumeBoardDetail.do?boardId=${boardId}`;
				break;
			case 'G09005': // 스터디 그룹 게시글
				url = `/prg/std/stdGroupDetail.do?stdGroupId=${boardId}`;
				break;
			case 'G09006': // 청년 커뮤니티
				url = `/comm/peer/youth/youthDetail.do?boardId=${boardId}`;
				break;
			default:
				url = `javascript:void(0);`; // 링크가 없는 경우
				break;
		}
		return url;
	}

	replyListSortOrder.addEventListener('change', function(e) {
		const userId = document.getElementById('mem-id').value;
		const currentSortValEl = e.target.closest('.userDetailBtnGroup').querySelector('.public-toggle-button.active');
		switch (currentSortValEl.id) {
			case "memDetailReplyList-orderBtn-id":
				handleReplySortClick('replyId', userId);
				break;
			case "memDetailReplyList-orderBtn-delYn":
				handleReplySortClick('replyDelYn', userId);
				break;
			case "memDetailReplyList-orderBtn-date":
				handleReplySortClick('replyCreatedAt', userId);
				break;
		}
	})

	boardListSortOrder.addEventListener('click', function() {
		const userId = document.getElementById('mem-id').value;
		if (!userId) {
			showConfirm2("회원을 선택하세요.", "",
				() => {
				}
			);
			return;
		}
	})
	boardListSortOrder.addEventListener('change', function(e) {
		const userId = document.getElementById('mem-id').value;
		const currentSortValEl = e.target.closest('.userDetailBtnGroup').querySelector('.public-toggle-button.active');
		switch (currentSortValEl.id) {
			case "memDetailBoardList-orderBtn-id":
				handleBoardSortClick('boardId', userId);
				break;
			case "memDetailBoardList-orderBtn-delYn":
				handleBoardSortClick('boardDelYn', userId);
				break;
			case "memDetailBoardList-orderBtn-date":
				handleBoardSortClick('boardCreatedAt', userId);
				break;
		}
	})

	userListSortOrder.addEventListener('change', function(e) {
		const currentSortValEl = e.target.closest('.userListBtnGroup').querySelector('.public-toggle-button.active');
		switch (currentSortValEl.id) {
			case "userListId":
				handleSortClick('id');
				break;
			case "userListName":
				handleSortClick('name');
				break;
			case "userListEmail":
				handleSortClick('email');
				break;
		}
	})

	selector.addEventListener('change', function() {
		// 모든 테이블을 숨김
		table1.style.display = 'none';
		table2.style.display = 'none';
		table3.style.display = 'none';

		document.getElementById('memDetailBoardListPagenationSpace').style.display = 'none';
		document.getElementById('memDetailReplyListPagenationSpace').style.display = 'none';


		// 선택된 옵션의 값에 따라 해당 테이블을 표시
		if (this.value === 'table1') {
			const userId = document.getElementById('mem-id').value;
			userDetailBoardList(userId);
			table1.style.display = 'block';
			document.getElementById('memDetailBoardListPagenationSpace').style.display = 'block'; // 게시글 페이지네이션 표시
		} else if (this.value === 'table2') {
			const userId = document.getElementById('mem-id').value;
			const replyTbody = document.getElementById('userDetailReplyList');
			replyTbody.dataset.sortBy = 'replyId';
			replyTbody.dataset.sortOrder = 'asc';
			const replyListIdBtn = document.getElementById('memDetailReplyList-orderBtn-id');
			if (replyListIdBtn) {
				setActiveButton(replyListIdBtn);
			}
			userDetailReplyList(userId);
			table2.style.display = 'block';
			document.getElementById('memDetailReplyListPagenationSpace').style.display = 'block'; // 댓글 페이지네이션 표시
		} else if (this.value === 'table3') {
			table3.style.display = 'block';
		}
	});

	// 회원 리스트 정렬 이벤트 리스너
	userListIdBtn.addEventListener('click', function() {
		handleSortClick("id");
		setActiveButton(this);
	})
	userListNameBtn.addEventListener('click', function() {
		handleSortClick("name");
		setActiveButton(this);
	})
	userListEmailBtn.addEventListener('click', function() {
		handleSortClick("email");
		setActiveButton(this);
	})

	// 게시글 목록 정렬 이벤트 리스너
	if (boardListIdBtn) {
		boardListIdBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleBoardSortClick("boardId", userId, this);
		});
	}

	if (boardListdelYnBtn) {
		boardListdelYnBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleBoardSortClick("boardDelYn", userId, this);
		});
	}

	if (boardListDateBtn) {
		boardListDateBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleBoardSortClick("boardCreatedAt", userId, this);
		});
	}

	// 댓글 목록 정렬 이벤트 리스너 추가
	if (replyListIdBtn) {
		replyListIdBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleReplySortClick("replyId", userId, this);
		});
	}

	if (replyListDelYnBtn) {
		replyListDelYnBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleReplySortClick("replyDelYn", userId, this);
		});
	}

	if (replyListDateBtn) {
		replyListDateBtn.addEventListener('click', function() {
			const userId = document.getElementById('mem-id').value;
			if (userId == null || userId == "") {
				showConfirm2("회원을 선택하세요.", "",
					() => {
					}
				);
				return;
			}
			handleReplySortClick("replyCreatedAt", userId, this);
		});
	}


	// 게시글 분류 필터링 이벤트 리스너 추가
	const boardListCategoryFilter = document.getElementById('boardListCategory');
	if (boardListCategoryFilter) {
		boardListCategoryFilter.addEventListener('change', function() {
			const userId = document.getElementById('mem-id').value;
			const category = this.value;
			// 카테고리 필터 변경 시 첫 페이지로 이동하여 목록을 다시 불러옴
			const boardTbody = document.getElementById('userDetailBoardList');
			const sortBy = boardTbody.dataset.sortBy;
			const sortOrder = boardTbody.dataset.sortOrder;
			userDetailBoardList(userId, 1, sortBy, sortOrder, category);
		});
	}

	// 정렬 버튼 활성화/비활성화 함수
	function setActiveButton(element) {
		const parent = element.parentElement;
		const buttons = parent.querySelectorAll('.public-toggle-button');
		buttons.forEach(btn => btn.classList.remove('active'));
		element.classList.add('active');
	}

	// 유저 목록 정렬 처리
	function handleSortClick(sortBy) {

		const sortOrder = document.getElementById("userListSortOrder").value;

		// 2. handleSortClick에서 fetchUserList를 호출할 때 inFilter 값을 가져와서 전달
		const userListInFilter = document.getElementById('userListStatus').value;
		fetchUserList(currentPage, sortBy, sortOrder, userListInFilter);
	}

	// 게시글 목록 정렬 처리
	function handleBoardSortClick(sortBy, userId, element) {
		const boardTbody = document.getElementById('userDetailBoardList');
		const boardSortOrder = document.getElementById('memDetailSortOrder').value;

		boardTbody.dataset.sortBy = sortBy;
		boardTbody.dataset.sortOrder = boardSortOrder;

		if (element) {
			setActiveButton(element);
		}
		const category = document.getElementById('boardListCategory').value;
		const sortOrder = boardTbody.dataset.sortOrder;
		userDetailBoardList(userId, 1, sortBy, sortOrder, category);
	}

	// 댓글 목록 정렬 처리 함수
	function handleReplySortClick(sortBy, userId, element) {
		const replyTbody = document.getElementById('userDetailReplyList');
		const replySortOrder = document.getElementById('memDetailReplySortOrder').value;

		replyTbody.dataset.sortBy = sortBy;
		replyTbody.dataset.sortOrder = replySortOrder;
		if (element) {
			setActiveButton(element);
		}
		const sortOrder = replyTbody.dataset.sortOrder;
		userDetailReplyList(userId, 1, sortBy, sortOrder);
	}

	function profileUploadFn() {
		const profileUpload = document.getElementById('profileUpload');
		const profileImage = document.querySelector('.profile-wrapper img');

		profileUpload.addEventListener('change', function(event) {
			const file = event.target.files[0];
			if (file.type !== "image/jpeg" && file.type !== "image/png") {
				showConfirm2("파일은 png 또는 jpg 형식만 가능합니다.", "",
					() => {
					}
				);
				return;
			}
			if (!file) {
				return;
			}
			const reader = new FileReader();
			reader.onload = function(e) {
				profileImage.src = e.target.result;
			};
			reader.readAsDataURL(file);
		});
	}

	// 3. fetchUserList 함수의 inFilter 파라미터를 추가하고, 함수 시작 시점에 값을 가져오도록 수정
	function fetchUserList(page = 1, sortBy = '', sortOrder = 'asc', inFilter = '') {
		currentPage = page;

		const pageSize = 10;
		const keyword = document.querySelector('input[name="keyword"]').value;
		const status = document.querySelector('select[name="status"]').value;
		// fetchUserList 함수 내에서 userListStatus의 최신 값을 가져오도록 수정
		const userListInFilter = document.getElementById('userListStatus').value;

		axios.get('/admin/umg/getMemberActivityList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				status: status, // 이 status는 activityFilter의 값일 수 있으므로 확인 필요
				sortBy: sortBy,
				sortOrder: sortOrder,
				inFilter: userListInFilter // 수정된 inFilter 값을 전달
			}
		})
			.then(({
				data
			}) => {
				// 페이지 정보
				document.getElementById("memListPage").innerText = data.currentPage;
				document.getElementById("memListTotalPage").innerText = data.totalPages? data.totalPages :  1;

				const countEl = document.getElementById('userList-count');
				if (countEl) countEl.textContent = parseInt(data.total, 10).toLocaleString();
				const listEl = document.getElementById('userList');
				if (!listEl) return;
				if (data.content.length < 1 && keyword.trim() !== '') {
					listEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">검색 결과를 찾을 수 없습니다.</td></tr>`;
				} else {
					const rows = data.content.map(item => `
					<tr>
						<td style="display:none;">${item.memId}</td>
						<td>${item.rnum}</td>
						<td>${item.memName}</td>
						<td>${item.memEmail}</td>
						<td>${renderStatus(item.activityStatus)}</td>
					</tr>`).join('');
					listEl.innerHTML = rows;
				}
				renderPagination(data);
			})
			.catch(err => console.error('유저 목록 조회 중 에러:', err));
	}

	function renderStatus(status) {
		let statusClass;
		let statusText;

		switch (status) {
			case 'ONLINE':
				statusClass = 'dot-status-green';
				statusText = '활동중';
				break;
			case 'OFFLINE':
				statusClass = 'dot-status-gray';
				statusText = '비활동';
				break;
			case 'SUSPENDED':
				statusClass = 'dot-status-red';
				statusText = '정지상태';
				break;
			case 'NEVER_LOGIN':
				statusClass = 'dot-status-gray';
				statusText = '비활동';
				break;
			default:
				statusClass = '';
				statusText = '';
		}

		return `
	        <span class="dot-status ${statusClass}"></span>
	        ${statusText}
	    `;
	}

	// 기존 유저 목록 페이지네이션 함수
	function renderPagination({
		startPage,
		endPage,
		currentPage,
		totalPages
	}) {
		let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
		for (let p = startPage; p <= endPage; p++) {
			if(totalPages == 0) p =1;
			html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}
		html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
		const footer = document.querySelector('.panel-footer.pagination');
		if (footer) footer.innerHTML = html;
	}

	userListPaginationContainer = document.querySelector('.panel-footer.pagination');
	if (userListPaginationContainer) {
		userListPaginationContainer.addEventListener('click', e => {
			const link = e.target.closest('a[data-page]');
			if (!link || link.parentElement.classList.contains('disabled')) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			const page = parseInt(link.dataset.page, 10);
			if (!isNaN(page) && page > 0) {
				const userListInFilter = document.getElementById('userListStatus').value;
				fetchUserList(page, currentSortBy, currentSortOrder, userListInFilter);
			}
		});
	}

	// boardList의 페이지네이션을 처리하는 함수
	function renderBoardListPagination({
		startPage,
		endPage,
		currentPage,
		totalPages
	}) {
		let html = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
		for (let p = startPage; p <= endPage; p++) {
			html += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
		}
		html += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
		const footer = document.getElementById('memDetailBoardListPagenation');
		if (footer) footer.innerHTML = html;
	}

	// 게시글 페이지네이션 이벤트 리스너를 위한 변수
	let boardListPaginationContainer;

	function formatDateMMDD(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1)
		const dd = String(d.getDate())
		const fullYear = String(d.getFullYear());
		return `${fullYear}-${mm}-${dd}`;
	}

	function formatDate(iso) {
		const d = new Date(iso);
		const mm = String(d.getMonth() + 1);
		const dd = String(d.getDate());
		const fullYear = String(d.getFullYear());
		return `${fullYear}. ${mm}. ${dd}.`;
	}

	function convertLoginType(code) {
		switch (code) {
			case 'G33001':
				return '일반';
			case 'G33002':
				return '카카오';
			case 'G33003':
				return '네이버';
			default:
				return code;
		}
	}

	function memberGender(code) {
		switch (code) {
			case 'G11001':
				return '남자';
			case 'G11002':
				return '여자';
			default:
				return code;
		}
	}

	searchBtn = document.querySelector(".btn-save");
	if (searchBtn) {
		searchBtn.addEventListener("click", function() {
			window.currentPage = 1;
			fetchUserList(1);
		});
	}

	document.getElementById("userList").addEventListener("click", function(e) {
		const tr = e.target.closest("tr");
		if (!tr) return;
		const tds = tr.querySelectorAll("td");
		const id = tds[0].textContent.trim();
		let formData = new FormData();
		formData.set("id", id);

		userDetail(formData);

		// 게시글 목록을 불러올 때 정렬 상태를 초기화하고 첫 페이지로 설정
		const boardListIdBtn = document.getElementById('memDetailBoardList-orderBtn-id');
		setActiveButton(boardListIdBtn);
		const boardTbody = document.getElementById('userDetailBoardList');
		boardTbody.dataset.sortBy = 'boardId';
		boardTbody.dataset.sortOrder = 'asc';
		const category = document.getElementById('boardListCategory').value;
		userDetailBoardList(id, 1, 'boardId', 'asc', category);

		// 댓글 목록을 불러올 때 정렬 상태를 초기화하고 첫 페이지로 설정
		const replyTbody = document.getElementById('userDetailReplyList');
		replyTbody.dataset.sortBy = 'replyId';
		replyTbody.dataset.sortOrder = 'asc';
		const replyListIdBtn = document.getElementById('memDetailReplyList-orderBtn-id');
		if (replyListIdBtn) {
			setActiveButton(replyListIdBtn);
		}
		userDetailReplyList(id, 1, 'replyId', 'asc');

		// ▼▼▼ 이 부분을 추가해주세요 ▼▼▼
		if (typeof createPersonActivityChart === 'function') {
			document.getElementById('personChartDay').value = 'daily'; // 필터 기본값 설정
			createPersonActivityChart(id, 'daily');
		}
		// ▲▲▲ 여기까지 ▲▲▲
	});

	const personChartDaySel = document.getElementById('personChartDay');
	if (personChartDaySel) {
		personChartDaySel.addEventListener('change', handlePersonChartFilterChange);
	}

	function userDetail(formData) {
		axios.post('/admin/umg/getMemberDetail.do', formData)
			.then(res => {

				const {
					memberDetail,
					filePath,
					countVO,
					interestCn,
					mockInterviewCount,
					aiFeedbackCount,
					counselingCompletedCount,
					worldcupCount,
					roadmapCount,
					psychTestCount,
					recentLoginDate,
					recentPenaltyDate
				} = res.data;

				const profileImgEl = document.getElementById('member-profile-img');
				profileImgEl.src = filePath ? filePath : '/images/defaultProfileImg.png';
				document.getElementById('mem-id').value = memberDetail.memId || '-';
				document.getElementById('mem-name').value = memberDetail.memName || '-';
				document.getElementById('mem-nickname').value = memberDetail.memNickname || '-';
				document.getElementById('mem-email').value = memberDetail.memEmail || '-';
				document.getElementById('mem-phone').value = memberDetail.memPhoneNumber || '-';
				document.getElementById('mem-gen').value = memberGender(memberDetail.memGen) || '-';
				document.getElementById('mem-birth').value = formatDate(memberDetail.memBirth) || '-';
				document.getElementById('mem-logType').value = convertLoginType(memberDetail.loginType) || '-';
				const selectElement = document.getElementById("mem-role");
				for (let i = 0; i < selectElement.options.length; i++) {
					if (selectElement.options[i].value === memberDetail.memRole) {
						selectElement.options[i].selected = true;
						break;
					}
				}
				document.getElementById('mem-warn-count').value = `${countVO.warnCount}회`;
				document.getElementById('mem-ban-count').value = `${countVO.banCount}회`;
				const interests = interestCn && interestCn.length > 0 ? interestCn.join(', ') : '없음';
				document.getElementById('mem-interests').innerHTML = `<span class="keyword-badge">${interests}</span>`;

				// 새로운 데이터 항목 반영
				document.getElementById('mockInterviewCount').textContent = mockInterviewCount != null ? `${mockInterviewCount}회` : '0회';
				document.getElementById('aiFeedbackCount').textContent = aiFeedbackCount != null ? `${aiFeedbackCount}회` : '0회';
				document.getElementById('counselingCompletedCount').textContent = counselingCompletedCount != null ? `${counselingCompletedCount}회` : '0회';
				document.getElementById('worldcupCount').textContent = worldcupCount != null ? `${worldcupCount}회` : '0회';
				document.getElementById('roadmapCount').textContent = roadmapCount != null ? `${roadmapCount}회` : '0회';
				document.getElementById('psychTestCount').textContent = psychTestCount != null ? `${psychTestCount}회` : '0회';

				// 날짜 항목은 포맷 함수 사용
				const recentLoginDateEl = document.getElementById('recentLoginDate');
				if (recentLoginDateEl) {
					recentLoginDateEl.innerHTML = `<i class="fa-regular fa-clock"></i>&nbsp;` + (recentLoginDate ? formatDate(recentLoginDate) : '-');
				}

				const recentPenaltyDateEl = document.getElementById('recentPenaltyDate');
				if (recentPenaltyDateEl) {
					recentPenaltyDateEl.innerHTML = `<i class="fa-regular fa-clock"></i>&nbsp;` + (recentPenaltyDate ? formatDate(recentPenaltyDate) : '-');
				}

				fetchPageLogList();

			})
			.catch(error => {
				console.error('회원 정보 불러오기 실패', error);
			});
	}

	function addBtnFn() {
		const addButton = document.querySelector('.add-btn');
		addButton.addEventListener('click', function() {
			const formData = new FormData();
			const email = document.getElementById('insertEmail').value.trim();
			const name = document.getElementById('insertName').value.trim();
			const nickname = document.getElementById('insertNickname').value.trim();
			const password = document.getElementById('insertPassword').value;
			const phone = document.getElementById('insertPhone').value.trim();
			const role = document.getElementById('insertRole').value.trim();
			const birth = document.getElementById('insertBirth').value.trim();
			const gender = document.getElementById('insertGen').value.trim();
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
			const phoneRegex = /^010-\d{4}-\d{4}$/;
			const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
			const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
			if (!emailRegex.test(email)) {
				showConfirm2("올바른 이메일 형식을 입력해주세요.", "",
					() => {
					}
				);
				return;
			}
			if (!nameRegex.test(name)) {
				showConfirm2("닉네임을 입력해주세요.", "",
					() => {
					}
				);
				return;
			}
			if (!nickname) {
				showConfirm2("닉네임을 입력해주세요.", "",
					() => {
					}
				);
				return;
			}
			if (!nicknameRegex.test(nickname)) {
				showConfirm2("닉네임은 한글, 영문, 숫자 조합", "2~10자로 입력해주세요.",
					() => {
					}
				);
				return;
			}
			if (!passwordRegex.test(password)) {
				showConfirm2("비밀번호는 영문, 숫자, 특수문자로", "8~16자로 입력해주세요.",
					() => {
					}
				);
				return;
			}
			if (!phoneRegex.test(phone)) {
				showConfirm2("010-XXXX-XXXX 형식으로 입력해주세요.", "",
					() => {
					}
				);
				return;
			}
			formData.append('memRole', role);
			formData.append('memName', name);
			formData.append('memNickname', nickname);
			formData.append('memEmail', email);
			formData.append('memPhoneNumber', phone);
			formData.append('memGen', gender);
			formData.append('memBirth', birth);
			formData.append('memPassword', password);
			const profileFile = document.getElementById('profileUpload').files[0];
			if (profileFile) {
				if (profileFile.type !== "image/jpeg" && profileFile.type !== "image/png") {
					showConfirm2("파일은 png 또는 jpg 형식만 가능합니다.", "",
						() => {
						}
					);
					return;
				}
			}
			if (profileFile) {
				formData.append('profileImage', profileFile);
			} else {
				formData.append('profileImage', null);
			}
			axios.post('/admin/umg/insertUserByAdmin.do', formData).then(res => {
				if (res.data == 'success') {
					showConfirm2("유저 등록 성공", "",
						() => {
						}
					);
				} else {
					showConfirm2("등록 중 오류 발생", "",
						() => {
						}
					);
				}
			})
		});
	}


	function modifyFn() {
		const modifyButton = document.getElementById('userModify');
		modifyButton.addEventListener('click', function() {
			showConfirm("정말로 수정하시겠습니까?", "",
				() => {
					const memId = document.getElementById('mem-id').value;
					if (memId == null || memId == "") {
						showConfirm2("수정할 대상이 없습니다.", "",
							() => {
							}
						);
						return;
					}
					const memName = document.getElementById('mem-name').value;
					const memNickname = document.getElementById('mem-nickname').value;
					const memEmail = document.getElementById('mem-email').value;
					const memPhone = document.getElementById('mem-phone').value;
					const memRole = document.getElementById('mem-role').value;
					let formData = new FormData();
					formData.set("memId", memId);
					formData.set("memName", memName);
					formData.set("memNickname", memNickname);
					formData.set("memRole", memRole);
					axios.post('/admin/umg/updateMemberInfo.do', formData)
						.then(res => {
							if (res.data != 1) {
								showConfirm2("수정 실패", "",
									() => {
									}
								);
							} else {
								let formId = new FormData();
								formId.set("id", memId);
								userDetail(formId);
								fetchUserList();
								showConfirm2("수정 완료", "",
									() => {
									}
								);
							}
						})
				},
				() => {

				}
			);
		})
	}


	function emailDbCkFn() {
		const emailDoubleCheckBtn = document.getElementById('emailDoubleCheck');
		emailDoubleCheckBtn.addEventListener('click', function() {
			const email = document.getElementById('insertEmail').value;
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			if (email == null || email == "") {
				showConfirm2("이메일을 입력하세요.", "",
					() => {
					}
				);
				return;
			} else if (!emailRegex.test(email)) {
				showConfirm2("올바른 이메일 형식을 입력하세요.", "",
					() => {
					}
				);
				return;
			}
			let formData = new FormData();
			formData.set("email", email);
			axios.post('/admin/umg/selectEmailByAdmin.do', formData)
				.then(res => {
					showConfirm2(res.data, "",
						() => {
						}
					);
				})
		})
	}


	function nicknameDbCkFn() {
		const nicknameDoubleCheckBtn = document.getElementById('nicknameDoubleCheck');
		nicknameDoubleCheckBtn.addEventListener('click', function() {
			const nickname = document.getElementById('insertNickname').value;
			const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
			if (nickname == null || nickname == "") {
				showConfirm2("닉네임을 입력하세요.", "",
					() => {
					}
				);
				return;
			} else if (!nicknameRegex.test(nickname)) {
				showConfirm2("닉네임은 한글, 영문, 숫자 조합", "2~10자로 입력해주세요.",
					() => {
					}
				);
				return;
			}
			let formData = new FormData();
			formData.set("nickname", nickname);
			axios.post('/admin/umg/selectNicknameByAdmin.do', formData)
				.then(res => {
					showConfirm2(res.data, "",
						() => {
						}
					);
				})
		})
	}

	function searchUserFn() {
		const searchCnsBtn = document.querySelector(".searchUserBtn");
		if (searchCnsBtn) {
			searchCnsBtn.addEventListener("click", function() {
				window.currentPage = 1;
				fetchUserList(1);
			});
		}
	}


	// 게시글 분류 코드를 한글로 변환하는 함수
	function convertCcIdToCategory(ccId) {
		switch (ccId) {
			case 'G09001':
				return '청소년 커뮤니티';
			case 'G09002':
				return '진로 진학 커뮤니티';
			case 'G09003':
				return '면접후기 커뮤니티';
			case 'G09004':
				return '이력서 템플릿 게시판';
			case 'G09005':
				return '스터디 그룹 게시글';
			case 'G09006':
				return '청년 커뮤니티';
			default:
				return ccId;
		}
	}

	// 삭제 여부(Y/N)에 따라 색상과 텍스트를 반환하는 함수
	function renderBoardStatus(boardDelYn) {
		if (boardDelYn === 'Y') {
			return `<span style="color: red; text-align: center;">삭제</span>`;
		} else if (boardDelYn === 'N') {
			return `<span style="color: green; text-align: center;">게시</span>`;
		}
		return boardDelYn; // Y, N이 아닌 경우 원본 값 반환
	}

	// 댓글 삭제 여부(Y/N)에 따라 색상과 텍스트를 반환하는 함수
	function renderReplyStatus(replyDelYn) {
		if (replyDelYn === 'Y') {
			return `<span style="color: red;">삭제</span>`;
		} else if (replyDelYn === 'N') {
			return `<span style="color: green; ">게시</span>`;
		}
		return replyDelYn;
	}

	// 사용자 게시글 목록을 가져와 테이블에 렌더링하고 페이지네이션을 처리하는 함수
	function userDetailBoardList(userId, page = 1, sortBy = 'boardId', sortOrder = 'asc', category = '') {
		const tbodyEl = document.getElementById('userDetailBoardList');
		if (userId == null || userId == '') {
			tbodyEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">선택된 회원이 없습니다.</td></tr>`;
			return;
		}

		const pageSize = 5;

		axios.get(`/admin/umg/getMemberDetailBoardList.do`, {
			params: {
				currentPage: page,
				size: pageSize,
				userId: userId,
				sortBy: sortBy,
				sortOrder: sortOrder,
				ccId: category
			}
		}).then(res => {
			const {
				content,
				totalPages,
				currentPage,
				startPage,
				endPage
			} = res.data;

			const tbodyEl = document.getElementById('userDetailBoardList');
			const boardPaginationEl = document.getElementById('memDetailBoardListPagenation');

			if (!tbodyEl) {
				console.error('Error: tbody element with ID "userDetailBoardList" not found.');
				return;
			}

			// 테이블 내용 렌더링
			if (content && content.length > 0) {
				const rows = content.map(item => {
					// getBoardUrl 함수를 사용하여 URL을 가져옵니다.
					const boardUrl = getBoardUrl(item.ccId, item.boardId);

					// boardUrl이 있는 경우에만 onclick 속성을 추가합니다.
					const onClickHandler = boardUrl ? `onclick="window.open('${boardUrl}', '_blank')"` : '';
					const cursorStyle = boardUrl ? `style="cursor:pointer;"` : '';

					return `
			            <tr ${onClickHandler} ${cursorStyle}>
			                <td>${item.rnum}</td>
			                <td>${convertCcIdToCategory(item.ccId)}</td>
			                <td class="td-textOverflow">${item.boardTitle}</td>
			                <td style="text-align:right">${item.boardCnt}</td>
			                <td>${formatDate(item.boardCreatedAt)}</td>
			                <td>${renderBoardStatus(item.boardDelYn)}</td>
			            </tr>
			        `;
				}).join('');
				tbodyEl.innerHTML = rows;
			} else {
				tbodyEl.innerHTML = `<tr><td colspan='6' style="text-align: center;">작성한 게시글이 없습니다.</td></tr>`;
			}

			// 페이지네이션 렌더링
			if (boardPaginationEl) {
				let paginationHtml = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
				for (let p = startPage; p <= endPage; p++) {
					if(totalPages == 0) p=1;
					paginationHtml += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
				}
				paginationHtml += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
				boardPaginationEl.innerHTML = paginationHtml;

				// 기존 이벤트 리스너 제거
				const oldListener = boardPaginationEl.onclick;
				if (oldListener) {
					boardPaginationEl.removeEventListener('click', oldListener);
				}

				// 새로운 이벤트 리스너 추가 (once 옵션 제거)
				const newListener = e => {
					e.preventDefault();
					const link = e.target.closest('a[data-page]');
					if (link && !link.classList.contains('disabled')) {
						const newPage = parseInt(link.dataset.page, 10);
						if (!isNaN(newPage) && newPage > 0) {
							const category = document.getElementById('boardListCategory').value;
							// 기존 정렬 상태를 유지하도록 변경
							const boardTbody = document.getElementById('userDetailBoardList');
							const sortBy = boardTbody.dataset.sortBy;
							const sortOrder = boardTbody.dataset.sortOrder;
							userDetailBoardList(userId, newPage, sortBy, sortOrder, category);
						}
					}
				};

				boardPaginationEl.addEventListener('click', newListener);
				boardPaginationEl.onclick = newListener; // 레거시 브라우저 호환성을 위한 대체
			}

		}).catch(err => {
			console.error('게시글 목록 조회 중 에러:', err);
			const tbodyEl = document.getElementById('userDetailBoardList');
			if (tbodyEl) {
				tbodyEl.innerHTML = `<tr><td colspan='5' style="text-align: center;">데이터를 불러오는데 실패했습니다.</td></tr>`;
			}
		});
	}

	function truncateTitle(title) {
		const maxLength = 20;
		if (title.length > maxLength) {
			return title.substring(0, maxLength) + '...';
		}
		return title;
	}

	function userDetailReplyList(userId, page = 1, sortBy = 'replyId', sortOrder = 'asc') {

		if (userId == null || userId == '') {
			const tbodyEl = document.getElementById('userDetailReplyList');
			tbodyEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">선택된 회원이 없습니다.</td></tr>`;
			return;
		}

		const pageSize = 5;

		// 댓글 목록을 가져오는 API 엔드포인트에 요청을 보냅니다.
		// 쿼리 파라미터는 필요에 따라 수정하세요.
		axios.get(`/admin/umg/getMemberDetailReplyList.do`, {
			params: {
				currentPage: page,
				size: pageSize,
				userId: userId,
				sortBy: sortBy,
				sortOrder: sortOrder
			}
		}).then(res => {
			const {
				content,
				totalPages,
				currentPage,
				startPage,
				endPage
			} = res.data;

			const tbodyEl = document.getElementById('userDetailReplyList');
			const replyPaginationEl = document.getElementById('memDetailReplyListPagenation');

			if (!tbodyEl) {
				console.error('Error: tbody element with ID "userDetailReplyList" not found.');
				return;
			}

			// 테이블 내용 렌더링
			if (content && content.length > 0) {
				const rows = content.map(item => `
	                <tr>
	                    <td>${item.rnum}</td>
	                    <td>${convertCcIdToCategory(item.ccId)}</td>
	                    <td>${formatDate(item.replyCreatedAt)}</td>
	                    <td>${renderReplyStatus(item.replyDelYn)}</td>
	                </tr>
	            `).join('');
				tbodyEl.innerHTML = rows;
			} else {
				tbodyEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">작성한 댓글이 없습니다.</td></tr>`;
			}

			// 페이지네이션 렌더링
			if (replyPaginationEl) {
				let paginationHtml = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
				for (let p = startPage; p <= endPage; p++) {
					paginationHtml += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
				}
				paginationHtml += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;
				replyPaginationEl.innerHTML = paginationHtml;

				// 기존 이벤트 리스너를 제거하고 새로운 이벤트 리스너를 추가
				const newListener = e => {
					e.preventDefault();
					const link = e.target.closest('a[data-page]');
					if (link && !link.classList.contains('disabled')) {
						const newPage = parseInt(link.dataset.page, 10);
						if (!isNaN(newPage) && newPage > 0) {
							// 기존 정렬 상태를 유지하도록 변경
							const replyTbody = document.getElementById('userDetailReplyList');
							const sortBy = replyTbody.dataset.sortBy;
							const sortOrder = replyTbody.dataset.sortOrder;
							userDetailReplyList(userId, newPage, sortBy, sortOrder);
						}
					}
				};
				// 이전에 추가된 이벤트 리스너를 식별할 수 있다면 제거 후 추가하는 로직이 더 안전합니다.
				replyPaginationEl.addEventListener('click', newListener, { once: true });
			}

		}).catch(err => {
			console.error('댓글 목록 조회 중 에러:', err);
			const tbodyEl = document.getElementById('userDetailReplyList');
			if (tbodyEl) {
				tbodyEl.innerHTML = `<tr><td colspan='4' style="text-align: center;">데이터를 불러오는데 실패했습니다.</td></tr>`;
			}
		});
	}

	// 숫자가 변경될 때 애니메이션 효과를 주는 함수
	function animateNumberChange(elementId, newValue) {
		const element = document.getElementById(elementId);
		if (!element) return;

		const currentValue = element.textContent.replace(/[^0-9.]/g, ''); // 숫자만 추출
		if (currentValue !== String(newValue)) {
			// 클래스를 토글하여 애니메이션 효과 적용
			element.classList.add('number-change');
			setTimeout(() => {
				element.textContent = newValue;
				element.classList.remove('number-change');
			}, 300); // CSS transition 시간과 일치
		}
	}

	// 분 단위의 숫자를 00:00 형식으로 변환하는 함수
	function formatMinutesToTime(minutes) {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		const formattedHours = String(hours).padStart(2, '0');
		const formattedMinutes = String(remainingMinutes).padStart(2, '0');
		return `${formattedHours}:${formattedMinutes}`;
	}

	function getRateStatus(status) {
		let symbol = '';
		let className = '';
		switch (status) {
			case 'increase':
				symbol = '▲';
				className = 'public-span-increase';
				break;
			case 'decrease':
				symbol = '▼';
				className = 'public-span-decrease';
				break;
			case 'equal':
				symbol = '-';
				className = 'public-span-equal';
				break;
			default:
				symbol = 'NEW';
				className = 'public-span-increase';
		}
		return { symbol, className };
	}


	// 일일 통계 데이터를 가져와서 HTML에 반영하는 함수
	function fetchDailyStats() {
		axios.get('/admin/umg/getDailyUserStats.do')
			.then(res => {
				const {
					dailyActiveUsers,
					dailyActiveUsersStatus,
					dailyActiveUsersRate,
					avgUsageTimeMinutes,
					avgUsageTimeStatus,
					avgUsageTimeRate,
					dailySignUpUsers,
					dailySignUpUsersRate,
					dailySignUpUsersStatus,
					monthlyWithdrawalUsers,
					monthlyWithdrawalUsersRate,
					monthlyWithdrawalUsersStatus
				} = res.data;

				// 일일 사용자 현황
				const dailyUsersCountEl = document.getElementById('dailyActiveUsersCount');
				if (dailyUsersCountEl) {
					animateNumberChange('dailyActiveUsersCount', dailyActiveUsers);
				}
				const dailyUsersRateEl = document.getElementById('dailyActiveUsersRate');
				if (dailyUsersRateEl) {
					const { symbol, className } = getRateStatus(dailyActiveUsersStatus);
					// NEW일 경우, 비율(rate)은 표시하지 않음
					if (symbol === 'NEW') {
						dailyUsersRateEl.textContent = `${symbol}`;
					} else {
						dailyUsersRateEl.textContent = `${symbol} ${dailyActiveUsersRate}%`;
					}
					dailyUsersRateEl.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');
					dailyUsersRateEl.classList.add(className);
				}

				// 신규 가입자 수
				const dailySignUpCountEl = document.getElementById('dailySignUpUsersCount');
				if (dailySignUpCountEl) {
					animateNumberChange('dailySignUpUsersCount', dailySignUpUsers);
				}
				const dailySignUpRateEl = document.getElementById('dailySignUpUsersRate');
				if (dailySignUpRateEl) {
					const { symbol, className } = getRateStatus(dailySignUpUsersStatus);
					// NEW일 경우, 비율(rate)은 표시하지 않음
					if (symbol === 'NEW') {
						dailySignUpRateEl.textContent = `${symbol}`;
					} else {
						dailySignUpRateEl.textContent = `${symbol} ${dailySignUpUsersRate}%`;
					}
					dailySignUpRateEl.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');
					dailySignUpRateEl.classList.add(className);
				}

				// 일일 평균 홈페이지 이용시간
				const avgTimeCountEl = document.getElementById('avgUsageTimeCount');
				if (avgTimeCountEl) {
					animateNumberChange('avgUsageTimeCount', formatMinutesToTime(avgUsageTimeMinutes));
				}
				const avgTimeRateEl = document.getElementById('avgUsageTimeRate');
				if (avgTimeRateEl) {
					const { symbol, className } = getRateStatus(avgUsageTimeStatus);
					// NEW일 경우, 비율(rate)은 표시하지 않음
					if (symbol === 'NEW') {
						avgTimeRateEl.textContent = `${symbol}`;
					} else {
						avgTimeRateEl.textContent = `${symbol} ${avgUsageTimeRate}%`;
					}
					avgTimeRateEl.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');
					avgTimeRateEl.classList.add(className);
				}

				// 월간 사용자 이탈수
				const monthlyWithdrawalCountEl = document.getElementById('monthlyWithdrawalUsersCount');
				if (monthlyWithdrawalCountEl) {
					animateNumberChange('monthlyWithdrawalUsersCount', monthlyWithdrawalUsers);
				}
				const monthlyWithdrawalRateEl = document.getElementById('monthlyWithdrawalUsersRate');
				if (monthlyWithdrawalRateEl) {
					const { symbol, className } = getRateStatus(monthlyWithdrawalUsersStatus);
					// NEW일 경우, 비율(rate)은 표시하지 않음
					if (symbol === 'NEW') {
						monthlyWithdrawalRateEl.textContent = `${symbol}`;
					} else {
						monthlyWithdrawalRateEl.textContent = `${symbol} ${monthlyWithdrawalUsersRate}%`;
					}
					monthlyWithdrawalRateEl.classList.remove('public-span-increase', 'public-span-decrease', 'public-span-equal');
					monthlyWithdrawalRateEl.classList.add(className);
					monthlyWithdrawalRateEl.classList.add('color-white');
				}
			})
			.catch(err => {
				console.error('일일 통계 데이터 조회 중 에러:', err);
			});
	}

	const userListStatusFilter = document.getElementById('userListStatus');
	if (userListStatusFilter) {
		userListStatusFilter.addEventListener('change', function() {
			const inFilter = this.value;
			fetchUserList(1, currentSortBy, currentSortOrder, inFilter);
		});
	}

	// 날짜 형식 변환을 위한 헬퍼 함수
	function formatDailyDate(isoString) {
		const date = new Date(isoString);
		return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
	}

	function formatMonthlyDate(isoString) {
		const date = new Date(isoString);
		return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`;
	}

	// userOnlineChart 함수를 재정의하여 공통 변수를 사용하도록 수정
	// memberManagement.js
	// memberManagement.js
	function userOnlineChart(selectUserInquiry = "daily", chartRange = "", startDate = "", endDate = "", gender = "") {
		const ctx = document.getElementById('userOnlineChartCanvas').getContext('2d');

		let dateValue = document.getElementById("userOnlineChartDay").value;
		const genderValue = document.getElementById("userOnlineChartGender").value;
		const ageGroupValue = document.getElementById("userOnlineChartAgeGroup").value;
		const startDateValue = document.getElementById("userOnlineChartStartDay").value;
		const endDateValue = document.getElementById("userOnlineChartEndDay").value;

		if (dateValue == 'selectDays' && !startDateValue) {
			document.getElementById("userOnlineChartDay").value = "daily";
			dateValue = "daily";
		}

		const params = {
			selectUserInquiry: dateValue || selectUserInquiry,
			startDate: startDateValue || startDate,
			endDate: endDateValue || endDate,
			gender: genderValue || gender,
			ageGroup: ageGroupValue || '',
		}

		if (userOnlineChartInstance) {
			userOnlineChartInstance.destroy();
		}

		axios.get('/admin/las/userInquiry.do', { params })
		    .then(res => {
		        const responseData = res.data;

		        // 데이터셋 분리 및 라벨 생성
		        let labels;
		        let currentPeriodData;
		        let previousPeriodData;
		        let currentLabel;
		        let previousLabel;

		        // dateValue에 따라 데이터 처리 로직 분기
		        switch (dateValue) {
		            case 'monthly':
		                currentPeriodData = responseData.filter(item => item.periodType === 'THIS_YEAR');
		                previousPeriodData = responseData.filter(item => item.periodType === 'LAST_YEAR');
		                labels = currentPeriodData.map(item => formatMonthOnly(item.loginDate));
		                currentLabel = '올해 접속자 수';
		                previousLabel = '작년 접속자 수';
		                break;
		            case 'selectDays':
		                currentPeriodData = responseData.filter(item => item.periodType === 'THIS_YEAR');
		                previousPeriodData = responseData.filter(item => item.periodType === 'LAST_YEAR');

		                // 라벨을 위해 모든 날짜를 합치고 정렬
		                let allDates = Array.from(new Set(currentPeriodData.map(item => item.loginDate)
		                    .concat(previousPeriodData.map(item => item.loginDate))));
		                allDates.sort();

		                labels = allDates.map(item => formatFullDate(item));
		                currentLabel = '올해 접속자 수';
		                previousLabel = '작년 접속자 수';
		                break;
		            case 'daily':
		            default:
		                currentPeriodData = responseData.filter(item => item.weekType === 'THIS_WEEK');
		                previousPeriodData = responseData.filter(item => item.weekType === 'LAST_WEEK');
		                labels = currentPeriodData.map(item => formatMonthDay(item.loginDate));
		                currentLabel = '이번주 접속자 수';
		                previousLabel = '지난주 접속자 수';
		                break;
		        }

		        const currentValues = currentPeriodData.map(item => item.userCount);
		        const previousValues = previousPeriodData.map(item => item.userCount);

		        if (userOnlineChartInstance) {
		            userOnlineChartInstance.destroy();
		        }

		        // 데이터셋의 모든 값에서 최대값을 찾습니다.
		        const allDataValues = [...currentValues, ...previousValues];
		        const maxDataValue = Math.max(...allDataValues, 0); // 0과 비교하여 음수 값이 없을 때도 최소 0 이상이 되도록 보장

		        // suggestedMax를 최대값의 두 배로 설정합니다.
		        const suggestedMax = maxDataValue * 1.5;

		        // 그라데이션 생성 (이번주/올해 데이터용 - 푸른색 계열)
		        const thisPeriodGradient = ctx.createLinearGradient(0, 0, 0, 400);
		        thisPeriodGradient.addColorStop(0, 'rgba(54, 162, 235, 0.5)');
		        thisPeriodGradient.addColorStop(1, 'rgba(54, 162, 235, 0)');

		        // 그라데이션 생성 (지난주/작년 데이터용 - 붉은색 계열)
		        const lastPeriodGradient = ctx.createLinearGradient(0, 0, 0, 400);
		        lastPeriodGradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
		        lastPeriodGradient.addColorStop(1, 'rgba(255, 99, 132, 0)');

		        userOnlineChartInstance = new Chart(ctx, {
		            type: 'line',
		            data: {
		                labels: labels,
		                datasets: [{
		                    label: currentLabel,
		                    data: currentValues,
		                    fill: true,
		                    borderColor: 'rgb(54, 162, 235)',
		                    backgroundColor: thisPeriodGradient,
		                    tension: 0.4,
		                    pointRadius: 3,
		                    pointHoverRadius: 6,
		                    pointStyle: 'circle'
		                }, {
		                    label: previousLabel,
		                    data: previousValues,
		                    fill: true,
		                    borderColor: 'rgb(255, 99, 132)',
		                    backgroundColor: lastPeriodGradient,
		                    tension: 0.4,
		                    pointRadius: 3,
		                    pointHoverRadius: 6,
		                    pointStyle: 'circle'
		                }]
		            },
		            options: {
		                maintainAspectRatio: false,
		                plugins: {
		                    title: {
		                        display: false
		                    },
		                    tooltip: {
		                        mode: 'index',
		                        intersect: false,
		                        callbacks: {
		                            label: function(context) {
		                                let label = context.dataset.label || '';
		                                if (label) {
		                                    label += ': ';
		                                }
		                                if (context.parsed.y !== null) {
		                                    label += context.parsed.y.toLocaleString() + '명';
		                                }
		                                return label;
		                            }
		                        }
		                    },
		                    legend: {
		                        position: 'bottom',
		                    }
		                },
		                scales: {
		                    y: {
		                        beginAtZero: true,
		                        ticks: {
		                            precision: 0
		                        },
		                        // 여기에서 동적으로 계산된 값을 사용
		                        suggestedMax: suggestedMax
		                    }
		                }
		            }
		        });
		    })
		    .catch(error => console.error("사용자 접속 통계 데이터 조회 중 에러:", error));
	}
	// 'YY.MM.DD' 형식 (기간별)
	function formatFullDate(isoString) {
		if (!isoString) return '';
		const date = new Date(isoString);
		const year = String(date.getFullYear()).substring(2);
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}.${month}.${day}`;
	}
	// 'MM' 형식 (월별)
	function formatMonthOnly(isoString) {
		if (!isoString) return '';
		const date = new Date(isoString);
		return String(date.getMonth() + 1).padStart(2, '0');
	}

	// 'MM.DD' 형식 (일별)
	function formatMonthDay(isoString) {
		if (!isoString) return '';
		const date = new Date(isoString);
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${month}.${day}`;
	}

	// === 페이지별 방문자 수 차트 함수 시작 ===
	// HTML에 캔버스 ID 추가 필요: <canvas id="pageVisitChartCanvas"></canvas>

	function pageVisitChart(selectVisitCount = "daily", chartRange = "", startDate = "", endDate = "", gender = "") {
		const ctx = document.getElementById('pageVisitChartCanvas').getContext('2d');

		let dateValue = document.getElementById("pageVisitChartDay").value;
		const genderValue = document.getElementById("pageVisitChartGender").value;
		const ageGroupValue = document.getElementById("pageVisitChartAgeGroup").value;
		const startDateValue = document.getElementById("pageVisitChartStartDay").value;
		const endDateValue = document.getElementById("pageVisitChartEndDay").value;
		if (dateValue == 'selectDays' && !startDateValue) {
			document.getElementById("pageVisitChartDay").value = "daily";
			dateValue = "daily";
		}
		if (startDateValue && endDateValue && !chartRange) {
			chartRange = formatDateRange(startDateValue, endDateValue);
		}

		const params = {
			selectVisitCount: dateValue || selectUserInquiry,
			startDate: startDateValue || startDate,
			endDate: endDateValue || endDate,
			gender: genderValue || gender,
			ageGroup: ageGroupValue || '',
		}

		// 기존 차트 파괴 및 최소 높이 설정
		if (window.pageVisitChartInstance) {
			window.pageVisitChartInstance.destroy();
		}
		ctx.canvas.style.minHeight = '400px';

		axios.get('/admin/las/visitCount.do', {
			params: params
		}).then(res => {

			const responseData = res.data;

			// 데이터를 'plTitle'과 'userCount'로 매핑
			const labels = responseData.map(item => item.plTitle);
			const dataValues = responseData.map(item => item.userCount);

			// 막대 차트 생성
			window.pageVisitChartInstance = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [{
						data: dataValues,
						backgroundColor: 'rgba(142, 110, 228, 0.8)',
						borderColor: 'rgb(142, 110, 228)',
						borderWidth: 1,
						hoverBackgroundColor: 'rgba(142, 110, 228, 1)',
						barThickness: 20 // 막대 차트 두께 설정
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					// 차트 축을 가로로 변경
					indexAxis: 'y',
					interaction: {
						mode: 'index',
						intersect: false
					},
					plugins: {
						legend: { display: false, position: 'bottom' },
						title: { display: true, text: [chartRange] },
						tooltip: {
							callbacks: {
								label: function(context) {
									let label = context.dataset.label || '';
									if (label) {
										label += ': ';
									}
									if (context.parsed.x !== null) { // x축 값을 읽도록 변경
										label += context.parsed.x.toLocaleString() + '명';
									}
									return label;
								},
								// 전체 라벨 이름을 툴팁에 추가
								title: function(context) {
									return context[0].label;
								}
							}
						}
					},
					scales: {
						x: {
							beginAtZero: true,
							ticks: { callback: value => value + '명', precision: 0 }
						},
						y: {
							grid: { display: false },
							ticks: {
								// 라벨 회전 및 자르기 설정 제거
							}
						}
					}
				}
			});
		}).catch(error => {
			console.error("페이지별 방문자 데이터 조회 중 에러:", error);
		});
	}
	// === 페이지별 방문자 수 차트 함수 끝 ===

	// === 페이지 로그 목록 함수 시작 ===
	let pageLogCurrentPage = 1;
	let pageLogCurrentSortBy = 'plCreatedAt';
	let pageLogCurrentSortOrder = 'desc';

	function fetchPageLogList(page = 1, keyword = '', sortBy = 'plCreatedAt', sortOrder = 'desc') {
		pageLogCurrentPage = page;
		pageLogCurrentSortBy = sortBy;
		pageLogCurrentSortOrder = sortOrder;

		const pageSize = 5;
		const pageLogTbody = document.getElementById('pageLogList');
		const pageLogCountEl = document.getElementById('pageLog-count');
		const pageLogPaginationEl = document.getElementById('pageLogPagination');
		const memId = document.getElementById('mem-id').value;
		if (!pageLogTbody || !pageLogCountEl || !pageLogPaginationEl) {
			console.error("페이지 로그 요소를 찾을 수 없습니다.");
			return;
		}

		axios.get('/admin/umg/getMemberPageLogList.do', {
			params: {
				currentPage: page,
				size: pageSize,
				keyword: keyword,
				sortBy: sortBy,
				sortOrder: sortOrder,
				memId: memId
			}
		})
			.then(res => {
				const { content, total, currentPage, startPage, endPage, totalPages } = res.data;

				// 페이지 정보
				document.querySelector('.ptag-list.pageLogCount').style.display = 'block'
				document.getElementById("memPageVisitPage").innerText = currentPage;
				document.getElementById("memPageVisitTotalPage").innerText = totalPages != 0 ? totalPages : '1';

				pageLogCountEl.textContent = total.toLocaleString();

				if (content && content.length > 0) {
					const rows = content.map(item => `
					<tr>
						<td>${item.rnum}</td>
						<td>${item.memId}</td>
						<td>${item.memName || '-'}</td>
						<td>${item.plTitle || '-'}</td>
						<td>${formatDateTime(item.plCreatedAt)}</td>
					</tr>
				`).join('');
					pageLogTbody.innerHTML = rows;
				} else {
					pageLogTbody.innerHTML = `<tr><td colspan='5' style="text-align: center;">조회된 페이지 방문 기록이 없습니다.</td></tr>`;
				}

				// 페이지네이션 렌더링
				let paginationHtml = `<a href="#" data-page="${startPage - 1}" class="page-link ${startPage <= 1 ? 'disabled' : ''}">← Previous</a>`;
				for (let p = startPage; p <= endPage; p++) {
					if(totalPages === 0){
						p = 1;
					}
					paginationHtml += `<a href="#" data-page="${p}" class="page-link ${p === currentPage ? 'active' : ''}">${p}</a>`;
				}
				paginationHtml += `<a href="#" data-page="${endPage + 1}" class="page-link ${endPage >= totalPages ? 'disabled' : ''}">Next →</a>`;

				pageLogPaginationEl.innerHTML = paginationHtml;
			})
			.catch(err => {
				console.error('페이지 로그 조회 중 에러:', err);
				const pageLogTbody = document.getElementById('pageLogList');
				if (pageLogTbody) {
					pageLogTbody.innerHTML = `<tr><td colspan='5' style="text-align: center;">데이터를 불러오는데 실패했습니다.</td></tr>`;
				}
			});
	}

	function formatDateTime(isoString) {
		const date = new Date(isoString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1)
		const day = String(date.getDate())
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}. ${month}. ${day}. ${hours}:${minutes}:${seconds}`;
	}

	// 페이지 로그 검색 버튼
	const pageLogSearchBtn = document.querySelector(".pageLogSearchBtn");
	if (pageLogSearchBtn) {
		pageLogSearchBtn.addEventListener("click", function() {
			const keyword = document.getElementById('pageLogKeyword').value;
			fetchPageLogList(1, keyword, pageLogCurrentSortBy, pageLogCurrentSortOrder);
		});
	}

	// 페이지 로그 정렬 버튼
	const pageLogSortBtns = document.querySelectorAll('.pageVisitList .public-toggle-button');
	const pageLogSortOrderSelect = document.getElementById('pageLogSortOrder');

	if (pageLogSortBtns && pageLogSortOrderSelect) {
		pageLogSortBtns.forEach(btn => {
			btn.addEventListener('click', function() {
				const sortBy = this.dataset.sortBy;
				setActiveButton(this);
				pageLogCurrentSortBy = sortBy;

				const keyword = document.getElementById('pageLogKeyword').value;
				fetchPageLogList(1, keyword, pageLogCurrentSortBy, pageLogCurrentSortOrder);
			});
		});

		pageLogSortOrderSelect.addEventListener('change', function() {
			pageLogCurrentSortOrder = this.value;
			const keyword = document.getElementById('pageLogKeyword').value;
			fetchPageLogList(1, keyword, pageLogCurrentSortBy, pageLogCurrentSortOrder);
		});
	}

	// 페이지 로그 페이지네이션 클릭 이벤트
	const pageLogPaginationContainer = document.getElementById('pageLogPagination');
	if (pageLogPaginationContainer) {
		pageLogPaginationContainer.addEventListener('click', e => {
			e.preventDefault();
			const link = e.target.closest('a[data-page]');
			if (!link || link.classList.contains('disabled')) return;

			const newPage = parseInt(link.dataset.page, 10);
			if (!isNaN(newPage) && newPage > 0) {
				const keyword = document.getElementById('pageLogKeyword').value;
				fetchPageLogList(newPage, keyword, pageLogCurrentSortBy, pageLogCurrentSortOrder);
			}
		});
	}
	// === 페이지 로그 목록 함수 끝 ===


	userOnlineChart();
	pageVisitChart();

	// nicknameDbCkFn();
	// emailDbCkFn();
	// addBtnFn();
	// profileUploadFn();
	searchUserFn();
	modifyFn();
	fetchUserList();
	fetchDailyStats();


	setInterval(fetchDailyStats, 10000);

	//=== flatpicker 달력 선택된 날자 yyyy-mm-dd 문자열로 포맷팅
	function formatDateCal(d) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1)
		const day = String(d.getDate())
		return `${y}-${m}-${day}`;
	}

	function formatDateRange(fS, fE) {
		return `${fS} ~ ${fE}`
	}

	// 일별, 월별, 기간선택에 대해서 이벤트 바인딩
	function eventDateRangeSelect(e) {
		// 공용으로 사용할 숨겨둔 input. flatpickr가 input 요소인지 점검한다고 함.(select에 못줌)
		const selectEl = e.target.nodeName == "SELECT" ? e.target : e.target.closest('select');
		const dateValue = selectEl.value;

		// 선택 값 (일별&월별&기간선택) 확인하고 무슨차트인지 중첩조건문에서 확인
		if (dateValue == 'daily') {
			if (selectEl.id == 'userOnlineChartDay') {
				document.getElementById("userOnlineChartStartDay").value = '';
				document.getElementById("userOnlineChartEndDay").value = '';
				userOnlineChart("daily");
			} else if (selectEl.id == 'pageVisitChartDay') {
				document.getElementById("pageVisitChartStartDay").value = '';
				document.getElementById("pageVisitChartEndDay").value = '';
				pageVisitChart("daily");
			}
		} else if (dateValue == 'monthly') {
			if (selectEl.id == 'userOnlineChartDay') {
				document.getElementById("userOnlineChartStartDay").value = '';
				document.getElementById("userOnlineChartEndDay").value = '';
				userOnlineChart("monthly");
			} else if (selectEl.id == 'pageVisitChartDay') {
				document.getElementById("pageVisitChartStartDay").value = '';
				document.getElementById("pageVisitChartEndDay").value = '';
				pageVisitChart("monthly");
			}
		} else if (dateValue == 'selectDays') {
			// flatpickr 중복 초기화 방지 (필요시)
			if (hiddenInput._flatpickr) {
				hiddenInput._flatpickr.destroy();
			}

			flatpickr(hiddenInput, {
				mode: "range",
				maxDate: "today",
				disable: [date => date > new Date()],
				positionElement: selectEl,	//open되는 위치는 변경가능. select요소를 넣어줌.
				onChange: function(selectedDates) {
					if (selectedDates.length === 2) {
						const startDate = selectedDates[0];
						const endDate = selectedDates[1];
						// yyyy-mm-dd 형식으로 포맷
						const formattedStartDate = formatDateCal(startDate);
						const formattedEndDate = formatDateCal(endDate);
						const printStartDate = formatDate(startDate);
						const printEndDate = formatDate(endDate);
						if (selectEl.id == 'userOnlineChartDay') {
							// hidden 날짜 input에 데이터 삽입
							document.getElementById('userOnlineChartStartDay').value = formattedStartDate;
							document.getElementById('userOnlineChartEndDay').value = formattedEndDate;
							// 데이터 조회&차트 출력함수 호출
							userOnlineChart('selectDays', formatDateRange(printStartDate, printEndDate));
							// 기존 차트가 있으면 삭제
							if (window.userOnlineChartInstance) {
								window.userOnlineChartInstance.destroy();
							}
						} else if (selectEl.id == 'pageVisitChartDay') {
							document.getElementById('pageVisitChartStartDay').value = formattedStartDate;
							document.getElementById('pageVisitChartEndDay').value = formattedEndDate;
							pageVisitChart('selectDays', formatDateRange(printStartDate, printEndDate));
							if (window.pageVisitChartInstance) {
								window.pageVisitChartInstance.destroy();
							}
						}
					}
				}
			});

			hiddenInput._flatpickr.open();
			hiddenInput._flatpickr.clear();
		}
	}


	function handlePersonChartFilterChange(e) {
		const memId = document.getElementById('mem-id').value;
		if (!memId) {
			return;
		}

		const selectEl = e.target;
		const dateValue = selectEl.value;

		if (dateValue === 'daily' || dateValue === 'monthly') {
			document.getElementById("personChartStartDay").value = '';
			document.getElementById("personChartEndDay").value = '';
			createPersonActivityChart(memId, dateValue);
		} else if (dateValue === 'selectDays') {
			const hiddenInput = document.getElementById('comCalendarInput');
			// flatpickr 로직 (기존 eventDateRangeSelect 함수 참고)
			flatpickr(hiddenInput, {
				mode: "range",
				maxDate: "today",
				positionElement: selectEl,
				onChange: function(selectedDates) {
					if (selectedDates.length === 2) {
						const formattedStartDate = formatDateCal(selectedDates[0]);
						const formattedEndDate = formatDateCal(selectedDates[1]);
						document.getElementById('personChartStartDay').value = formattedStartDate;
						document.getElementById('personChartEndDay').value = formattedEndDate;
						createPersonActivityChart(memId, 'custom', formattedStartDate, formattedEndDate);
					}
				}
			}).open();
		}
	}

	function createPersonActivityChart(memId, type, startDate = '', endDate = '') {
		const ctx = document.getElementById('usagePersonChartCanvas')?.getContext('2d');
		if (!ctx) return;

		if (personChartInstance) {
			personChartInstance.destroy();
		}

		const params = { type, startDate, endDate };

		axios.get(`/admin/las/user-activity-yoy/${memId}`, { params })
			.then(res => {
				const rawData = res.data;

				const currentDataMap = new Map();
				const previousDataMap = new Map();
				const allDates = new Set();

				rawData.forEach(item => {
					const date = new Date(item.accessTime);
					let key;
					if (item.gubun === 'current') {
						key = type === 'monthly' ? date.toISOString().substring(0, 7) : date.toISOString().substring(0, 10);
						currentDataMap.set(key, (currentDataMap.get(key) || 0) + 1);
						allDates.add(key);
					} else { // previous
						date.setFullYear(date.getFullYear() + 1);
						key = type === 'monthly' ? date.toISOString().substring(0, 7) : date.toISOString().substring(0, 10);
						previousDataMap.set(key, (previousDataMap.get(key) || 0) + 1);
					}
				});

				let sortedDates = Array.from(allDates).sort();
				let labels;
				switch (type) {
					case 'monthly':
						labels = sortedDates.map(dateStr => formatMonthOnly(dateStr));
						break;
					case 'daily':
						labels = sortedDates.map(dateStr => formatMonthDay(dateStr));
						break;
					case 'custom':
						labels = sortedDates.map(dateStr => formatFullDate(dateStr));
						break;
					default:
						labels = sortedDates.map(dateStr => formatMonthDay(dateStr));
				}

				const currentYearValues = sortedDates.map(label => currentDataMap.get(label) || 0);
				const previousYearValues = sortedDates.map(label => previousDataMap.get(label) || 0);

				personChartInstance = new Chart(ctx, {
					type: 'line',
					data: {
						labels: labels,
						// ▼▼▼ 데이터셋(datasets) 상세 설정 ▼▼▼
						datasets: [
							{
								label: '올해 접속 횟수',
								data: currentYearValues,
								fill: true,
								borderColor: 'rgb(114, 124, 245)', // 푸른색 계열
								tension: 0.4,
								backgroundColor: function(context) {
									const { ctx, chartArea } = context.chart;
									if (!chartArea) { return null; }
									const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
									gradient.addColorStop(0, 'rgba(114, 124, 245, 0.5)');
									gradient.addColorStop(1, 'rgba(114, 124, 245, 0)');
									return gradient;
								}
							},
							{
								label: '작년 접속 횟수',
								data: previousYearValues,
								fill: true,
								borderColor: 'rgb(255, 99, 132)', // 붉은색 계열
								tension: 0.4,
								backgroundColor: function(context) {
									const { ctx, chartArea } = context.chart;
									if (!chartArea) { return null; }
									const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
									gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
									gradient.addColorStop(1, 'rgba(255, 99, 132, 0)');
									return gradient;
								}
							}
						]
					},
					// ▼▼▼ 옵션(options) 상세 설정 ▼▼▼
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: true,
								position: 'bottom'
							}
						},
						scales: {
							x: {
								grid: { display: false }
							},
							y: {
								beginAtZero: true,
								ticks: {
									precision: 0 // Y축 눈금을 정수로만 표시
								}
							}
						}
					}
				});
			})
			.catch(error => console.error("개인 접속 통계 데이터 조회 중 에러:", error));
	}

}

memberManagement();