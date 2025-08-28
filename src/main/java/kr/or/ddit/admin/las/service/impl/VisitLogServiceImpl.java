package kr.or.ddit.admin.las.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.admin.las.service.PageLogVO;
import kr.or.ddit.admin.las.service.VisitLogService;

@Service
public class VisitLogServiceImpl implements VisitLogService {

	@Autowired
	VisitLogMapper visitLogMapper;

	@Override
	public void insertPageLog(String username, String pageName, String url, String referer) {

		PageLogVO pageLogVO = new PageLogVO();

		pageLogVO.setMemId(username);
		pageLogVO.setPlTitle(pageName);
		pageLogVO.setPlRefererUrl(referer);
		pageLogVO.setPlUrl(url);

		visitLogMapper.insertPageLog(pageLogVO);

	}

}
