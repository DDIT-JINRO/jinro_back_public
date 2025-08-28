package kr.or.ddit.admin.las.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class VisitViewUriMap {

	private static final Map<String, String> uriNameMap = new HashMap<>();

	static {
		uriNameMap.put("/", "메인");
		uriNameMap.put("/pse/cat/careerAptitudeTest.do", "진로탐색");
		uriNameMap.put("/pse/cr/crl/selectCareerList.do", "직업백과 - 직업목록");
		uriNameMap.put("/pse/cr/crr/selectCareerRcmList.do", "직업백과 - 추천직업");
		uriNameMap.put("/ertds/univ/uvsrch/selectUnivList.do", "대학교 정보 - 대학검색");
		uriNameMap.put("/ertds/univ/dpsrch/selectDeptList.do", "대학교 정보 - 학과정보");
		uriNameMap.put("/ertds/hgschl/selectHgschList.do", "고등학교정보");
		uriNameMap.put("/ertds/qlfexm/selectQlfexmList.do", "검정고시");
		uriNameMap.put("/empt/ema/employmentAdvertisement.do", "채용공고");
		uriNameMap.put("/empt/enp/enterprisePosting.do", "기업정보");
		uriNameMap.put("/empt/ivfb/interViewFeedback.do", "면접후기");
		uriNameMap.put("/empt/cte/careerTechnicalEducation.do", "직업교육");
		uriNameMap.put("/cdp/rsm/rsm/resumeList.do", "이력서 - 이력서");
		uriNameMap.put("/cdp/rsm/rsmb/resumeBoardList.do", "이력서 - 이력서템플릿게시판");
		uriNameMap.put("/cdp/sint/qestnlst/questionList.do", "자기소개서 - 질문리스트");
		uriNameMap.put("/cdp/sint/sintlst/selfIntroList.do", "자기소개서 - 자기소개서리스트");
		uriNameMap.put("/cdp/sint/sintwrt/selfIntroWriting.do", "자기소개서 - 자기소개서 작성");
		uriNameMap.put("/cdp/imtintrvw/intrvwitr/interviewIntro.do", "모의면접 - 면접의 기본");
		uriNameMap.put("/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do", "모의면접 - 면접 질문 리스트");
		uriNameMap.put("/cdp/imtintrvw/intrvwqestnmn/interviewQuestionMangementList.do", "모의면접 - 면접 질문 관리");
		uriNameMap.put("/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do", "모의면접 - AI 모의 면접");
		uriNameMap.put("/cdp/aifdbck/rsm/aiFeedbackResumeList.do", "AI 피드백 - 이력서");
		uriNameMap.put("/cdp/aifdbck/sint/aiFeedbackSelfIntroList.do", "AI 피드백 - 자기소개서");
		uriNameMap.put("/cnslt/resve/crsv/reservation.do", "상담 예약");
		uriNameMap.put("/cnslt/resve/cnsh/counselingReserveHistory.do", "상담 내역");
		uriNameMap.put("/cnslt/rvw/cnsReview.do", "상담 후기");
		uriNameMap.put("/prg/ctt/cttList.do", "공모전");
		uriNameMap.put("/prg/act/vol/volList.do", "대외활동 - 봉사활동");
		uriNameMap.put("/prg/act/cr/crList.do", "대외활동 - 직업체험");
		uriNameMap.put("/prg/act/sup/supList.do", "대외활동 - 서포터즈");
		uriNameMap.put("/prg/std/stdGroupList.do", "스터디 그룹");
		uriNameMap.put("/comm/peer/teen/teenList.do", "또래 게시판 - 청소년 게시판");
		uriNameMap.put("/comm/peer/youth/youthList.do", "또래 게시판 - 청년 게시판");
		uriNameMap.put("/comm/path/pathList.do", "진로 진학 게시판");
		uriNameMap.put("/csc/not/noticeList.do", "공지사항");
		uriNameMap.put("/csc/faq/faqList.do", "FAQ");
		uriNameMap.put("/csc/inq/inqryList.do", "1:1 문의");
		uriNameMap.put("/mpg/mif/inq/selectMyInquiryView.do", "내정보 - 조회 및 수정");
		uriNameMap.put("/mpg/mif/pswdchg/selectPasswordChangeView.do", "내정보 - 비밀번호 변경");
		uriNameMap.put("/mpg/mif/whdwl/selectWithdrawalView.do", "내정보 - 회원 탈퇴");
		uriNameMap.put("/mpg/mat/bmk/selectBookMarkList.do", "나의 활동 - 북마크");
		uriNameMap.put("/mpg/mat/csh/selectCounselingHistoryList.do", "나의 활동 - 상담 내역");
		uriNameMap.put("/mpg/mat/reh/selectResumeHistoryList.do", "나의 활동 - 이력서");
		uriNameMap.put("/mpg/mat/sih/selectSelfIntroHistoryList.do", "나의 활동 - 자기소개서");
		uriNameMap.put("/mpg/pay/selectPaymentView.do", "결제/구독 내역");
	}

	public static String getPageName(String path) {
		return uriNameMap.get(path);
	}

	public static boolean contains(String path) {
		return uriNameMap.containsKey(path);
	}

}
