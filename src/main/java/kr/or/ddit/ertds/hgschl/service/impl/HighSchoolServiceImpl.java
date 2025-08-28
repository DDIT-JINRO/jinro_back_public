package kr.or.ddit.ertds.hgschl.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolDeptVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolService;
import kr.or.ddit.ertds.hgschl.service.HighSchoolVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class HighSchoolServiceImpl implements HighSchoolService {

	@Autowired
	private HighSchoolMapper highSchoolMapper;

	// 모든 고등학교 리스트
	@Override
	public List<HighSchoolVO> highSchoolList(HighSchoolVO highSchoolVO) {

		return highSchoolMapper.highSchoolList(highSchoolVO);
	}

	// 고등학교 상세
	@Override
	public HighSchoolVO highSchoolDetail(int hsId) {

		return highSchoolMapper.highSchoolDetail(hsId);
	}

	// 검색 결과 갯수
	@Override
	public int selectHighSchoolCount(HighSchoolVO highSchoolVO) {

		return highSchoolMapper.selectHighSchoolCount(highSchoolVO);
	}

	// 지역 필터 옵션 목록 조회
	@Override
	public List<ComCodeVO> selectRegionList() {

		return highSchoolMapper.selectRegionList();
	}

	// 학교 유형 필터 옵션 목록 조회
	@Override
	public List<ComCodeVO> selectSchoolTypeList() {

		return highSchoolMapper.selectSchoolTypeList();
	}

	// 공학 여부 필터 옵션 목록 조회
	@Override
	public List<ComCodeVO> selectCoedTypeList() {

		return highSchoolMapper.selectCoedTypeList();
	}

	// 특정 고등학교의 학과 목록 조회
	@Override
	public List<HighSchoolDeptVO> selectDeptsBySchoolId(int hsId) {

		return highSchoolMapper.selectDeptsBySchoolId(hsId);
	}

	@Override
	public int highSchoolDelete(int hsId) {

		return highSchoolMapper.highSchoolDelete(hsId);
	}

	@Override
	public int highSchoolDeptDelete(int hsdId) {

		return highSchoolMapper.highSchoolDeptDelete(hsdId);
	}

	// 고등학교 정보 입력
	@Override
	@Transactional
	public int highSchoolInsert(HighSchoolVO highSchoolVO) {
		highSchoolVO.setHsRegionCode(getCommonCode(highSchoolVO.getHsRegion(), "G23"));
		highSchoolVO.setHsJurisCode(highSchoolMapper.selectJurisCodeByRegionName(highSchoolVO.getHsRegion()));
		highSchoolVO.setHsFoundTypeCode(getCommonCode(highSchoolVO.getHsFoundType(), "G21"));
		highSchoolVO.setHsCoeduTypeCode(getCommonCode(highSchoolVO.getHsCoeduType(), "G24"));
		highSchoolVO.setHsTypeNameCode(getCommonCode(highSchoolVO.getHsTypeName(), "G25"));
		highSchoolVO.setHsGeneralTypeCode(getCommonCode(highSchoolVO.getHsGeneralType(), "G26"));
		// TODO: hsJurisCode(관할 교육청)는 별도 로직 필요 (ComCodeVO의 ccEtc 필드 활용)

		// 2. 모든 정보가 채워진 VO를 Mapper로 전달하여 DB에 INSERT
		return highSchoolMapper.highSchoolInsert(highSchoolVO);
	}

	// 고등학교 학과 입력
	@Override
	public int highSchoolDeptInsert(HighSchoolDeptVO highSchoolDeptVO) {
		// 학과명(HSD_NAME) -> 코드(HSD_CODE) 변환
		String hsdCode = getCommonCode(highSchoolDeptVO.getHsdName(), "G27");
		highSchoolDeptVO.setHsdCode(hsdCode);

		// 계열명(HSD_TRACK_NAME) -> 코드(HSD_TRACK_NAME) 변환
		String hsdTrackCode = getCommonCode(highSchoolDeptVO.getHsdTrackName(), "G31");
		highSchoolDeptVO.setHsdTrackName(hsdTrackCode);

		return highSchoolMapper.highSchoolDeptInsert(highSchoolDeptVO);
	}

	// 고등학교 정보 수정
	@Override
	public int highSchoolUpdate(HighSchoolVO highSchoolVO) {
		// 한글 이름 필드가 null이 아닐 경우에만 코드로 변환하여 설정
		if (highSchoolVO.getHsRegion() != null) {
			highSchoolVO.setHsRegionCode(getCommonCode(highSchoolVO.getHsRegion(), "G23"));
		}
		if (highSchoolVO.getHsRegion() != null) {
			highSchoolVO.setHsJurisCode(highSchoolMapper.selectJurisCodeByRegionName(highSchoolVO.getHsRegion()));
		}
		if (highSchoolVO.getHsFoundType() != null) {
			highSchoolVO.setHsFoundTypeCode(getCommonCode(highSchoolVO.getHsFoundType(), "G21"));
		}
		if (highSchoolVO.getHsCoeduType() != null) {
			highSchoolVO.setHsCoeduTypeCode(getCommonCode(highSchoolVO.getHsCoeduType(), "G24"));
		}
		if (highSchoolVO.getHsTypeName() != null) {
			highSchoolVO.setHsTypeNameCode(getCommonCode(highSchoolVO.getHsTypeName(), "G25"));
		}
		if (highSchoolVO.getHsGeneralType() != null) {
			highSchoolVO.setHsGeneralTypeCode(getCommonCode(highSchoolVO.getHsGeneralType(), "G26"));
		}
		// TODO: hsJurisCode(관할 교육청) 변환 로직 추가

		// fetchAndSetCoordinates(highSchoolVO);
		return highSchoolMapper.highSchoolUpdate(highSchoolVO);
	}

	// 고등학교 학과 정보 수정
	@Override
	public int highSchoolDeptUpdate(HighSchoolDeptVO highSchoolDeptVO) {

		// 학과명(HSD_NAME)이 존재하면 코드(HSD_CODE)로 변환
		if (highSchoolDeptVO.getHsdName() != null) {
			String hsdCode = getCommonCode(highSchoolDeptVO.getHsdName(), "G27");
			highSchoolDeptVO.setHsdCode(hsdCode);
		}
		// 계열명(HSD_TRACK_NAME)이 존재하면 코드로 변환
		if (highSchoolDeptVO.getHsdTrackName() != null) {
			String hsdTrackCode = getCommonCode(highSchoolDeptVO.getHsdTrackName(), "G31");
			highSchoolDeptVO.setHsdTrackName(hsdTrackCode);
		}

		return highSchoolMapper.highSchoolDeptUpdate(highSchoolDeptVO);
	}

	// 공통 코드와 이름을 매핑하는 캐시 (성능 최적화)
	private Map<String, String> commonCodeCache;

	// 모든 공통 코드를 한 번에 메모리에 로딩 (애플리케이션 시작 시 로딩하면 더 효율적)
	private void initializeCommonCodeCache() {
		if (commonCodeCache == null) {
			List<ComCodeVO> allCommonCodes = highSchoolMapper.selectAllCommonCodes();
			commonCodeCache = allCommonCodes.stream()
					.collect(Collectors.toMap(vo -> vo.getClCode() + "_" + vo.getCcName(), // 키: 'G23_대전광역시'
							ComCodeVO::getCcId, (existing, replacement) -> existing));
		}
	}

	// 한글 이름을 받아서 공통 코드로 변환하는 헬퍼 메서드
	private String getCommonCode(String name, String clCode) {
		if (commonCodeCache == null) {
			initializeCommonCodeCache();
		}
		return commonCodeCache.get(clCode + "_" + name);
	}

}
