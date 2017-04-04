jQuery( document ).ready(function($) {
	$('#check-status').click(function(){
		$('.theme-check-report').empty();
		$('.theme-check-report').before('<div class="progress-bar"></div>');
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
				$('.theme-check-report').html(data);
			},
			error: function(errorThrown){
				console.log(errorThrown);
			}
		});

		t = setTimeout( updateStatus, 1000 );

	}

	function updateStatus() {
		$.getJSON( ajax_object.output_json, function( data ) {
			console.log( data );
			var items = [];
			pbvalue = 0;
			if ( data ) {
				var total = data['total'];
				var current = data['current'];
				var pbvalue = Math.floor( (current / total) * 100 );
				if(pbvalue>0){
					$('.progress-bar').progressbar({
						value:pbvalue
					});
				}
			}
			if(pbvalue < 100){
				t = setTimeout( updateStatus, 1000);
			}
		});
	}
});