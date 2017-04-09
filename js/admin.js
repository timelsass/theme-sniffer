jQuery( document ).ready(function($) {
	'use strict';

	var count = 0;

	$('#check-status').click(function(){
		count = 0;
		$('.theme-check-report').empty();
		$('.progress-bar').remove();
		$('.theme-check-report').before('<div class="progress-bar"><span>Check starting...</span></div>');
		themeCheckRunPHPCS();
	});

	function themeCheckRunPHPCS(){
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				'action': 'ns_theme_check_run',
				'themename': $('select[name=themename]').val(),
				'hide_warning': $('input[name=hide_warning]').is(':checked'),
				'raw_output': $('input[name=raw_output]').is(':checked'),
				'minimum_php_version': $('select[name=minimum_php_version]').val(),
				'wordpress-theme': $('input[name=wordpress-theme]').is(':checked'),
				'wordpress-core': $('input[name=wordpress-core]').is(':checked'),
				'wordpress-extra': $('input[name=wordpress-extra]').is(':checked'),
				'wordpress-docs': $('input[name=wordpress-docs]').is(':checked'),
				'wordpress-vip': $('input[name=wordpress-vip]').is(':checked'),
				'ns_theme_check_nonce': $('#ns_theme_check_nonce').val(),
			},
			success:function(data) {
				var data_out = JSON.parse(data);
				var theme_name  = data_out[0];
				var theme_args  = data_out[1];
				var theme_files = data_out[2];
				var total_files = Object.keys(theme_files).length;

				_.each( theme_files, function(file) {
					individualSniff( theme_name, theme_args, file, total_files );
				});

			},
			error: function(errorThrown){
				console.log(errorThrown);
			}
		});
	}

	function individualSniff( theme_name, theme_args, theme_file, total_files ) {
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				'action': 'ns_theme_check_sniff',
				'theme_name': theme_name,
				'theme_args': theme_args,
				'file': theme_file,
				'ns_theme_check_nonce': $('#ns_theme_check_nonce').val(),
			},
			success:function(data) {
				count++;
				var percentComplete = (( count / total_files ) * 100).toFixed(2);
				$('.progress-bar').html( '<span>Percent completed: ' + percentComplete + '%</span>' ).append('<span class="meter" style="width: ' + percentComplete + '%"></span>');
				$('.theme-check-report').append(data);
			},
			error: function(errorThrown){
				console.log(errorThrown);
			}
		})
	}
});
