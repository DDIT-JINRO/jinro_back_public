package kr.or.ddit.mpg.pay.service;

import java.util.List;

public interface SubscriptionService {

	// 구독상품 조회
	public List<SubscriptionVO> selectAllProducts();

	// 특정 구독 상품 정보 조회
	public SubscriptionVO selectProductById(int subId);
}
