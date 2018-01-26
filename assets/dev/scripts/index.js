/* global localizationObject */

import $ from 'jquery';
import ThemeSniffer from './theme-sniffer';

$( function( ) {
	const options = {
		sniffReport: $( '.js-sniff-report' ),
		progressBar: $( '.js-progress-bar' ),
		snifferInfo: $( '.js-sniffer-info' ),
		checkNotice: $( '.js-check-done' ),
		percentageBar: $( '.js-percentage-bar' ),
		percentageText: $( '.js-percentage-text' ),
		percentageCount: $( '.js-percentage-count' ),
		errorNotice: $( '.js-error-notice' ),
		startNotice: $( '.js-start-notice' ),
		meterBar: $( '.js-meter-bar' ),
		reportItem: $( '.js-report-item' ),
		reportItemHeading: '.js-report-item-heading',
		reportReportTable: '.js-report-table',
		reportNoticeType: '.js-report-notice-type',
		reportItemLine: '.js-report-item-line',
		reportItemType: '.js-report-item-type',
		reportItemMessage: '.js-report-item-message',
		nonce: localizationObject.restNonce
	};

	const themeSniffer = new ThemeSniffer( options );

	$( '.js-start-check' ).on( 'click', function( ) {
		const theme = $( 'select[name=themename]' ).val( );
		const warningHide = $( 'input[name=hide_warning]' ).is( ':checked' );
		const outputRaw = $( 'input[name=raw_output]' ).is( ':checked' );
		const minPHPVersion = $( 'select[name=minimum_php_version]' ).val( );
		const selectedRulesets = [];

		$( 'input[name="selected_ruleset[]"]:checked' ).each( function( ) {
			selectedRulesets.push( this.value );
		});

		themeSniffer.enableAjax( );
		themeSniffer.themeCheckRunPHPCS( this, theme, warningHide, outputRaw, minPHPVersion, selectedRulesets );
	});

	$( '.js-stop-check' ).on( 'click', function( ) {
		themeSniffer.preventAjax( '.js-start-check' );
	});

	$( 'select[name="themename"]' ).on( 'change', function( ) {
		themeSniffer.preventAjax( '.js-start-check' );

		if ( options.progressBar.hasClass( 'is-shown' ) ) {
			options.progressBar.removeClass( 'is-shown' );
		}

		if ( options.sniffReport.length ) {
			options.sniffReport.empty( );
		}
	});
});
