package kr.or.ddit.test.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.test.service.TestVO;


@Mapper
public interface TestMapper {

	List<TestVO> test();

}
