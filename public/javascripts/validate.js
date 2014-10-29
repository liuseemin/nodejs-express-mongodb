$(document).ready( function() {
	$('#password').blur( function() {
		$(this).parent().children('span').remove();
		$(this).parent().children('h6').remove();
		if ($(this).val().length < 6) {
			$(this).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
			$(this).parent().append("<h6 class='text-danger'>Password need to be longer than 6 words!</h6>");
			$(this).parent().parents('.form-group').removeClass('has-success').addClass('has-error has-feedback');
		} else {
			$(this).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
			$(this).parent().parents('.form-group').removeClass('has-error').addClass('has-success has-feedback');
		}
	});

	$('#confirm').blur( function() {
		$(this).parent().children('span').remove();
		$(this).parent().children('h6').remove();
		if ($('#password').val().length >= 6 && $(this).val() != $('#password').val()) {
			$(this).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
			$(this).parent().append("<h6 class='text-danger'>Incompatible password, try again!</h6>");
			$(this).parent().parents('.form-group').removeClass('has-success').addClass('has-error has-feedback');
		} else if ($('#password').val().length >= 6) {
			$(this).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
			$(this).parent().parents('.form-group').removeClass('has-error').addClass('has-success has-feedback');
		}
	});

	$('#username').blur( function() {

		$(this).parent().children('span').remove();
		$(this).parent().children('h6').remove();

		var parameters = {
			check: $(this).val()
		};
		$.get('/signup', parameters, function(data) {
			if (data == 'error') {
				$('#username').parent().append("<h6 class='text-danger'>ERROR! Cannot connect to database!</h6>");
			} else if (data == 'pass') {
				$('#username').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
				$('#username').parent().parents('.form-group').removeClass('has-error').addClass('has-success has-feedback');
			} else if (data == 'notpass') {
				$('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
				$('#username').parent().append("<h6 class='text-danger'>This name has already been used!</h6>");
				$('#username').parent().parents('.form-group').removeClass('has-success').addClass('has-error has-feedback');
			}
		});
	})
})