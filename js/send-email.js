$(function() {
    // Get the form.
    var form = $('#contact-form');
	$(form).submit(function(event) {
		// Stop the browser from submitting the form.
		event.preventDefault();

		// TODO
		
		// Serialize the form data.
		var formData = $(form).serialize();
		
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		});
	});

});