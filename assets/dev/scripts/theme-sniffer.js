/* global localizationObject */

import $ from 'jquery';
import ajax from './utils/ajax';

export default class ThemeSniffer {
  constructor(options) {
    this.SHOW_CLASS = 'is-shown';
    this.ERROR_CLASS = 'error';
    this.$sniffReport = options.sniffReport;
    this.$progressBar = options.progressBar;
    this.$snifferInfo = options.snifferInfo;
    this.$checkNotice = options.checkNotice;
    this.$percentageBar = options.percentageBar;
    this.$percentageCount = options.percentageCount;
    this.$errorNotice = options.errorNotice;
    this.$startNotice = options.startNotice;
    this.$meterBar = options.meterBar;
    this.nonce = options.nonce;
    this.count = 0;
  }

  themeCheckRunPHPCS(theme, warningHide, outputRaw, minPHPVersion, selectedRulesets) {
    const snifferRunData = {
      themeName: theme,
      hideWarning: warningHide,
      rawOutput: outputRaw,
      minimumPHPVersion: minPHPVersion,
      wpRulesets: selectedRulesets
    };

    return ajax({
      type: 'GET',
      url: `${localizationObject.root}theme-sniffer/v1/sniff-run`,
      data: snifferRunData,
      beforeSend: (xhr) => {
        this.$startNotice.addClass(this.SHOW_CLASS);
        this.$progressBar.removeClass(this.SHOW_CLASS);
        this.$errorNotice.removeClass(this.SHOW_CLASS);
        this.$checkNotice.removeClass(this.SHOW_CLASS);
        this.$percentageBar.removeClass(this.SHOW_CLASS);
        this.$percentageCount.empty();
        this.$meterBar.css('width', 0);
        this.$sniffReport.empty();

        xhr.setRequestHeader('X-WP-Nonce', this.nonce);
      }
    }).then((response) => {
      this.$progressBar.addClass(this.SHOW_CLASS);
      this.count = 0;

      if (response.success === true) {
        const themeName = response.data[0];
        const themeArgs = response.data[1];
        const themeFilesRaw = response.data[2];
        const totalFiles = Object.keys(themeFilesRaw).length;
        let fileNumber = 0;
        const themeFiles = Object.values(themeFilesRaw).reduce((result, value) => {
          result[fileNumber] = value;
          fileNumber++;
          return result;
        }, {});
        this.$startNotice.removeClass(this.SHOW_CLASS);
        this.individualSniff(themeName, themeArgs, themeFiles, totalFiles, 0);
      } else {
        this.$progressBar.addClass(this.ERROR_CLASS);
        this.$snifferInfo.addClass(this.SHOW_CLASS);
        this.$snifferInfo.html(response.data[0].message);
      }
    }, (xhr, textStatus, errorThrown) => {
      throw new Error(`Error: ${errorThrown}: ${xhr} ${textStatus}`);
    });
  }

  individualSniff(name, args, themeFiles, totalFiles, fileNumber) {
    const individualSniffData = {
      themeName: name,
      themeArgs: args,
      file: themeFiles[fileNumber]
    };

    return ajax({
      type: 'GET',
      url: `${localizationObject.root}theme-sniffer/v1/individual-sniff`,
      data: individualSniffData,
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', this.nonce);
      }
    }).then((response) => {
      if (response.success === true) {
        this.count++;
        this.bumpProgressBar(this.count, totalFiles);
        const sniffWrapper = this.renderJSON(response);
        this.$sniffReport.append(sniffWrapper);

        if (this.count < totalFiles) {
          this.individualSniff(name, args, themeFiles, totalFiles, this.count);
        } else {
          this.$checkNotice.addClass(this.SHOW_CLASS);
        }
      } else {
        this.$snifferInfo.addClass(this.SHOW_CLASS);
        this.$snifferInfo.html(response.data[0].message);
        this.$progressBar.addClass(this.ERROR_CLASS);
      }
    }, (xhr) => {
      this.count++;
      let sniffWrapper = '';
      this.bumpProgressBar(this.count, totalFiles);

      if (xhr.status === 500) {
        const filesVal = {};
        filesVal[themeFiles[fileNumber]] = {
          errors: 1,
          warnings: 0,
          messages: [{
            column: 1,
            fixable: false,
            line: 1,
            message: localizationObject.sniffError,
            severity: 5,
            type: 'ERROR'
          }]
        };
        const errorData = {
          success: false,
          data: {
            files: filesVal,
            totals: {
              errors: 1,
              fixable: 0,
              warnings: 0,
              fatalError: 1
            }
          }
        };
        this.$progressBar.addClass(this.ERROR_CLASS);
        sniffWrapper = this.renderJSON(errorData);
      }
      this.$sniffReport.append(sniffWrapper);
    });
  }

  // This needs to be refactored. Table should be set in the DOM, and then cloned and filled here.
  renderJSON(json) {
    if (typeof json.data === 'undefined' || json.data === null) {
      return;
    }

    if (typeof json.data.totals === 'undefined' || json.data.totals === null) {
      return;
    }

    if (json.data.totals.errors === 0 && json.data.totals.warnings === 0) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'report-file-item';

    const heading = document.createElement('div');
    heading.className = 'report-file-heading';

    const table = document.createElement('table');
    table.className = 'report-table';

    $.each(json.data.files, (files, value) => {
      const filepath = files.split('/themes/');
      heading.textContent = filepath[1];

      $.each(value.messages, (index, val) => {
        const row = document.createElement('tr');

        row.className = 'item-type-warning';

        if (val.type === 'ERROR') {
          row.className = 'item-type-error';
        }

        const line = document.createElement('td');
        line.className = 'td-line';
        line.textContent = val.line;
        row.appendChild(line);

        const type = document.createElement('td');
        type.className = 'td-type';
        type.textContent = val.type;
        row.appendChild(type);

        const message = document.createElement('td');
        message.className = 'td-message';
        message.textContent = val.message;
        row.appendChild(message);

        table.appendChild(row);
      });
    });

    wrapper.appendChild(heading);
    wrapper.appendChild(table);

    return wrapper;
  }

  bumpProgressBar(count, totalFiles) {
    const completed = (((count) / totalFiles) * 100).toFixed(2);
    this.$percentageBar.addClass(this.SHOW_CLASS);
    this.$percentageCount.addClass(this.SHOW_CLASS);
    this.$meterBar.addClass(this.SHOW_CLASS);
    this.$percentageCount.text(`${completed}%`);
    this.$meterBar.css('width', `${completed}%`);
  }
}

