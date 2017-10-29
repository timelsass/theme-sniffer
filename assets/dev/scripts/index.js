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
  const $meterBar = $('.js-meter-bar');
  let isSearchLoading = false; // This should be added along with the stopping button.

  const options = {
    sniffReport: $sniffReport,
    progressBar: $progressBar,
    snifferInfo: $snifferInfo,
    checkNotice: $checkNotice,
    percentageBar: $percentageBar,
    percentageCount: $percentageCount,
    errorNotice: $errorNotice,
    meterBar: $meterBar,
    nonce: localizationObject.restNonce
  };

  const themeSniffer = new ThemeSniffer(options);

  $('#check-status').on('click', function() {
    const theme = $('select[name=themename]').val();
    const warningHide = $('input[name=hide_warning]').is(':checked');
    const outputRaw = $('input[name=raw_output]').is(':checked');
    const minPHPVersion = $('select[name=minimum_php_version]').val();
    const selectedRulesets = [];

    $('input[name="selected_ruleset[]"]:checked').each(function() {
      selectedRulesets.push(this.value);
    });

    themeSniffer.themeCheckRunPHPCS(theme, warningHide, outputRaw, minPHPVersion, selectedRulesets);
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
