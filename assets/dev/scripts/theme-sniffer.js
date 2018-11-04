/* global ajaxurl, localizationObject */

import $ from 'jquery';
import {ajax} from './utils/ajax';

export default class ThemeSniffer {
	constructor( options ) {
		this.SHOW_CLASS        = 'is-shown';
		this.ERROR_CLASS       = 'is-error';
		this.WARNING_CLASS     = 'is-warning';
		this.DISABLED_CLASS    = 'is-disabled';
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

			let args;

			if ( response.success === true ) {

				// const themeName     	 = response.data[0];
				// const themeArgs     	 = response.data[1];
				// const themeFilesRaw 	 = response.data[2];
				// const themeFilesExcluded = response.data[3];
				// const totalFiles    	 = Object.keys( themeFilesRaw ).length;
				// const themeFiles    	 = Object.values( themeFilesRaw );

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
				this.$snifferInfo.html( response.data[0].message );
			}
		}, ( xhr, textStatus, errorThrown ) => {
			throw new Error( `Error: ${errorThrown}: ${xhr} ${textStatus}` );
		}
		);
	}

	renderJSON( json, reportElement, args ) {
		if ( typeof json.data === 'undefined' || json.data === null ) {
			return `<div>${localizationObject.errorReport}</div>`;
		}

		let report;
		if ( typeof args !== 'undefined' ) {
			if ( args.rawOutput ) {
				return json.data;
			}
		}

		// if ( typeof json.data.totals === 'undefined' || json.data.totals === null ) {
		// 	return false;
		// }

		// if ( json.data.totals.errors === 0 && json.data.totals.warnings === 0 ) {
		// 	return false;
		// }

		report = reportElement;

		const $reportItemHeading = report.find( this.reportItemHeading );
		const $reportReportTable = report.find( this.reportReportTable );
		const $reportNoticeType  = report.find( this.reportNoticeType );

		const filepath = Object.keys( json.data.files )[0].split( '/themes/' )[1];
		const notices  = Object.values( json.data.files )[0].messages;

		$reportItemHeading.text( filepath );

		$.each(
			notices, ( index, val ) => {
				const line        = val.line;
				const message     = val.message;
				const type        = val.type;
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

	bumpProgressBar( count, totalFiles ) {
		const completed = ( ( ( count ) / totalFiles ) * 100 ).toFixed( 2 );
		this.$percentageCount.text( `${completed} % ` );
		this.$meterBar.css( 'width', `${completed} % ` );
	}
}
