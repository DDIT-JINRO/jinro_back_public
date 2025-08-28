package kr.or.ddit.mpg.mif.whdwl.service;

import java.util.Map;

public interface WithdrawalService {

	Map<String, Object> selectMdcategoryList(String memId);

	void insertMemDelete(String memId, Map<String, Object> map);

}
