(function($){

	"use strict";

	$(document).ready(function() {

		//	FastClick	

	    FastClick.attach(document.body);

		//	Smooth scroll

		try {
	        $.browserSelector();
	          if($("html").hasClass("chrome" || "opera")) {
	            $.smoothScroll();
	          }
	    } catch(err) {}


		// Preloader

      	$(window).load(function() {
      		$(".preloader").fadeOut("slow", function(){
      			$(".preloader-left").addClass("slide-left");
      			$(".preloader-right").addClass("slide-right");
      			$("#portfolio-case").addClass("full-portfolio");
      		});
		});

		//	Like function

		$(".like").on("click", function() {
			$(this).toggleClass("like-it");
		});

	});

})(jQuery);