package kr.or.ddit.account.lgn.service.impl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import kr.or.ddit.main.service.MemberVO;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    LoginMapper loginMapper;

    @Override
    public UserDetails loadUserByUsername(String memId) throws UsernameNotFoundException {
        
    	int intMemId = Integer.parseInt(memId);
    	
    	MemberVO member = loginMapper.selectById(intMemId); 
        if (member == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + memId);
        }
        
        return new User(
            member.getSMemId(),
            member.getMemPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
