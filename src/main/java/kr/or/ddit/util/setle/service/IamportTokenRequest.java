package kr.or.ddit.util.setle.service;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IamportTokenRequest {

	@JsonProperty("imp_key")
	private String impKey;

	@JsonProperty("imp_secret")
	private String impSecret;

	public IamportTokenRequest() {
	}

	public IamportTokenRequest(String impKey, String impSecret) {
		this.impKey = impKey;
		this.impSecret = impSecret;
	}

	public String getImpKey() {
		return impKey;
	}

	public void setImpKey(String impKey) {
		this.impKey = impKey;
	}

	public String getImpSecret() {
		return impSecret;
	}

	public void setImpSecret(String impSecret) {
		this.impSecret = impSecret;
	}

}
