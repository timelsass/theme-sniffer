/* global ajaxurl, localizationObject */

import $ from 'jquery';
import {ajax} from './utils/ajax';

export default class ThemeSniffer {
	constructor( options ) {
		this.SHOW_CLASS        = 'is-shown';
		this.ERROR_CLASS       = 'is-error';
		this.WARNING_CLASS     = 'is-warning';
		this.DISABLED_CLASS    = 'is-disabled';
		this.IS_RAW_CLASS      = 'is-raw';
		this.reportItemHeading = options.reportItemHeading;
		this.reportReportTable = options.reportReportTable;
		this.reportNoticeType  = options.reportNoticeType;
		this.reportItemLine    = options.reportItemLine;
		this.reportItemType    = options.reportItemType;
		this.reportItemMessage = options.reportItemMessage;

		this.$sniffReport     = options.sniffReport;
		this.$progressBar     = options.progressBar;
		this.$snifferInfo     = options.snifferInfo;
		this.$checkNotice     = options.checkNotice;
		this.$percentageBar   = options.percentageBar;
		this.$percentageText  = options.percentageText;
		this.$percentageCount = options.percentageCount;
		this.$errorNotice     = options.errorNotice;
		this.$startNotice     = options.startNotice;
		this.$meterBar        = options.meterBar;
		this.$reportItem      = options.reportItem;
		this.nonce            = options.nonce;
		this.runAction        = options.runAction;
		this.runSniff         = options.runSniff;

		this.count     = 0;
		this.ajaxAllow = true;

		this.renderJSON = this.renderJSON.bind( this );
	}

	enableAjax() {
		this.ajaxAllow = true;
		this.$snifferInfo.removeClass( this.SHOW_CLASS );
	}

	preventAjax( enableButton ) {
		this.ajaxAllow = false;
		this.$percentageText.html( localizationObject.ajaxStopped );
		this.$percentageCount.removeClass( this.SHOW_CLASS );
		$( enableButton ).removeClass( this.DISABLED_CLASS );
	}

	themeCheckRunPHPCS( button, theme, warningHide, outputRaw, ignoreAnnotations, minPHPVersion, selectedRulesets, themePrefixes ) {
		const snifferRunData = {
			themeName: theme,
			hideWarning: warningHide,
			rawOutput: outputRaw,
			ignoreAnnotations: ignoreAnnotations,
			minimumPHPVersion: minPHPVersion,
			themePrefixes: themePrefixes,
			wpRulesets: selectedRulesets,
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
				beforeSend: () => {
					this.$startNotice.addClass( this.SHOW_CLASS );
					this.$progressBar.removeClass( this.SHOW_CLASS );
					this.$errorNotice.removeClass( this.SHOW_CLASS );
					this.$checkNotice.removeClass( this.SHOW_CLASS );
					this.$percentageBar.removeClass( this.SHOW_CLASS );
					this.$percentageCount.empty();
					this.$meterBar.css( 'width', 0 );
					this.$sniffReport.empty();
					this.$snifferInfo.empty();
					$( button ).addClass( this.DISABLED_CLASS );
				}
			}
		).then( ( response ) => {
			this.$progressBar.addClass( this.SHOW_CLASS );
			this.$percentageBar.addClass( this.SHOW_CLASS );
			this.$percentageCount.addClass( this.SHOW_CLASS );
			this.$meterBar.addClass( this.SHOW_CLASS );
			this.count = 0;

			if ( response.success === true ) {
				let args = new Object();

				this.$startNotice.removeClass( this.SHOW_CLASS );
				this.$percentageText.text( localizationObject.percentComplete );


				if ( outputRaw ) {
					args.rawOutput = true;
				}

				const $clonedReportElement = this.$reportItem.clone().addClass( this.SHOW_CLASS );
				const sniffWrapper         = this.renderJSON( response, $clonedReportElement, args );
				this.$sniffReport.append( sniffWrapper );
			} else {
				this.$progressBar.addClass( this.ERROR_CLASS );
				this.$snifferInfo.addClass( this.SHOW_CLASS );
			}
		}, ( xhr, textStatus, errorThrown ) => {
			throw new Error( `Error: ${errorThrown}: ${xhr} ${textStatus}` );
		}
		);
	}

	renderJSON( json, reportElement, args ) {
		let report;

		if ( typeof args !== 'undefined' ) {
			if ( args.rawOutput ) {
				this.$sniffReport.addClass( this.IS_RAW_CLASS );
				return json.data;
			}
		}

		report = reportElement;

		const $reportItemHeading = report.find( this.reportItemHeading );
		const $reportReportTable = report.find( this.reportReportTable );
		const $reportNoticeType  = report.find( this.reportNoticeType );

		const files = Object.entries( json.files );

		$.each(
			files, ( ind, val ) => {
				const filepath = val[0];
				const details  = val[1];

				$reportItemHeading.text( filepath.split( '/themes/' )[1]);
				const messages 	  = details.messages;

				$.each(
					messages, ( index, value ) => {
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
			}
		);

		$reportNoticeType.remove();

		return report;
	}
}
