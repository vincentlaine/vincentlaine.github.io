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

	var $elem = $("#contact");
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.outerHeight(true);

    if(elemTop <= docViewBottom){
	    if((elemBottom <= docViewBottom) && (elemTop >= docViewTop)){
	    	$("#nav-div .hide-on-med-and-down [href='#contact']").addClass("active");
	    	$("#nav-div .hide-on-med-and-down [href='#more']").removeClass("active");
	    } else if(elemTop >= docViewTop){
	    	$("#nav-div .hide-on-med-and-down [href='#more']").addClass("active");
	    	$("#nav-div .hide-on-med-and-down [href='#contact']").removeClass("active");
	    }
	}
};

$("#discoverMe").click(function() {
    $('html,body').animate({
        scrollTop: $("#about").offset().top - 121},
        'slow');
});

init();