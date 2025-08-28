package kr.or.ddit.mpg.pay.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.mpg.pay.service.SubscriptionVO;


@Mapper
public interface SubscriptionMapper {
	
	//구독상품조회
	public List<SubscriptionVO> selectAllProducts();
	
	// 특정 구독 상품 정보 조회
	public SubscriptionVO selectProductById(int subId);

}
