import $ from 'jquery';
import ThemeSniffer from './theme-sniffer';

$(
	function() {
		const options = {
			sniffReport: $( '.js-sniff-report' ),
			snifferInfo: $( '.js-sniffer-info' ),
			checkNotice: $( '.js-check-done' ),
			startNotice: $( '.js-start-notice' ),
			reportItem: $( '.js-report-item' ),
			reportItemHeading: '.js-report-item-heading',
			reportReportTable: '.js-report-table',
			reportNoticeType: '.js-report-notice-type',
			reportItemLine: '.js-report-item-line',
			reportItemType: '.js-report-item-type',
			reportItemMessage: '.js-report-item-message',
			runAction: 'run_sniffer',
			nonce: $( '#theme_sniffer_nonce' ).val()
		};

		const themeSniffer = new ThemeSniffer( options );

		$( '.js-start-check' ).on(
			'click', () => {
				const theme             = $( 'select[name=themename]' ).val();
				const warningHide       = $( 'input[name=hide_warning]' ).is( ':checked' );
				const outputRaw         = $( 'input[name=raw_output]' ).is( ':checked' );
				const ignoreAnnotations = $( 'input[name=ignore_annotations]' ).is( ':checked' );
				const minPHPVersion     = $( 'select[name=minimum_php_version]' ).val();
				const themePrefixes     = $( 'input[name=theme_prefixes]' ).val();

				const selectedRulesets = $( 'input[name="selected_ruleset[]"]:checked' ).map( ( ind, el ) => el.value ).toArray();

				themeSniffer.enableAjax();
				themeSniffer.themeCheckRunPHPCS( this, theme, warningHide, outputRaw, ignoreAnnotations, minPHPVersion, selectedRulesets, themePrefixes );
			}
		);

		$( '.js-stop-check' ).on(
			'click', () => themeSniffer.preventAjax( '.js-start-check' )
		);

		$( 'select[name="themename"]' ).on(
			'change', () => {
				themeSniffer.preventAjax( '.js-start-check' );

				if ( options.sniffReport.length ) {
					options.sniffReport.empty();
				}
			}
		);
	}
);
