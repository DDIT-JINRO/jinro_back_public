/**
 *
 */

function loginBtn(){

	const getUserId = document.getElementById('login-user-email').value
	const getUserPw = document.getElementById('login-user-password').value

	  fetch('/memberLogin',{
		  method: "POST",
		  headers :  {
			  "Content-Type": "application/json"
			  },
		  body: JSON.stringify({

			  memEmail : getUserId,
			  memPassword : getUserPw,
			  loginType : "normal"

		  })
	  })
	  .then(response => response.json())
	  .then(data => {
	    if(data.status=='success'){
			const redirectUrl = sessionStorage.getItem("redirectUrl");
			if (redirectUrl) {
				sessionStorage.removeItem("redirectUrl");
				location.href = redirectUrl;
			} else {
				location.href = "/";
			}
	    }
	  })
	  .catch(error => {
	    console.error('에러 발생:', error);
	  });
 	}

	const emailInput = document.getElementById('login-user-email');
	const pwInput = document.getElementById('login-user-password');
	emailInput.addEventListener('keydown', function(e){
		if(e.code === 'Enter') loginBtn();
	})
	pwInput.addEventListener('keydown', function(e){
		if(e.code === 'Enter') loginBtn();
	})