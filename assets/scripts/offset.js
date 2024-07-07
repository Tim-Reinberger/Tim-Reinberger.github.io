window.addEventListener('DOMContentLoaded', (setOffset))
window.addEventListener('resize', (setOffset))


function setOffset() {
	try {
		var topButton = document.getElementById("topButton");
		var topButtonHeight = document.getElementById("topButton").offsetHeight;
		topButton.nextElementSibling.style.marginTop = topButtonHeight + "px";
	} catch(err) {
		console.log('No top button found.');
	}
	
	try {
		var bottomButton = document.getElementById("bottomButton");
		var bottomButtonHeight = document.getElementById("bottomButton").offsetHeight;
		bottomButton.previousElementSibling.style.marginBottom = bottomButtonHeight + 5 + "px";
	} catch(err) {
		console.log('No bottom button found.');
	}

	console.log('Offset set.');
}