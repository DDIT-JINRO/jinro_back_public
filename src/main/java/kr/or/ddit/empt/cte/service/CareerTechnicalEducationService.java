package kr.or.ddit.empt.cte.service;

import kr.or.ddit.util.ArticlePage;

public interface CareerTechnicalEducationService {

	ArticlePage<CareerTechnicalEducationVO> getList(String keyword, String region, String status, int currentPage,int size, String sortOrder);

}
