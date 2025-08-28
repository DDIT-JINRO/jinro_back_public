/**
 * 
 */

document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('openPrivacyPolicy').addEventListener('click', function() {
		window.open('/join/privacyPolicy.do', 'privacyPolicyPopup', 'width=800,height=700,scrollbars=yes,resizable=yes');
	});

	document.getElementById('openShowTermsOfService').addEventListener('click', function() {
		window.open('/join/termsOfService.do', 'termsOfServicePopup', 'width=800,height=700,scrollbars=yes,resizable=yes');
	});
	
	document.getElementById('youthProtectionPolicy').addEventListener('click', function() {
		window.open('/join/youthProtectionPolicy.do', 'youthProtectionPolicy', 'width=800,height=700,scrollbars=yes,resizable=yes');
	});
})




