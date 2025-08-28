package kr.or.ddit.worldcup.web;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.worldcup.service.ComCodeVO;
import kr.or.ddit.worldcup.service.JobsVO;
import kr.or.ddit.worldcup.service.WorldCupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/worldcup")
public class WorldCupController {

	private final WorldCupService worldCupService;
	
	@GetMapping("/selectCategories")
	public ResponseEntity<List<ComCodeVO>> selectCategories(@RequestParam String round) {
		List<ComCodeVO> comCodeVOList = worldCupService.selectCategories(round);
		log.info("WorldCupController - > selectCategories : " + comCodeVOList);
		return ResponseEntity.ok(comCodeVOList);

	}

	@PostMapping("/selectJobsByCategory")
	public ResponseEntity<Map<String, Object>> selectJobsByCategory(@RequestBody ComCodeVO comCodeVO) {
		
		comCodeVO = worldCupService.selectComCodeNameByccId(comCodeVO);
		log.info("WorldCupController -> comCodeVO :" + comCodeVO);
		
		List<JobsVO> jobsVOList = worldCupService.selectJobsByCategory(comCodeVO);
		log.info("WorldCupController -> jobsVOList :" + jobsVOList);

	    Map<String, Object> response = new HashMap();
	    response.put("comCodeVO", comCodeVO);
	    response.put("jobsVOList", jobsVOList);
		return ResponseEntity.ok(response);

	}
	
	@PostMapping("/selectJobById")
	public ResponseEntity<JobsVO> selectJobById(@RequestBody JobsVO jobsVO) {
		jobsVO = worldCupService.selectJobById(jobsVO);
		log.info("selectJobById -> jobsVO :" + jobsVO);
		
		return ResponseEntity.ok(jobsVO);

	}
	
	@PostMapping("/insertWorldcupResult")
	public ResponseEntity<Integer> insertWorldcupResult(Principal principal,@RequestBody JobsVO jobsVO) {
		
	      if(principal!=null && !principal.getName().equals("anonymousUser")) {
	    	String  memId= principal.getName();
	  		int id = Integer.valueOf(memId);
			
			int cnt = worldCupService.insertWorldcupResult(jobsVO,id);
			
			log.info("cnt : "+cnt);
			return (ResponseEntity<Integer>) ResponseEntity.ok(cnt);
	          
	       }else {
	    	   return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	       }
		
	}
	
}
