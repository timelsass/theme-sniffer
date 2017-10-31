/* global localizationObject */

import $ from 'jquery';
import ThemeSniffer from './theme-sniffer';

$(function() {
  const $sniffReport = $('.js-sniff-report');
  const $progressBar = $('.js-progress-bar');
  const $snifferInfo = $('.js-sniffer-info');
  const $checkNotice = $('.js-check-done');
  const $percentageBar = $('.js-percentage-bar');
  const $percentageCount = $('.js-percentage-count');
  const $errorNotice = $('.js-error-notice');
  const $startNotice = $('.js-start-notice');
  const $meterBar = $('.js-meter-bar');
  const $reportItem = $('.js-report-item');
  const reportItemHeading = '.js-report-item-heading';
  const reportReportTable = '.js-report-table';
  const reportNoticeType = '.js-report-notice-type';
  const reportItemLine = '.js-report-item-line';
  const reportItemType = '.js-report-item-type';
  const reportItemMessage = '.js-report-item-message';

  const options = {
    sniffReport: $sniffReport,
    progressBar: $progressBar,
    snifferInfo: $snifferInfo,
    checkNotice: $checkNotice,
    percentageBar: $percentageBar,
    percentageCount: $percentageCount,
    errorNotice: $errorNotice,
    startNotice: $startNotice,
    meterBar: $meterBar,
    reportItem: $reportItem,
    reportItemHeading: reportItemHeading,
    reportReportTable: reportReportTable,
    reportNoticeType: reportNoticeType,
    reportItemLine: reportItemLine,
    reportItemType: reportItemType,
    reportItemMessage: reportItemMessage,
    nonce: localizationObject.restNonce
  };

  const themeSniffer = new ThemeSniffer(options);

  $('.js-start-check').on('click', function() {
    const theme = $('select[name=themename]').val();
    const warningHide = $('input[name=hide_warning]').is(':checked');
    const outputRaw = $('input[name=raw_output]').is(':checked');
    const minPHPVersion = $('select[name=minimum_php_version]').val();
    const selectedRulesets = [];

    $('input[name="selected_ruleset[]"]:checked').each(function() {
      selectedRulesets.push(this.value);
    });

    themeSniffer.enableAjax();
    themeSniffer.themeCheckRunPHPCS(this, theme, warningHide, outputRaw, minPHPVersion, selectedRulesets);
  });

  $('.js-stop-check').on('click', function() {
    themeSniffer.preventAjax('.js-start-check');
  });

  $('select[name="themename"]').on('change', function() {
    if ($progressBar.hasClass('is-shown')) {
      $progressBar.removeClass('is-shown');
    }

    if ($sniffReport.length) {
      $sniffReport.empty();
    }
  });
});
