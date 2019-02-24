/* global ajaxurl, themeSnifferLocalization */

import $ from 'jquery';
import {ajax} from './utils/ajax';

export default class ThemeSniffer {
	constructor( options ) {
		this.SHOW_CLASS     = 'is-shown';
		this.ERROR_CLASS    = 'is-error';
		this.WARNING_CLASS  = 'is-warning';
		this.DISABLED_CLASS = 'is-disabled';
		this.IS_RAW_CLASS   = 'is-raw';

		this.reportItemHeading = options.reportItemHeading;
		this.reportReportTable = options.reportReportTable;
		this.reportNoticeType  = options.reportNoticeType;
		this.reportItemLine    = options.reportItemLine;
		this.reportItemType    = options.reportItemType;
		this.reportItemMessage = options.reportItemMessage;

		this.$sniffReport = options.sniffReport;
		this.$snifferInfo = options.snifferInfo;
		this.$checkNotice = options.checkNotice;
		this.$startNotice = options.startNotice;
		this.$reportItem  = options.reportItem;
		this.$loader  = options.loader;

		this.$startButton  = $( options.startButton );
		this.$stopButton  = $( options.stopButton );

		this.nonce     = options.nonce;
		this.runAction = options.runAction;

		this.ajaxRequest = [];
		this.ajaxAllow = true;

		this.renderJSON = this.renderJSON.bind( this );
		this.showNotices = this.showNotices.bind( this );
		this.hideNotices = this.hideNotices.bind( this );
	}

	enableAjax() {
		this.ajaxAllow = true;
		this.$snifferInfo.removeClass( this.SHOW_CLASS );
	}

	preventAjax() {
		this.ajaxAllow = false;

		this.$startButton.removeClass( this.DISABLED_CLASS );
		this.$stopButton.addClass( this.DISABLED_CLASS );
		this.$loader.removeClass( this.SHOW_CLASS );

		this.$startNotice.html( themeSnifferLocalization.ajaxAborted ).addClass( this.SHOW_CLASS );

		// This will trigger error in console, but it's not an error per se.
		// It's expected behavior.
		$.each( this.ajaxRequest, ( idx, jqXHR ) => {
			jqXHR.abort([ themeSnifferLocalization.ajaxAborted ]);
		});

	}

	renderRaw( data, element ) {
		element.append( data );
	}

	renderJSON( json ) {
		let report;

		report = this.$reportItem.clone().addClass( this.SHOW_CLASS );

		const $reportItemHeading = report.find( this.reportItemHeading );
		const $reportReportTable = report.find( this.reportReportTable );
		const $reportNoticeType  = report.find( this.reportNoticeType );

		$reportItemHeading.text( json.filePath.split( '/themes/' )[1]);

		$.each(
			json.messages, ( index, value ) => {

				const line        = value.line || 0;
				const message     = value.message;
				const type        = value.type;
				const $singleItem = $reportNoticeType.clone().addClass( type.toLowerCase() );

				$singleItem.find( this.reportItemLine ).text( line );
				$singleItem.find( this.reportItemType ).text( type );
				$singleItem.find( this.reportItemMessage ).text( message );
				$singleItem.appendTo( $reportReportTable );
			}
		);

		$reportNoticeType.remove();

		return report;
	}

	showNotices( message ) {
		this.$startNotice.html( message ).addClass( this.SHOW_CLASS );
		this.$checkNotice.removeClass( this.SHOW_CLASS );
		this.$loader.addClass( this.SHOW_CLASS );
		this.$startButton.addClass( this.DISABLED_CLASS );
		this.$stopButton.removeClass( this.DISABLED_CLASS );
	}

	hideNotices( message, showNotice ) {
		this.$startNotice.html( message ).addClass( this.SHOW_CLASS );
		this.$loader.removeClass( this.SHOW_CLASS );
		this.$stopButton.addClass( this.DISABLED_CLASS );
		this.$startButton.removeClass( this.DISABLED_CLASS );
		if ( showNotice ) {
			this.$checkNotice.addClass( this.SHOW_CLASS );
		}
	}

	themeCheckRunPHPCS( theme, warningHide, outputRaw, ignoreAnnotations, checkPhpOnly, minPHPVersion, selectedRulesets, themePrefixes ) {

		const snifferRunData = {
			themeName: theme,
			hideWarning: warningHide,
			rawOutput: outputRaw,
			ignoreAnnotations: ignoreAnnotations,
			checkPhpOnly: checkPhpOnly,
			minimumPHPVersion: minPHPVersion,
			wpRulesets: selectedRulesets,
			themePrefixes: themePrefixes,
			action: this.runAction,
			nonce: this.nonce
		};

		if ( ! this.ajaxAllow ) {
			return false;
		}

		return ajax(
			{
				type: 'POST',
				url: ajaxurl,
				data: snifferRunData,
				beforeSend: ( jqXHR ) => {
					this.showNotices( themeSnifferLocalization.checkInProgress );
					if ( ! outputRaw ) {
						this.$sniffReport.removeClass( this.IS_RAW_CLASS );
					}
					this.$sniffReport.empty();
					this.$snifferInfo.empty();
					this.ajaxRequest.push( jqXHR );
				}
			}
		).then( ( response ) => {
			if ( response.success === true ) {
				this.$startNotice.removeClass( this.SHOW_CLASS );

				if ( outputRaw ) {
					this.hideNotices( themeSnifferLocalization.checkCompleted, true );
					const report = this.$sniffReport.addClass( this.IS_RAW_CLASS );
					this.renderRaw( response.data, report );
					return;
				}

				$.each(
					response.files, ( ind, val ) => {
						this.$sniffReport.append( this.renderJSON( val ) );
					}
				);

				this.hideNotices( themeSnifferLocalization.checkCompleted, true );
			} else {
				this.hideNotices( themeSnifferLocalization.errorReport, false );
				this.$snifferInfo.addClass( this.SHOW_CLASS ).addClass( this.ERROR_CLASS ).text( response.data[0].message );
			}
		}, ( xhr, textStatus, errorThrown ) => {
			throw new Error( `Error: ${errorThrown}: ${xhr} ${textStatus}` );
		}
		);
	}
}
