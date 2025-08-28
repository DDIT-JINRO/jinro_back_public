package kr.or.ddit.mpg.pay.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mpg.pay.service.SubscriptionService;
import kr.or.ddit.mpg.pay.service.SubscriptionVO;


@Service
public class SubscriptonServiceImpl implements SubscriptionService {

	@Autowired
	SubscriptionMapper subscriptionMapper;

	// 구독상품조회
	@Override
	public List<SubscriptionVO> selectAllProducts() {

		return subscriptionMapper.selectAllProducts();
	}

	@Override
	public SubscriptionVO selectProductById(int subId) {
		// TODO Auto-generated method stub
		return subscriptionMapper.selectProductById(subId);
	}

}
