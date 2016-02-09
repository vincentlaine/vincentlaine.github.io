function init(){
	$(".header-div").css("height", ($(window).height()-120));

	if($(window).scrollTop() >= $(".header-div").height())
		$("#nav-div").addClass("navbar-fixed");
	else
		$("#nav-div").removeClass("navbar-fixed");

	$(document).ready(function(){
		$('.scrollspy').scrollSpy({offset: 100});
    	$('.modal-trigger').leanModal();
	});

	$(".button-collapse").sideNav();
};

window.onresize = function(event) {
	$(".header-div").css("height", ($(window).height()-120));
};

window.onscroll = function () {
	if($(window).scrollTop() >= $(".header-div").height()){
		$("#nav-div").addClass("navbar-fixed");
	} else {
		$("#nav-div").removeClass("navbar-fixed");
	}
};

init();