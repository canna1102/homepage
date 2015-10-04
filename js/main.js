(function($){

	"use strict";
console.profile();
	$(document).ready(function() {

		try {
	        $.browserSelector();
	          if($("html").hasClass("chrome" || "opera")) {
	            $.smoothScroll();
	          }
	    } catch(err) {}

      	$(window).load(function() {
      		$(".preloader").fadeOut("slow", function(){
      			$("#resume, #activity, #portfolio, #contact").removeClass("absolute");
      			$(".preloader-left").addClass("slide-left");
      			$(".preloader-right").addClass("slide-right");
      			setTimeout(function(){$('.tlt').textillate(); }, 1000);
		
      		});
		});

	    //	Features animation function

	    $("#profile .expand, #profile .expand-profile").on("click", function() {
			$("#profile").toggleClass("full-height").removeClass("profile");
			$("#profile .expand").hide();
		});

		$("#profile .expand-profile").on("click", function() {
			$("#profile").addClass("profile");
			$("#profile .expand").show();
		});

		$("#resume .expand").on("click", function() {
			$("#resume").toggleClass("full").toggleClass("full-height");
			$("#activity, #portfolio, #contact").toggleClass("zero").toggleClass("zero-height");
			$("#profile").toggleClass("profile-off");
			$(this).hide();			
		});

		$("#resume .close-icon").on("click", function() {
			$("#resume .expand").show();
			$(this).hide();
		});

		$("#activity .expand").on("click", function() {
			$("#activity").toggleClass("full").toggleClass("full-height");
			$("#resume, #portfolio, #contact").toggleClass("zero").toggleClass("zero-height");
			$("#profile").toggleClass("profile-off");
			$(this).hide();
		});

		$("#activity .close-icon").on("click", function() {
			$("#activity .expand").show();
			$(this).hide();
		});

		$("#portfolio .expand").on("click", function() {
			$("#portfolio").toggleClass("full").toggleClass("full-height");
			$("#resume, #activity, #contact").toggleClass("zero").toggleClass("zero-height");
			$("#profile").toggleClass("profile-off");
			$(this).hide();
		});

		$("#portfolio .close-icon").on("click", function() {
			$("#portfolio .expand").show();
			$(this).hide();
		});

		$(".contact-in-about").on("click", function() {
			$("#resume").scrollTop(0);
			$("#resume .close-icon").hide();
			$("#resume").toggleClass("zero").toggleClass("zero-height");
			$("#resume").toggleClass("full").toggleClass("full-height");
			$("#contact").toggleClass("zero").toggleClass("zero-height");
			$("#contact").toggleClass("full").toggleClass("full-height");
		});
		
		$("#contact .expand").on("click", function() {
			$("#contact").toggleClass("full").toggleClass("full-height");
			$("#resume, #activity, #portfolio").toggleClass("zero").toggleClass("zero-height");
			$("#profile").toggleClass("profile-off");
			$(this).hide();
		});

		$("#contact .close-icon").on("click", function() {
			$("#contact .expand").show();
			$("#resume .expand").show();
			$(this).hide();
		});

		$('.flexslider').flexslider();

		var masCon = jQuery("#portfolio-container");

		//	Shuffle function

		masCon.shuffle({
			itemSelector: ".portfolio-item" // the selector for the items in the grid
		});

		$('#filter a').click(function (e) {
			e.preventDefault();

			$('#filter a').removeClass('active');
			$(this).addClass('active');

			var groupName = $(this).attr('data-group');
			console.log(groupName)
			masCon.shuffle('shuffle', groupName);
		});

		// Ajax contact function

		$(":input[placeholder]").each (function () {
		    var input = $(this);
		    input.addClass("placeholder");
		    input.val(input.attr("placeholder"));
		 
		    $(this).focus(function() {
		      	var input = $(this);
		      	if (input.val() == input.attr("placeholder")) {
		        	input.val("");
		        	input.removeClass("placeholder");
		      	}
		    });

		    $(this).blur(function() {
		      	var input = $(this);
		      	if (input.val() == "" || input.val() == input.attr("placeholder")) {
			        input.addClass("placeholder");
			        input.val(input.attr("placeholder"));
		      	}
		    })
		});

		// placeholder snippet for older browsers [end]
		  
		// custom validation methods [start]
		
		$.validator.addMethod(
		    "notplaceholder", 
		    function(value, element){
		        return ($(element).attr("placeholder") != value);
			}, 
			"Please enter a value"
		);

		// custom validation methods [end]
		  
		// jquery validate initialisation

		$("#contact-form").validate({
		    rules: {
			    subject : {
			        required    : true,
			        notplaceholder  : true
		      	},
		      	name : {
			        required   : true,
			        notplaceholder  : true
		      	},
		      	email : {
			        required    : true,
			        email       : true,
			        notplaceholder  : true
		      },
		     	message : {
			        required : true,
			        notplaceholder  : true
		      	}
		    },
		    errorPlacement: function(error, element) {
		      	$(element).addClass("error");
		    },
		    submitHandler: function(form){

		    	$("#send").attr("value", "Sending...");
		    	$("#send").addClass("sending");

		        var hasError = false;   
		        if(!hasError) {
		            var formInput = $(form).serialize();
		              	$.post($(form).attr("action"),formInput, function(data){
		              		$("#send").attr("value", "Send");
		              		$("#send").removeClass("sending");
		                	$(".contact-notification").addClass("success");
		              	}); 
		          	}
		        else {
		            alert("Sent error!");
		        }
		        return false; 
		    }
		});
		
		$("#reset").click(function(){
			$(":input[placeholder]").removeClass().addClass("placeholder");	
		});

	});

})(jQuery);

console.profileEnd();