package kr.or.ddit.cdp.sint.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.cdp.sint.service.SelfIntroContentVO;
import kr.or.ddit.cdp.sint.service.SelfIntroQVO;
import kr.or.ddit.cdp.sint.service.SelfIntroVO;
import kr.or.ddit.com.ComCodeVO;

@Mapper
public interface SelfIntroMapper {

	// 파라미터 selfIntroQVO SIQ_JOB이 NULL이 아닌것 ketword 와 siqJobFilter 동적으로 SIQ_ID 순으로
	// startRow 부터 endRow까지 가져옴
	public List<SelfIntroQVO> selectSelfIntroQList(SelfIntroQVO selfIntroQVO);

	// -- 파라미터 selfIntroQVO: SIQ_JOB이 NULL이 아닌 것 중 keyword와 siqJobFilter를 동적으로 적용해
	// 전체 개수를 조회
	public int selectSelfIntroQCount(SelfIntroQVO selfIntroQVO);

	// -- 파라미터 없음: CL_CODE가 'G36'인 COM_CODE에서 자소서 직종 공통코드(CC_ID, CL_CODE, CC_NAME)를
	// CC_ID 순으로 조회
	public List<ComCodeVO> selectSelfIntroComCodeList();

	// -- 파라미터 없음: SELF_INTRO 테이블에서 SI_ID의 최대값을 조회하고 NULL인 경우 0으로 간주한 뒤 1을 더한 값을 반환
	public int selectMaxIntroId();

	// -- 파라미터 selfIntroVO: siId, memId는 필수로 바인딩하고, siTitle은 값이 있을 때 바인딩(없으면 NULL),
	// siStatus는 값이 있을 때 바인딩(없으면 '작성중'으로 기본값)하여 SELF_INTRO에 새 레코드 삽입
	public int insertIntro(SelfIntroVO selfIntroVO);

	// -- 파라미터 없음: SELF_INTRO_CONTENT 테이블에서 SIC_ID의 최대값을 조회하고, NULL인 경우 0으로 간주한 뒤 1을
	// 더한 값을 반환
	public int selectMaxSICId();

	// -- 파라미터 selfIntroContentVO: sicId, siId, siqId, sicLimit, sicOrder는 항상 바인딩하고,
	// sicContent가 있을 때만 SIC_CONTENT 컬럼과 값을 포함하여 SELF_INTRO_CONTENT에 새 레코드 삽입
	public int insertContent(SelfIntroContentVO SelfIntroContentVO);

	// -- 파라미터 selfIntroVO: SI_ID=#{siId} 조건으로 SELF_INTRO_CONTENT에서
	// SIC_ID, SI_ID, SIQ_ID, SIC_CONTENT, SIC_LIMIT, SIC_COUNT, SIC_ORDER를
	// SIC_ORDER 순으로 조회
	public List<SelfIntroContentVO> selectBySelfIntroContentIdList(SelfIntroVO selfIntroVO);

	// -- 파라미터 selfIntroContentVO: siqId를 바인딩하여 SELF_INTRO_Q에서 SIQ_ID, SIQ_JOB,
	// SIQ_CONTENT를 조회
	public SelfIntroQVO selectBySelfIntroQId(SelfIntroContentVO selfIntroContentVO);

	// -- 파라미터 selfIntroVO: SI_ID=#{siId} 조건으로 SELF_INTRO에서 SI_ID, MEM_ID, SI_TITLE,
	// SI_STATUS를 조회
	public SelfIntroVO selectBySelfIntroId(SelfIntroVO selfIntroVO);

	// --------
	// -- 파라미터 siId: SELF_INTRO_CONTENT(c)와 SELF_INTRO_Q(q)를
	// INNER JOIN하여 c.SI_ID=#{siId} 조건으로 q.SIQ_ID, q.SIQ_JOB, q.SIQ_CONTENT를
	// c.SIC_ORDER 순으로 조회
	public List<SelfIntroQVO> selectQuestionsBySiId(int siId);

	// 공통질문 가져오기
	// -- 파라미터 없음: SIQ_JOB이 NULL인 SELF_INTRO_Q에서 SIQ_ID, SIQ_JOB, SIQ_CONTENT를
	// SIQ_ID 순으로 조회
	public List<SelfIntroQVO> selectCommonQuestions();

	// -- 파라미터 selfIntroVO: SI_ID=#{siId} 및 MEM_ID=#{memId} 조건으로,
	// siTitle이나 siStatus 중 값이 있는 컬럼만 동적으로 업데이트하여 SELF_INTRO 레코드를 수정
	public void updateIntro(SelfIntroVO selfIntroVO);

	// -- 파라미터 map: sicId, siqId, sicContent, sicOrder를 바인딩하여 SELF_INTRO_CONTENT에서
	// SIC_ID=#{sicId} 조건으로 SIQ_ID, SIC_CONTENT, SIC_ORDER를 업데이트
	public void updateContent(@Param("sicId") int sicId, @Param("siqId") int siqId,
			@Param("sicContent") String sicContent, @Param("sicOrder") int sicOrder);

	// 사용자 id로 자소서리스트 가져오기 memId 로 Self_Intro 검색 List 반환
	public List<SelfIntroVO> selectSelfIntroBymemId(SelfIntroVO selfIntroVO);

	// 자소서 삭제
	public void deleteSelfIntro(SelfIntroVO selfIntroVO);

	// 자소서 상세 삭제
	public void deleteSelfIntroContent(SelfIntroVO selfIntroVO);

	public int selectSelfIntroTotalBymemId(SelfIntroVO selfIntroVO);
}
