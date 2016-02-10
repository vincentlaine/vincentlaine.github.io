function init(){
	$(".header-div").css("height", ($(window).height()-$("#nav-div").height()));

	if($(window).scrollTop() >= $(".header-div").height())
		$("#nav-div").addClass("navbar-fixed");
	else
		$("#nav-div").removeClass("navbar-fixed");

	$(document).ready(function(){
		$('.scrollspy').scrollSpy({offset: 100});
		$('.modal-trigger').leanModal();

		if($(window).width() > 1100)
			$('.div-chart').removeClass().addClass("div-chart col s3");
		else if ($(window).width() > 400)
			$('.div-chart').removeClass().addClass("div-chart col s6");
		else
			$('.div-chart').removeClass().addClass("div-chart col s12");
	});

	$(".button-collapse").sideNav();
};

window.onresize = function(event) {
	$(".header-div").css("height", ($(window).height()-$("#nav-div").height()));

	if($(window).width() > 1100)
		$('.div-chart').removeClass().addClass("div-chart col s3");
	else if ($(window).width() > 400)
		$('.div-chart').removeClass().addClass("div-chart col s6");
	else
		$('.div-chart').removeClass().addClass("div-chart col s12");
};

window.onscroll = function () {
	if($(window).scrollTop() >= $(".header-div").height()){
		$("#nav-div").addClass("navbar-fixed");
	} else {
		$("#nav-div").removeClass("navbar-fixed");
	}
};

init();