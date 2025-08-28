package kr.or.ddit.empt.cte.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.empt.cte.service.CareerTechnicalEducationService;
import kr.or.ddit.empt.cte.service.CareerTechnicalEducationVO;
import kr.or.ddit.util.ArticlePage;

@Service
public class CareerTechnicalEducationServiceImpl implements CareerTechnicalEducationService {

    @Autowired
    private CareerTechnicalEducationMapper educationMapper;

    @Override
    public ArticlePage<CareerTechnicalEducationVO> getList(String keyword, String region, String status, int currentPage, int size, String sortOrder) {

        CareerTechnicalEducationVO educationVO = new CareerTechnicalEducationVO();  // 객체 생성 필수

        educationVO.setSortOrder(sortOrder);
        educationVO.setKeyword(keyword);
        educationVO.setRegion(region);
        educationVO.setStatus(status);
        educationVO.setCurrentPage(currentPage);
        educationVO.setSize(size);

        int total = educationMapper.getTotal(educationVO);
        List<CareerTechnicalEducationVO> list = educationMapper.getList(educationVO);

        ArticlePage<CareerTechnicalEducationVO> articlePage = new ArticlePage<>(total, currentPage, size, list, keyword);

        return articlePage;  // null이 아니라 정상 객체 반환
    }
}

