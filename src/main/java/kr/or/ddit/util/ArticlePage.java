package kr.or.ddit.util;

import java.util.List;

import kr.or.ddit.main.service.MemberVO;
import lombok.Data;

//페이징 관련 정보 + 게시글 정보
@Data
public class ArticlePage<T> {
	//전체글 수
	private int total;  //753행
	// 현재 페이지 번호
	private int currentPage;  //1페이지
	// 전체 페이지수 
	private int totalPages; //전체글 수 / 한 화면에 보여질 목록의 행 수
	// 블록의 시작 번호
	private int startPage;
	//블록의 종료 번호
	private int endPage;
	//검색어
	private String keyword = "";
	//요청URL
	private String url = "";
	//select 결과 데이터
	private List<T> content;
	//페이징 처리
	private String pagingArea = "";
	//보여줄 페이징 갯수 defalut =5;
	private int blockSize = 5;
	
	
	//생성자(Constructor) : 페이징 객체 생성
	public ArticlePage(int total, int currentPage, int size
				,List<T> content, String keyword) {
		//size : 한 화면에 보여질 목록의 행 수
		this.total = total;
		this.currentPage = currentPage;
		this.keyword = keyword;
		this.content = content;
		//전체 글 수가 0이면?
		if(total==0) {
			this.totalPages = 0;//전체 페이지 수
			this.startPage = 0;//블록 시작번호
			this.endPage = 0;//블록 종료번호
		}else {//글이 있다면?
			//전체 페이지 수 = 전체글 수 / 한 화면에 보여질 목록의 행 수
			//3 = 31 / 10
			this.totalPages = total / size; //3페이지
			//나머지가 있다면, 페이지를 1 증가
			if(total % size > 0) {//ex) 나머지 1
				this.totalPages++;//4페이지
			}
			
			//페이지 블록시작번호를 구하는 공식
			// 블록시작번호 = 현재페이지 / 블록크기 * 블록크기 + 1
			 this.startPage = currentPage / blockSize * blockSize + 1;
			//현재페이지 % 블록크기 => 0일 때 보정
			if(currentPage % blockSize == 0) {
				this.startPage -= blockSize;
			}
			
			//블록종료번호 = 블록시작번호 + (블록크기 - 1)
			//[1][2][3][4][5][다음]
			this.endPage = this.startPage + (blockSize - 1);
			
			//블록종료번호 > 전체페이지수
			if(this.endPage > this.totalPages) {
				this.endPage = this.totalPages;
			}
		}
		
		pagingArea += "<div class='col-sm-12 col-md-7'>";
		pagingArea += "<div class='dataTables_paginate paging_simple_numbers' id='example2_paginate'>";
		pagingArea += "<ul class='pagination'>";
		pagingArea += "<li class='paginate_button page-item previous "; 
		if(this.startPage<6) {
			pagingArea += "disabled ";
		}
		pagingArea += "'";
		pagingArea += "id='example2_previous'>";
		pagingArea += "<a href='"+this.url+"?currentPage="+(this.startPage-blockSize)+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='0' tabindex='0' ";
		pagingArea += "class='page-link'>Previous</a></li>";
		
		for(int pNo=this.startPage;pNo<=this.endPage;pNo++) {		
		pagingArea += "<li class='paginate_button page-item ";
			if(this.currentPage == pNo) {
				pagingArea += "active";
			}
			pagingArea += "'>";
			pagingArea += "<a href='"+this.url+"?currentPage="+pNo+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='1' tabindex='0' ";
			pagingArea += "class='page-link'>"+pNo+"</a>";
			pagingArea += "</li>";
		}
		pagingArea += "<li class='paginate_button page-item next "; 
		if(this.endPage>=this.totalPages) {
			pagingArea += "disabled";
		}
		pagingArea += "' id='example2_next'><a ";
		pagingArea += "href='"+this.url+"?currentPage="+(this.startPage+blockSize)+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='7' ";
		pagingArea += "tabindex='0' class='page-link'>Next</a></li>";
		pagingArea += "</ul>";
		pagingArea += "</div>";
		pagingArea += "</div>";
	}


	//생성자(Constructor) : 페이징 객체 생성
		public ArticlePage(int total, int currentPage, int size
					,List<T> content, String keyword,int blockSize) {
			//size : 한 화면에 보여질 목록의 행 수
			this.total = total;
			this.currentPage = currentPage;
			this.keyword = keyword;
			this.content = content;
			this.blockSize=blockSize;
			//전체 글 수가 0이면?
			if(total==0) {
				this.totalPages = 0;//전체 페이지 수
				this.startPage = 0;//블록 시작번호
				this.endPage = 0;//블록 종료번호
				this.blockSize = blockSize;
			}else {//글이 있다면?
				//전체 페이지 수 = 전체글 수 / 한 화면에 보여질 목록의 행 수
				//3 = 31 / 10
				this.totalPages = total / size; //3페이지
				//나머지가 있다면, 페이지를 1 증가
				if(total % size > 0) {//ex) 나머지 1
					this.totalPages++;//4페이지
				}
				
				//페이지 블록시작번호를 구하는 공식
				// 블록시작번호 = 현재페이지 / 블록크기 * 블록크기 + 1
				 this.startPage = currentPage / blockSize * blockSize + 1;
				//현재페이지 % 블록크기 => 0일 때 보정
				if(currentPage % blockSize == 0) {
					this.startPage -= blockSize;
				}
				
				//블록종료번호 = 블록시작번호 + (블록크기 - 1)
				//[1][2][3][4][5][다음]
				this.endPage = this.startPage + (blockSize - 1);
				
				//블록종료번호 > 전체페이지수
				if(this.endPage > this.totalPages) {
					this.endPage = this.totalPages;
				}
			}
			
			pagingArea += "<div class='col-sm-12 col-md-7'>";
			pagingArea += "<div class='dataTables_paginate paging_simple_numbers' id='example2_paginate'>";
			pagingArea += "<ul class='pagination'>";
			pagingArea += "<li class='paginate_button page-item previous "; 
			if(this.startPage<6) {
				pagingArea += "disabled ";
			}
			pagingArea += "'";
			pagingArea += "id='example2_previous'>";
			pagingArea += "<a href='"+this.url+"?currentPage="+(this.startPage-blockSize)+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='0' tabindex='0' ";
			pagingArea += "class='page-link'>Previous</a></li>";
			
			for(int pNo=this.startPage;pNo<=this.endPage;pNo++) {		
			pagingArea += "<li class='paginate_button page-item ";
				if(this.currentPage == pNo) {
					pagingArea += "active";
				}
				pagingArea += "'>";
				pagingArea += "<a href='"+this.url+"?currentPage="+pNo+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='1' tabindex='0' ";
				pagingArea += "class='page-link'>"+pNo+"</a>";
				pagingArea += "</li>";
			}
			pagingArea += "<li class='paginate_button page-item next "; 
			if(this.endPage>=this.totalPages) {
				pagingArea += "disabled";
			}
			pagingArea += "' id='example2_next'><a ";
			pagingArea += "href='"+this.url+"?currentPage="+(this.startPage+blockSize)+"&keyword="+this.keyword+"' aria-controls='example2' data-dt-idx='7' ";
			pagingArea += "tabindex='0' class='page-link'>Next</a></li>";
			pagingArea += "</ul>";
			pagingArea += "</div>";
			pagingArea += "</div>";
		}
	
}













