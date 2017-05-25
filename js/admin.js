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
				var data_out    = JSON.parse(data),
					theme_name  = data_out[0],
					theme_args  = data_out[1],
					theme_files_raw = data_out[2],
					total_files = Object.keys(theme_files_raw).length,
					file_number = 0;

					var theme_files = _.reduce(theme_files_raw, function(result, value, key) {
						result[file_number] = value;
						file_number++;
						return result;
					}, {});
console.log('bla');
					individualSniff( theme_name, theme_args, theme_files, total_files );
			},
			error: function(errorThrown){
				console.log(errorThrown);
			}
		});
	}

	function individualSniff( theme_name, theme_args, theme_files, total_files ) {
			var file_no = 0;

			function sniffAjaxCall(file_no) {
				$.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {
						'action': 'ns_theme_check_sniff',
						'theme_name': theme_name,
						'theme_args': theme_args,
						'file': theme_files[file_no],
						'ns_theme_check_nonce': $('#ns_theme_check_nonce').val(),
					},
					success: function(data, status, xhr) {
						count++;
						var percentComplete = (( count / total_files ) * 100).toFixed(2);
						$('.progress-bar').html( '<span>Percent completed: ' + percentComplete + '%</span>' ).append('<span class="meter" style="width: ' + percentComplete + '%"></span>');
						renderJSON(data);
					},
					complete: function() {
						file_no++;
						if (file_no < total_files) {
							sniffAjaxCall(file_no);
						}
					},
					error: function(xhr, status, errorThrown){
						if ( 500 === xhr.status) {

						}
					}
				});
				return false;
			}

			sniffAjaxCall(file_no);

	}

	function renderJSON( json ) {
		if ( typeof json.data == "undefined" || json.data == null ) {
			return;
		}

		if ( 0 == json.data.totals.errors && 0 == json.data.totals.warnings ) {
			return;
		}

		var wrapper = document.createElement('div');
		wrapper.className = "report-file-item";

		var heading = document.createElement('div');
		heading.className = "report-file-heading";

		var table = document.createElement('table');
		table.className = "report-table";

		$.each(json.data.files, function( files, value ){
			var filepath = files.split('/themes/');
			heading.textContent = filepath[1];

			$.each( value.messages, function( index, value ){

				var row = document.createElement('tr');
				if ( 'ERROR' == value.type ) {
					row.className = "item-type-error";
				} else {
					row.className = "item-type-warning";
				}

				var line = document.createElement('td');
				line.className = "td-line";
				line.textContent = value.line;
				row.appendChild(line);

				var type = document.createElement('td');
				type.className = "td-type";
				type.textContent = value.type;
				row.appendChild(type);

				var message = document.createElement('td');
				message.className = "td-message";
				message.textContent = value.message;
				row.appendChild(message);

				table.appendChild(row);
			} );

		});

		wrapper.appendChild(heading);
		wrapper.appendChild(table);

		$('.theme-check-report').append(wrapper);

	}
});
