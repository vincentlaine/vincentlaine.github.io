function init(){
	$(".header-div").css("height", ($(window).height()-120));

	if($(window).scrollTop() >= $(".header-div").height())
		$("#nav-div").addClass("navbar-fixed");
	else
		$("#nav-div").removeClass("navbar-fixed");

	$(document).ready(function(){
		$('.scrollspy').scrollSpy({offset: 100});
    	$('.modal-trigger').leanModal();

    	var left;
		left = ($(".header-div").width()/2 - $('#header-info').width()/2);
		console.log($(".header-div").width()/2);
		console.log($('#header-info').width()/2);
		console.log(left);
	    $('#header-info').css("left", left);
	});

	$(".button-collapse").sideNav();
};

window.onresize = function(event) {
	$(".header-div").css("height", ($(window).height()-120));

	var left;
	left = ($(".header-div").width()/2 - $('#header-info').width()/2);
	$('#header-info').css("left", left);
};

window.onscroll = function () {
	if($(window).scrollTop() >= $(".header-div").height()){
		$("#nav-div").addClass("navbar-fixed");
	} else {
		$("#nav-div").removeClass("navbar-fixed");
	}
};

init();