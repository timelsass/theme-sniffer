/* global localizationObject */

import $ from 'jquery';
import ajax from './utils/ajax';

export default class ThemeSniffer {
  construct(options) {
    this.SHOW_CLASS = 'is-shown';
    this.SHOW_ERROR_CLASS = 'install-error';
    this.$sniffReport = options.sniffReport;
    this.$progressBar = options.progressBar;
    this.$snifferInfo = options.snifferInfo;
    this.$checkNotice = options.checkNotice;
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
      url: `${localizationObject.root}wp/v2/theme-sniffer/sniff-run`,
      data: snifferRunData,
      beforeSend: (xhr) => {
        this.$progressBar.removeClass(this.SHOW_CLASS);
        this.checkNotice.removeClass(this.SHOW_CLASS);
        this.$sniffReport.empty();
        xhr.setRequestHeader('X-WP-Nonce', this.nonce);
      }
    }).then((response) => {
      this.$progressBar.addClass(this.SHOW_CLASS);

      if (response.success === true) {
        const themeName = response.data[0];
        const themeArgs = response.data[1];
        const themeFilesRaw = response.data[2];
        const totalFiles = Object.keys(themeFilesRaw).length;
        let fileNumber = 0;
        const themeFiles = themeFilesRaw.reduce((result, value) => {
          result[fileNumber] = value;
          fileNumber++;
          return result;
        }, {});
        this.individualSniff(themeName, themeArgs, themeFiles, totalFiles, fileNumber = 0);
      } else {
        this.$snifferInfo.addClass(this.SHOW_CLASS);
        this.$snifferInfo.html(response.data[0].message);
        this.$progressBar.addClass(this.SHOW_ERROR_CLASS);
      }
    }, (xhr, textStatus, errorThrown) => {
      throw new Error(`Error: ${errorThrown}: ${textStatus}`);
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
      url: `${localizationObject.root}wp/v2/theme-sniffer/individual-sniff`,
      data: individualSniffData,
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', this.nonce);
      }
    }).then((response) => {
      this.count++;
      this.bumpProgressBar(this.count, totalFiles);
      const sniffWrapper = this.renderJSON(response);
      this.$sniffReport.append(sniffWrapper);

      if (fileNumber < totalFiles) {
        this.individualSniff(name, args, themeFiles, totalFiles, fileNumber);
      } else {
        this.checkNotice.addClass(this.SHOW_CLASS);
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
            message: localizationObject.sniff_error,
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
        this.$progressBar.addClass(this.SHOW_ERROR_CLASS);
        sniffWrapper = this.renderJSON(errorData);
      }
      this.$sniffReport.append(sniffWrapper);
    });
  }

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
    const completed = ((count / totalFiles) * 100).toFixed(2);
    $('.progress-bar').html(`<span>${localizationObject.percentComplete} + ${completed}%</span>`).append(`<span class="meter" style="width:${completed}%"></span>`);
  }


}

