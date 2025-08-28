<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/admin/las/contentUsageStatistics.css">
<input type="hidden" id="comCalendarInput" style="display: none;" />
<div class="flex dkwnrrhtlvek">
	<h2 class="topTitle">로그 및 통계</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">컨텐츠 이용 통계</h2>
</div>
	<div class="contentUsage-1 flex gap">
		<div class="contentUsage-1-1">
			<div class="contentUsage-1-1-1 flex gap">
				<div class="template-panel public-countCard">
					<div class="public-card-title">일일 게시글 작성수</div>
					<img class="public-card-icon" alt="" src="/images/admin/admin-boardList.png">
					<div class="public-card-count" id="dailyPosts"></div>
					<div class="public-span-space">
						<span id="dailyPostsRate"></span>
						<div class=public-span-since>Since last day</div>
					</div>
				</div>
				<div class="template-panel public-countCard">
					<div class="public-card-title">일일 북마크 수</div>
					<img class="public-card-icon" alt="" src="/images/admin/admin-bookmark.png">
					<div class="public-card-count" id="dailyBookmarks">321</div>
					<div class="public-span-space">
						<span id="dailyBookmarksRate"></span>
						<div class=public-span-since>Since last day</div>
					</div>
				</div>
				<div class="template-panel public-countCard">
					<div class="public-card-title">일일 채팅방 개설 수</div>
					<img class="public-card-icon" alt="" src="/images/admin/admin-chat.png">
					<div class="public-card-count" id="dailyChatRooms"></div>
					<div class="public-span-space">
						<span id="dailyChatRoomsRate"></span>
						<div class=public-span-since>Since last day</div>
					</div>
				</div>
			</div>
			<div class="contentUsage-1-1-2 template-panel roadmapAndWorldCupSpace">
				<div class="flex space-between">
					<div class="middleTitle">월드컵 로드맵 이용 현황</div>
					<div class="btn-group flex gap5 roadmapAndWorldSelectGroup">
						<button class="public-toggle-button" id="roadmapAndWorldCupChartReset">전체</button>
						<input type="hidden" id="roadmapChartStartDay" />
						<input type="hidden" id="roadmapChartEndDay" />
						<select class="public-toggle-select" name="roadmapChartDay" id="roadmapChartDay">
							<option value="daily">일별</option>
							<option value="monthly">월별</option>
							<option value="selectDays">기간</option>
						</select> <select class="public-toggle-select" name="roadmapChartGender" id="roadmapChartGender">
							<option value="">성별전체</option>
							<option value="male">남자</option>
							<option value="female">여자</option>
						</select> <select class="public-toggle-select" name="roadmapChartAgeGroup" id="roadmapChartAgeGroup">
							<option value="">연령전체</option>
							<option value="teen">청소년</option>
							<option value="youth">청년</option>
						</select>
					</div>
				</div>
				<div class="roadmapAndWorldSelectGroupChart">
					<canvas id="roadmapAndWorldSelectGroupChartCanvas"></canvas>
				</div>
			</div>
		</div>
		<div class="constentUsage-1-2">
			<div class="constentUsage-1-2-1 template-panel back-color-purple">
				<div class="middleTitle constentUsage-1-2-1-title">월드컵 콘텐츠 인기 순위 TOP5</div>
				<img class="public-card-icon trophyImg" alt="" src="/images/admin/admin-worldcup.png">
				<div class="constentUsage-1-2-1-p" id="worldcupRn">
					<p>1. 간호사</p>
					<p>2. 경찰</p>
					<p>3. 소방관</p>
					<p>4. 변호사</p>
					<p>5. 의사</p>
				</div>
				<div class="circleDiv">
					<img class="circleDsImg" alt="" src="/images/admin/admin-circleDs.png">
				</div>
			</div>
			<div class="template-panel roadmapStepCount">
				<div class="middleTitle">로드맵 진행단계 분포율</div>
				<div class="roadPercentSpace">
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadNoStep.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">미진행</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-noStep"></div>
							</div>
						</div>
						<div class="borderBottom"></div>
					</div>
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadstep1.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">1단계</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-step1"></div>
							</div>
						</div>
						<div class="borderBottom"></div>
					</div>
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadstep2.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">2단계</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-step2"></div>
							</div>
						</div>
						<div class="borderBottom"></div>
					</div>
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadstep3.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">3단계</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-step3"></div>
							</div>
						</div>
						<div class="borderBottom"></div>
					</div>
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadstep4.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">4단계</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-step4"></div>
							</div>
						</div>
						<div class="borderBottom"></div>
					</div>
					<div class="roadmapStepCount-stepCount">
						<div class="roadmapStepCount-step flex">
							<img alt="" src="/images/admin/admin-roadComplete.png">
							<div class="roadmapStepCount-step-cnt">
								<div class="roadmapStepCount-stepTitle">완료</div>
								<div class="roadmapStepCount-stepCnt" id="roadmapStepCount-complete"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="contentUsage-2 flex gap">
		<div class="template-panel commOnceView">
			<div class="commOnceView-1 flex">
				<div class="middleTitle">커뮤니티 한눈에 보기</div>
				<div class="btn-group flex gap5 commOnceViewBtnGroup">
					<button class="public-toggle-button active" id="commOnceView-weekBtn">주간</button>
					<button class="public-toggle-button" id="commOnceView-monthBtn">월간</button>
				</div>
			</div>
			<div class="flex gap">
				<div class="commOnceView-left-box">
					<div class="commOnceView-box flex" id="stats-box-post">
						<div class="commOnceView-box-text">
							<div class="commOnceView-box-title">총 게시글 수</div>
							<div class="commOnceView-box-cnt color-purple" id="commOnceView-boardWriteCnt">3,456</div>
							<div class="public-span-space commOnceView-rate">
								<span id="commOnceView-boardWriteRate">▲ 8.27%</span>
								<div class=public-span-since>Since last week</div>
							</div>
						</div>
						<div>
							<img class="commOnceViewImg" alt="" src="/images/admin/admin-circle-board.png">
						</div>
					</div>
					<div class="commOnceView-box flex" id="stats-box-post-like">
						<div class="commOnceView-box-text">
							<div class="commOnceView-box-title">총 게시글 좋아요 수</div>
							<div class="commOnceView-box-cnt color-red" id="commOnceView-boardLikeCnt">3,456</div>
							<div class="public-span-space commOnceView-rate">
								<span id="commOnceView-boardLikeRate">▲ 8.27%</span>
								<div class=public-span-since>Since last week</div>
							</div>
						</div>
						<div>
							<img class="commOnceViewImg" alt="" src="/images/admin/admin-circle-heart.png">
						</div>
					</div>
				</div>
				<div class="commOnceView-right-box">
					<div class="commOnceView-box flex" id="stats-box-reply">
						<div class="commOnceView-box-text">
							<div class="commOnceView-box-title">총 댓글 수</div>
							<div class="commOnceView-box-cnt color-green" id="commOnceView-replyWriteCnt">3,456</div>
							<div class="public-span-space commOnceView-rate">
								<span id="commOnceView-replyWriteRate">▲ 8.27%</span>
								<div class=public-span-since>Since last week</div>
							</div>
						</div>
						<div>
							<img class="commOnceViewImg" alt="" src="/images/admin/admin-circle-reply.png">
						</div>
					</div>
					<div class="commOnceView-box flex" id="stats-box-reply-like">
						<div class="commOnceView-box-text">
							<div class="commOnceView-box-title">총 댓글 좋아요 수</div>
							<div class="commOnceView-box-cnt color-yello" id="commOnceView-replyLikeCnt">3,456</div>
							<div class="public-span-space commOnceView-rate">
								<span id="commOnceView-replyLikeRate">▲ 8.27%</span>
								<div class=public-span-since>Since last week</div>
							</div>
						</div>
						<div>
							<img class="commOnceViewImg" alt="" src="/images/admin/admin-circle-like.png">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="template-panel commUsageChartSpace">
			<div class="flex commChartUsageHeader">
				<div class="middleTitle">커뮤니티 이용통계</div>
				<div class="btn-group flex gap5 commUsageChartSelectGroup">
					<input type="hidden" id="commUsageChartStartDay" />
					<input type="hidden" id="commUsageChartEndDay" />
					<button class="public-toggle-button" id="commUsageChartReset">전체</button>
					<select class="public-toggle-select" name="commUsageChartDay" id="commUsageChartDay">
						<option value="daily">일별</option>
						<option value="monthly">월별</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" name="commUsageChartGender" id="commUsageChartGender">
						<option value="">성별전체</option>
						<option value="male">남자</option>
						<option value="female">여자</option>
					</select> <select class="public-toggle-select" name="commUsageChartAgeGroup" id="commUsageChartAgeGroup">
						<option value="">연령전체</option>
						<option value="teen">청소년</option>
						<option value="youth">청년</option>
					</select> <select class="public-toggle-select" name="commUsageChartCategory" id="commUsageChartCategory">
						<option value="">카테고리</option>
						<option value="G09006">청년 커뮤니티</option>
						<option value="G09001">청소년 커뮤니티</option>
						<option value="G09002">진로진학 커뮤니티</option>
						<option value="G09004">이력서 템플릿</option>
						<option value="G09005">스터디그룹</option>
					</select>
				</div>
			</div>
			<div class="chart-container commUsageChartDraw">
				<canvas id="communityUsageChart"></canvas>
			</div>
		</div>
	</div>

	<div class="contentUsage-2 flex gap">
		<div class="template-panel bookmarkCateChartSpace">
			<div class="flex space-between">
				<div class="middleTitle">북마크 카테고리별 통계현황</div>
				<div class="btn-group flex gap5 bookmarkCateChartSelectGroup">
					<input type="hidden" id="bookmarkCategoryChartStartDay" />
					<input type="hidden" id="bookmarkCategoryChartEndDay" />
					<button class="public-toggle-button" id="bookmarkCategoryChartReset">전체</button>
					<select class="public-toggle-select" name="bookmarkCategoryChartDay" id="bookmarkCategoryChartDay">
						<option value="daily">주간</option>
						<option value="monthly">월간</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" name="bookmarkCategoryChartGender" id="bookmarkCategoryChartGender">
						<option value="">성별전체</option>
						<option value="G11001">남자</option>
						<option value="G11002">여자</option>
					</select> <select class="public-toggle-select" name="bookmarkCategoryChartAgeGroup" id="bookmarkCategoryChartAgeGroup">
						<option value="">연령전체</option>
						<option value="teen">청소년</option>
						<option value="youth">청년</option>
					</select>
				</div>
			</div>
			<div class="chart-container bookmarkCategoryChartDraw">
				<canvas id="bookmarkCategoryChart"></canvas>
			</div>
		</div>

		<div class="template-panel bookmarkCateChartSpace">
			<div class="flex space-between">
				<div class="middleTitle">북마크 상세 현황(TOP)</div>
				<div class="btn-group flex gap5 bookmarkCateChartSelectGroup">
					<input type="hidden" id="bookmarkTopChartStartDay" />
					<input type="hidden" id="bookmarkTopChartEndDay" />
					<button class="public-toggle-button" id="bookmarkTopChartReset">전체</button>
					<select class="public-toggle-select" name="bookmarkTopChartDay" id="bookmarkTopChartDay">
						<option value="daily">주간</option>
						<option value="monthly">월간</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" name="bookmarkTopChartGender" id="bookmarkTopChartGender">
						<option value="">성별전체</option>
						<option value="G11001">남자</option>
						<option value="G11002">여자</option>
					</select> <select class="public-toggle-select" name="bookmarkTopChartAgeGroup" id="bookmarkTopChartAgeGroup">
						<option value="">연령전체</option>
						<option value="teen">청소년</option>
						<option value="youth">청년</option>
					</select>
				</div>
			</div>
			<div class="chart-container bookmarkTopChartSpace">
				<canvas id="bookmarkTopChart"></canvas>
			</div>
		</div>
	</div>

	<script src="/js/include/admin/las/contentUsageStatistics.js"></script>