/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/dev/application.js":
/*!***********************************!*\
  !*** ./assets/dev/application.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./styles/application.scss */ "./assets/dev/styles/application.scss");

__webpack_require__(/*! ./scripts/index */ "./assets/dev/scripts/index.js");

/***/ }),

/***/ "./assets/dev/scripts/index.js":
/*!*************************************!*\
  !*** ./assets/dev/scripts/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _themeSniffer = __webpack_require__(/*! ./theme-sniffer */ "./assets/dev/scripts/theme-sniffer.js");

var _themeSniffer2 = _interopRequireDefault(_themeSniffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(function () {
	var options = {
		sniffReport: (0, _jquery2.default)('.js-sniff-report'),
		progressBar: (0, _jquery2.default)('.js-progress-bar'),
		snifferInfo: (0, _jquery2.default)('.js-sniffer-info'),
		checkNotice: (0, _jquery2.default)('.js-check-done'),
		percentageBar: (0, _jquery2.default)('.js-percentage-bar'),
		percentageText: (0, _jquery2.default)('.js-percentage-text'),
		percentageCount: (0, _jquery2.default)('.js-percentage-count'),
		errorNotice: (0, _jquery2.default)('.js-error-notice'),
		startNotice: (0, _jquery2.default)('.js-start-notice'),
		meterBar: (0, _jquery2.default)('.js-meter-bar'),
		reportItem: (0, _jquery2.default)('.js-report-item'),
		reportItemHeading: '.js-report-item-heading',
		reportReportTable: '.js-report-table',
		reportNoticeType: '.js-report-notice-type',
		reportItemLine: '.js-report-item-line',
		reportItemType: '.js-report-item-type',
		reportItemMessage: '.js-report-item-message',
		runAction: 'run_sniffer',
		runSniff: 'individual_sniff',
		nonce: (0, _jquery2.default)('#theme_sniffer_nonce').val()
	};

	var themeSniffer = new _themeSniffer2.default(options);

	(0, _jquery2.default)('.js-start-check').on('click', function () {
		var theme = (0, _jquery2.default)('select[name=themename]').val();
		var warningHide = (0, _jquery2.default)('input[name=hide_warning]').is(':checked');
		var outputRaw = (0, _jquery2.default)('input[name=raw_output]').is(':checked');
		var ignoreAnnotations = (0, _jquery2.default)('input[name=ignore_annotations]').is(':checked');
		var minPHPVersion = (0, _jquery2.default)('select[name=minimum_php_version]').val();
		var selectedRulesets = [];

		(0, _jquery2.default)('input[name="selected_ruleset[]"]:checked').each(function () {
			selectedRulesets.push(this.value);
		});

		themeSniffer.enableAjax();
		themeSniffer.themeCheckRunPHPCS(this, theme, warningHide, outputRaw, ignoreAnnotations, minPHPVersion, selectedRulesets);
	});

	(0, _jquery2.default)('.js-stop-check').on('click', function () {
		themeSniffer.preventAjax('.js-start-check');
	});

	(0, _jquery2.default)('select[name="themename"]').on('change', function () {
		themeSniffer.preventAjax('.js-start-check');

		if (options.progressBar.hasClass('is-shown')) {
			options.progressBar.removeClass('is-shown');
		}

		if (options.sniffReport.length) {
			options.sniffReport.empty();
		}
	});
});

/***/ }),

/***/ "./assets/dev/scripts/theme-sniffer.js":
/*!*********************************************!*\
  !*** ./assets/dev/scripts/theme-sniffer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global ajaxurl, localizationObject */

var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _ajax = __webpack_require__(/*! ./utils/ajax */ "./assets/dev/scripts/utils/ajax.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ThemeSniffer = function () {
	function ThemeSniffer(options) {
		_classCallCheck(this, ThemeSniffer);

		this.SHOW_CLASS = 'is-shown';
		this.ERROR_CLASS = 'is-error';
		this.WARNING_CLASS = 'is-warning';
		this.DISABLED_CLASS = 'is-disabled';
		this.reportItemHeading = options.reportItemHeading;
		this.reportReportTable = options.reportReportTable;
		this.reportNoticeType = options.reportNoticeType;
		this.reportItemLine = options.reportItemLine;
		this.reportItemType = options.reportItemType;
		this.reportItemMessage = options.reportItemMessage;

		this.$sniffReport = options.sniffReport;
		this.$progressBar = options.progressBar;
		this.$snifferInfo = options.snifferInfo;
		this.$checkNotice = options.checkNotice;
		this.$percentageBar = options.percentageBar;
		this.$percentageText = options.percentageText;
		this.$percentageCount = options.percentageCount;
		this.$errorNotice = options.errorNotice;
		this.$startNotice = options.startNotice;
		this.$meterBar = options.meterBar;
		this.$reportItem = options.reportItem;
		this.nonce = options.nonce;
		this.runAction = options.runAction;
		this.runSniff = options.runSniff;

		this.count = 0;
		this.ajaxAllow = true;
	}

	_createClass(ThemeSniffer, [{
		key: 'enableAjax',
		value: function enableAjax() {
			this.ajaxAllow = true;
			this.$snifferInfo.removeClass(this.SHOW_CLASS);
		}
	}, {
		key: 'preventAjax',
		value: function preventAjax(enableButton) {
			this.ajaxAllow = false;
			this.$percentageText.html(localizationObject.ajaxStopped);
			this.$percentageCount.removeClass(this.SHOW_CLASS);
			(0, _jquery2.default)(enableButton).removeClass(this.DISABLED_CLASS);
		}
	}, {
		key: 'themeCheckRunPHPCS',
		value: function themeCheckRunPHPCS(button, theme, warningHide, outputRaw, ignoreAnnotations, minPHPVersion, selectedRulesets) {
			var _this = this;

			var snifferRunData = {
				themeName: theme,
				hideWarning: warningHide,
				rawOutput: outputRaw,
				ignoreAnnotations: ignoreAnnotations,
				minimumPHPVersion: minPHPVersion,
				wpRulesets: selectedRulesets,
				action: this.runAction,
				nonce: this.nonce
			};

			if (!this.ajaxAllow) {
				return false;
			}

			return (0, _ajax.ajax)({
				type: 'POST',
				url: ajaxurl,
				data: snifferRunData,
				beforeSend: function beforeSend() {
					_this.$startNotice.addClass(_this.SHOW_CLASS);
					_this.$progressBar.removeClass(_this.SHOW_CLASS);
					_this.$errorNotice.removeClass(_this.SHOW_CLASS);
					_this.$checkNotice.removeClass(_this.SHOW_CLASS);
					_this.$percentageBar.removeClass(_this.SHOW_CLASS);
					_this.$percentageCount.empty();
					_this.$meterBar.css('width', 0);
					_this.$sniffReport.empty();
					_this.$snifferInfo.empty();
					(0, _jquery2.default)(button).addClass(_this.DISABLED_CLASS);
				}
			}).then(function (response) {
				_this.$progressBar.addClass(_this.SHOW_CLASS);
				_this.$percentageBar.addClass(_this.SHOW_CLASS);
				_this.$percentageCount.addClass(_this.SHOW_CLASS);
				_this.$meterBar.addClass(_this.SHOW_CLASS);
				_this.count = 0;
				console.log(response);
				if (response.success === true) {
					var themeName = response.data[0];
					var themeArgs = response.data[1];
					var themeFilesRaw = response.data[2];
					var themeFilesExcluded = response.data[3];
					var totalFiles = Object.keys(themeFilesRaw).length;
					var themeFiles = Object.values(themeFilesRaw);
					_this.$startNotice.removeClass(_this.SHOW_CLASS);
					_this.$percentageText.text(localizationObject.percentComplete);
					console.log(themeName);
					console.log(themeArgs);
					console.log(themeFilesRaw);
					console.log(themeFilesExcluded);
					console.log(totalFiles);
					console.log(themeFiles);
					// this.individualSniff( button, themeName, themeArgs, themeFiles, totalFiles, 0 );
				} else {
					_this.$progressBar.addClass(_this.ERROR_CLASS);
					_this.$snifferInfo.addClass(_this.SHOW_CLASS);
					_this.$snifferInfo.html(response.data[0].message);
				}
			}, function (xhr, textStatus, errorThrown) {
				throw new Error('Error: ' + errorThrown + ': ' + xhr + ' ' + textStatus);
			});
		}

		// individualSniff( button, name, args, themeFiles, totalFiles, fileNumber ) {
		// 	const individualSniffData = {
		// 		themeName: name,
		// 		themeArgs: args,
		// 		nonce: this.nonce,
		// 		action: this.runSniff,
		// 		file: themeFiles[fileNumber]
		// 	};

		// 	if ( ! this.ajaxAllow ) {
		// 		return false;
		// 	}

		// 	return ajax(
		// 		{
		// 			type: 'POST',
		// 			url: ajaxurl,
		// 			data: individualSniffData
		// 		}
		// 	).then( ( response ) => {
		// 		if ( response.success === true ) {
		// 			this.count++;
		// 			this.bumpProgressBar( this.count, totalFiles );
		// 			const $clonedReportElement = this.$reportItem.clone().addClass( this.SHOW_CLASS );
		// 			const sniffWrapper         = this.renderJSON( response, $clonedReportElement, args );
		// 			this.$sniffReport.append( sniffWrapper );

		// 			if ( this.count < totalFiles ) {
		// 				this.individualSniff( button, name, args, themeFiles, totalFiles, this.count );
		// 			} else {
		// 				this.$checkNotice.addClass( this.SHOW_CLASS );
		// 				$( button ).removeClass( this.DISABLED_CLASS );
		// 			}
		// 		} else {
		// 			this.$snifferInfo.addClass( this.SHOW_CLASS );
		// 			this.$snifferInfo.html( response.data[0].message );
		// 			this.$progressBar.addClass( this.ERROR_CLASS );
		// 		}
		// 	}, ( xhr ) => {
		// 		this.count++;
		// 		let sniffWrapper = '';
		// 		this.bumpProgressBar( this.count, totalFiles );
		// 		if ( xhr.status === 500 ) {
		// 			const filesVal                   = {};
		// 			filesVal[themeFiles[fileNumber]] = {
		// 				errors: 1,
		// 				warnings: 0,
		// 				messages: [ {
		// 					column: 1,
		// 					fixable: false,
		// 					line: 1,
		// 					message: localizationObject.sniffError,
		// 					severity: 5,
		// 					type: 'ERROR'
		// 				} ]
		// 			};
		// 			const errorData                  = {
		// 				success: false,
		// 				data: {
		// 					files: filesVal,
		// 					totals: {
		// 						errors: 1,
		// 						fixable: 0,
		// 						warnings: 0,
		// 						fatalError: 1
		// 					}
		// 				}
		// 			};
		// 			this.$progressBar.addClass( this.ERROR_CLASS );
		// 			sniffWrapper = this.renderJSON( errorData );
		// 		}
		// 		this.$sniffReport.append( sniffWrapper );
		// 	}
		// 	);
		// }

	}, {
		key: 'renderJSON',
		value: function renderJSON(json, reportElement, args) {
			var _this2 = this;

			if (typeof json.data === 'undefined' || json.data === null) {
				return ' < div > ' + localizationObject.errorReport + ' < / div > ';
			}

			var report = void 0;

			if (args.raw_output) {
				report = json.data;
			} else {
				if (typeof json.data.totals === 'undefined' || json.data.totals === null) {
					return false;
				}

				if (json.data.totals.errors === 0 && json.data.totals.warnings === 0) {
					return false;
				}

				report = reportElement;

				var $reportItemHeading = report.find(this.reportItemHeading);
				var $reportReportTable = report.find(this.reportReportTable);
				var $reportNoticeType = report.find(this.reportNoticeType);

				var filepath = Object.keys(json.data.files)[0].split('/themes/')[1];
				var notices = Object.values(json.data.files)[0].messages;

				$reportItemHeading.text(filepath);

				_jquery2.default.each(notices, function (index, val) {
					var line = val.line;
					var message = val.message;
					var type = val.type;
					var $singleItem = $reportNoticeType.clone().addClass(type.toLowerCase());
					$singleItem.find(_this2.reportItemLine).text(line);
					$singleItem.find(_this2.reportItemType).text(type);
					$singleItem.find(_this2.reportItemMessage).text(message);
					$singleItem.appendTo($reportReportTable);
				});

				$reportNoticeType.remove();
			}

			return report;
		}
	}, {
		key: 'bumpProgressBar',
		value: function bumpProgressBar(count, totalFiles) {
			var completed = (count / totalFiles * 100).toFixed(2);
			this.$percentageCount.text(completed + ' % ');
			this.$meterBar.css('width', completed + ' % ');
		}
	}]);

	return ThemeSniffer;
}();

exports.default = ThemeSniffer;

/***/ }),

/***/ "./assets/dev/scripts/utils/ajax.js":
/*!******************************************!*\
  !*** ./assets/dev/scripts/utils/ajax.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ajax = undefined;

var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajax = exports.ajax = function ajax(options, resolve, reject) {
	return _jquery2.default.ajax(options).done(resolve).fail(reject);
};

/***/ }),

/***/ "./assets/dev/styles/application.scss":
/*!********************************************!*\
  !*** ./assets/dev/styles/application.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!*****************************************!*\
  !*** multi ./assets/dev/application.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/infinum-denis/vagrant-local/www/personal/wordpress-plugin/public_html/wp-content/plugins/theme-sniffer/assets/dev/application.js */"./assets/dev/application.js");


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rldi9hcHBsaWNhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZGV2L3NjcmlwdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rldi9zY3JpcHRzL3RoZW1lLXNuaWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rldi9zY3JpcHRzL3V0aWxzL2FqYXguanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rldi9zdHlsZXMvYXBwbGljYXRpb24uc2NzcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqUXVlcnlcIiJdLCJuYW1lcyI6WyJvcHRpb25zIiwic25pZmZSZXBvcnQiLCJwcm9ncmVzc0JhciIsInNuaWZmZXJJbmZvIiwiY2hlY2tOb3RpY2UiLCJwZXJjZW50YWdlQmFyIiwicGVyY2VudGFnZVRleHQiLCJwZXJjZW50YWdlQ291bnQiLCJlcnJvck5vdGljZSIsInN0YXJ0Tm90aWNlIiwibWV0ZXJCYXIiLCJyZXBvcnRJdGVtIiwicmVwb3J0SXRlbUhlYWRpbmciLCJyZXBvcnRSZXBvcnRUYWJsZSIsInJlcG9ydE5vdGljZVR5cGUiLCJyZXBvcnRJdGVtTGluZSIsInJlcG9ydEl0ZW1UeXBlIiwicmVwb3J0SXRlbU1lc3NhZ2UiLCJydW5BY3Rpb24iLCJydW5TbmlmZiIsIm5vbmNlIiwidmFsIiwidGhlbWVTbmlmZmVyIiwiVGhlbWVTbmlmZmVyIiwib24iLCJ0aGVtZSIsIndhcm5pbmdIaWRlIiwiaXMiLCJvdXRwdXRSYXciLCJpZ25vcmVBbm5vdGF0aW9ucyIsIm1pblBIUFZlcnNpb24iLCJzZWxlY3RlZFJ1bGVzZXRzIiwiZWFjaCIsInB1c2giLCJ2YWx1ZSIsImVuYWJsZUFqYXgiLCJ0aGVtZUNoZWNrUnVuUEhQQ1MiLCJwcmV2ZW50QWpheCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJsZW5ndGgiLCJlbXB0eSIsIlNIT1dfQ0xBU1MiLCJFUlJPUl9DTEFTUyIsIldBUk5JTkdfQ0xBU1MiLCJESVNBQkxFRF9DTEFTUyIsIiRzbmlmZlJlcG9ydCIsIiRwcm9ncmVzc0JhciIsIiRzbmlmZmVySW5mbyIsIiRjaGVja05vdGljZSIsIiRwZXJjZW50YWdlQmFyIiwiJHBlcmNlbnRhZ2VUZXh0IiwiJHBlcmNlbnRhZ2VDb3VudCIsIiRlcnJvck5vdGljZSIsIiRzdGFydE5vdGljZSIsIiRtZXRlckJhciIsIiRyZXBvcnRJdGVtIiwiY291bnQiLCJhamF4QWxsb3ciLCJlbmFibGVCdXR0b24iLCJodG1sIiwibG9jYWxpemF0aW9uT2JqZWN0IiwiYWpheFN0b3BwZWQiLCJidXR0b24iLCJzbmlmZmVyUnVuRGF0YSIsInRoZW1lTmFtZSIsImhpZGVXYXJuaW5nIiwicmF3T3V0cHV0IiwibWluaW11bVBIUFZlcnNpb24iLCJ3cFJ1bGVzZXRzIiwiYWN0aW9uIiwidHlwZSIsInVybCIsImFqYXh1cmwiLCJkYXRhIiwiYmVmb3JlU2VuZCIsImFkZENsYXNzIiwiY3NzIiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsInN1Y2Nlc3MiLCJ0aGVtZUFyZ3MiLCJ0aGVtZUZpbGVzUmF3IiwidGhlbWVGaWxlc0V4Y2x1ZGVkIiwidG90YWxGaWxlcyIsIk9iamVjdCIsImtleXMiLCJ0aGVtZUZpbGVzIiwidmFsdWVzIiwidGV4dCIsInBlcmNlbnRDb21wbGV0ZSIsIm1lc3NhZ2UiLCJ4aHIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJFcnJvciIsImpzb24iLCJyZXBvcnRFbGVtZW50IiwiYXJncyIsImVycm9yUmVwb3J0IiwicmVwb3J0IiwicmF3X291dHB1dCIsInRvdGFscyIsImVycm9ycyIsIndhcm5pbmdzIiwiJHJlcG9ydEl0ZW1IZWFkaW5nIiwiZmluZCIsIiRyZXBvcnRSZXBvcnRUYWJsZSIsIiRyZXBvcnROb3RpY2VUeXBlIiwiZmlsZXBhdGgiLCJmaWxlcyIsInNwbGl0Iiwibm90aWNlcyIsIm1lc3NhZ2VzIiwiJCIsImluZGV4IiwibGluZSIsIiRzaW5nbGVJdGVtIiwiY2xvbmUiLCJ0b0xvd2VyQ2FzZSIsImFwcGVuZFRvIiwicmVtb3ZlIiwiY29tcGxldGVkIiwidG9GaXhlZCIsImFqYXgiLCJyZXNvbHZlIiwicmVqZWN0IiwiZG9uZSIsImZhaWwiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRUE7O0FBR0EsNEU7Ozs7Ozs7Ozs7Ozs7O0FDSkE7Ozs7QUFDQTs7Ozs7O0FBRUEsc0JBQUcsWUFBWTtBQUNkLEtBQU1BLFVBQVU7QUFDZkMsZUFBYSxzQkFBRyxrQkFBSCxDQURFO0FBRWZDLGVBQWEsc0JBQUcsa0JBQUgsQ0FGRTtBQUdmQyxlQUFhLHNCQUFHLGtCQUFILENBSEU7QUFJZkMsZUFBYSxzQkFBRyxnQkFBSCxDQUpFO0FBS2ZDLGlCQUFlLHNCQUFHLG9CQUFILENBTEE7QUFNZkMsa0JBQWdCLHNCQUFHLHFCQUFILENBTkQ7QUFPZkMsbUJBQWlCLHNCQUFHLHNCQUFILENBUEY7QUFRZkMsZUFBYSxzQkFBRyxrQkFBSCxDQVJFO0FBU2ZDLGVBQWEsc0JBQUcsa0JBQUgsQ0FURTtBQVVmQyxZQUFVLHNCQUFHLGVBQUgsQ0FWSztBQVdmQyxjQUFZLHNCQUFHLGlCQUFILENBWEc7QUFZ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aUJBQXZCLEVBQTJDMEUsSUFBM0MsQ0FBaURFLE9BQWpEO0FBQ0EwQixpQkFBWUcsUUFBWixDQUFzQmIsa0JBQXRCO0FBQ0EsS0FWRjs7QUFhQUMsc0JBQWtCYSxNQUFsQjtBQUNBOztBQUVELFVBQU9yQixNQUFQO0FBQ0E7OztrQ0FFZ0I3QyxLLEVBQU82QixVLEVBQWE7QUFDcEMsT0FBTXNDLFlBQVksQ0FBTW5FLEtBQUYsR0FBWTZCLFVBQWQsR0FBNkIsR0FBL0IsRUFBcUN1QyxPQUFyQyxDQUE4QyxDQUE5QyxDQUFsQjtBQUNBLFFBQUt6RSxnQkFBTCxDQUFzQnVDLElBQXRCLENBQStCaUMsU0FBL0I7QUFDQSxRQUFLckUsU0FBTCxDQUFlc0IsR0FBZixDQUFvQixPQUFwQixFQUFnQytDLFNBQWhDO0FBQ0E7Ozs7OztrQkFoUG1CckcsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xyQjs7Ozs7O0FBRU8sSUFBTXVHLHNCQUFPLFNBQVBBLElBQU8sQ0FBRTlILE9BQUYsRUFBVytILE9BQVgsRUFBb0JDLE1BQXBCO0FBQUEsUUFBZ0NaLGlCQUFFVSxJQUFGLENBQVE5SCxPQUFSLEVBQ2xEaUksSUFEa0QsQ0FDNUNGLE9BRDRDLEVBRWxERyxJQUZrRCxDQUU1Q0YsTUFGNEMsQ0FBaEM7QUFBQSxDQUFiLEM7Ozs7Ozs7Ozs7O0FDRlAsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsd0IiLCJmaWxlIjoic2NyaXB0cy9hcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvLyBMb2FkIFN0eWxlc1xuaW1wb3J0ICcuL3N0eWxlcy9hcHBsaWNhdGlvbi5zY3NzJztcblxuLy8gTG9hZCBTY3JpcHRzXG5pbXBvcnQgJy4vc2NyaXB0cy9pbmRleCc7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFRoZW1lU25pZmZlciBmcm9tICcuL3RoZW1lLXNuaWZmZXInO1xuXG4kKCBmdW5jdGlvbiggKSB7XG5cdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0c25pZmZSZXBvcnQ6ICQoICcuanMtc25pZmYtcmVwb3J0JyApLFxuXHRcdHByb2dyZXNzQmFyOiAkKCAnLmpzLXByb2dyZXNzLWJhcicgKSxcblx0XHRzbmlmZmVySW5mbzogJCggJy5qcy1zbmlmZmVyLWluZm8nICksXG5cdFx0Y2hlY2tOb3RpY2U6ICQoICcuanMtY2hlY2stZG9uZScgKSxcblx0XHRwZXJjZW50YWdlQmFyOiAkKCAnLmpzLXBlcmNlbnRhZ2UtYmFyJyApLFxuXHRcdHBlcmNlbnRhZ2VUZXh0OiAkKCAnLmpzLXBlcmNlbnRhZ2UtdGV4dCcgKSxcblx0XHRwZXJjZW50YWdlQ291bnQ6ICQoICcuanMtcGVyY2VudGFnZS1jb3VudCcgKSxcblx0XHRlcnJvck5vdGljZTogJCggJy5qcy1lcnJvci1ub3RpY2UnICksXG5cdFx0c3RhcnROb3RpY2U6ICQoICcuanMtc3RhcnQtbm90aWNlJyApLFxuXHRcdG1ldGVyQmFyOiAkKCAnLmpzLW1ldGVyLWJhcicgKSxcblx0XHRyZXBvcnRJdGVtOiAkKCAnLmpzLXJlcG9ydC1pdGVtJyApLFxuXHRcdHJlcG9ydEl0ZW1IZWFkaW5nOiAnLmpzLXJlcG9ydC1pdGVtLWhlYWRpbmcnLFxuXHRcdHJlcG9ydFJlcG9ydFRhYmxlOiAnLmpzLXJlcG9ydC10YWJsZScsXG5cdFx0cmVwb3J0Tm90aWNlVHlwZTogJy5qcy1yZXBvcnQtbm90aWNlLXR5cGUnLFxuXHRcdHJlcG9ydEl0ZW1MaW5lOiAnLmpzLXJlcG9ydC1pdGVtLWxpbmUnLFxuXHRcdHJlcG9ydEl0ZW1UeXBlOiAnLmpzLXJlcG9ydC1pdGVtLXR5cGUnLFxuXHRcdHJlcG9ydEl0ZW1NZXNzYWdlOiAnLmpzLXJlcG9ydC1pdGVtLW1lc3NhZ2UnLFxuXHRcdHJ1bkFjdGlvbjogJ3J1bl9zbmlmZmVyJyxcblx0XHRydW5TbmlmZjogJ2luZGl2aWR1YWxfc25pZmYnLFxuXHRcdG5vbmNlOiAkKCAnI3RoZW1lX3NuaWZmZXJfbm9uY2UnICkudmFsKClcblx0fTtcblxuXHRjb25zdCB0aGVtZVNuaWZmZXIgPSBuZXcgVGhlbWVTbmlmZmVyKCBvcHRpb25zICk7XG5cblx0JCggJy5qcy1zdGFydC1jaGVjaycgKS5vbihcblx0XHQnY2xpY2snLCBmdW5jdGlvbiggKSB7XG5cdFx0XHRjb25zdCB0aGVtZSAgICAgICAgICAgICA9ICQoICdzZWxlY3RbbmFtZT10aGVtZW5hbWVdJyApLnZhbCgpO1xuXHRcdFx0Y29uc3Qgd2FybmluZ0hpZGUgICAgICAgPSAkKCAnaW5wdXRbbmFtZT1oaWRlX3dhcm5pbmddJyApLmlzKCAnOmNoZWNrZWQnICk7XG5cdFx0XHRjb25zdCBvdXRwdXRSYXcgICAgICAgICA9ICQoICdpbnB1dFtuYW1lPXJhd19vdXRwdXRdJyApLmlzKCAnOmNoZWNrZWQnICk7XG5cdFx0XHRjb25zdCBpZ25vcmVBbm5vdGF0aW9ucyA9ICQoICdpbnB1dFtuYW1lPWlnbm9yZV9hbm5vdGF0aW9uc10nICkuaXMoICc6Y2hlY2tlZCcgKTtcblx0XHRcdGNvbnN0IG1pblBIUFZlcnNpb24gICAgID0gJCggJ3NlbGVjdFtuYW1lPW1pbmltdW1fcGhwX3ZlcnNpb25dJyApLnZhbCgpO1xuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRSdWxlc2V0cyAgPSBbXTtcblxuXHRcdFx0JCggJ2lucHV0W25hbWU9XCJzZWxlY3RlZF9ydWxlc2V0W11cIl06Y2hlY2tlZCcgKS5lYWNoKFxuXHRcdFx0XHRmdW5jdGlvbiggKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRSdWxlc2V0cy5wdXNoKCB0aGlzLnZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdHRoZW1lU25pZmZlci5lbmFibGVBamF4KCk7XG5cdFx0XHR0aGVtZVNuaWZmZXIudGhlbWVDaGVja1J1blBIUENTKCB0aGlzLCB0aGVtZSwgd2FybmluZ0hpZGUsIG91dHB1dFJhdywgaWdub3JlQW5ub3RhdGlvbnMsIG1pblBIUFZlcnNpb24sIHNlbGVjdGVkUnVsZXNldHMgKTtcblx0XHR9XG5cdCk7XG5cblx0JCggJy5qcy1zdG9wLWNoZWNrJyApLm9uKFxuXHRcdCdjbGljaycsIGZ1bmN0aW9uKCApIHtcblx0XHRcdHRoZW1lU25pZmZlci5wcmV2ZW50QWpheCggJy5qcy1zdGFydC1jaGVjaycgKTtcblx0XHR9XG5cdCk7XG5cblx0JCggJ3NlbGVjdFtuYW1lPVwidGhlbWVuYW1lXCJdJyApLm9uKFxuXHRcdCdjaGFuZ2UnLCBmdW5jdGlvbiggKSB7XG5cdFx0XHR0aGVtZVNuaWZmZXIucHJldmVudEFqYXgoICcuanMtc3RhcnQtY2hlY2snICk7XG5cblx0XHRcdGlmICggb3B0aW9ucy5wcm9ncmVzc0Jhci5oYXNDbGFzcyggJ2lzLXNob3duJyApICkge1xuXHRcdFx0XHRvcHRpb25zLnByb2dyZXNzQmFyLnJlbW92ZUNsYXNzKCAnaXMtc2hvd24nICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggb3B0aW9ucy5zbmlmZlJlcG9ydC5sZW5ndGggKSB7XG5cdFx0XHRcdG9wdGlvbnMuc25pZmZSZXBvcnQuZW1wdHkoKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59KTtcbiIsIi8qIGdsb2JhbCBhamF4dXJsLCBsb2NhbGl6YXRpb25PYmplY3QgKi9cblxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCB7YWpheH0gZnJvbSAnLi91dGlscy9hamF4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbWVTbmlmZmVyIHtcblx0Y29uc3RydWN0b3IoIG9wdGlvbnMgKSB7XG5cdFx0dGhpcy5TSE9XX0NMQVNTICAgICAgICA9ICdpcy1zaG93bic7XG5cdFx0dGhpcy5FUlJPUl9DTEFTUyAgICAgICA9ICdpcy1lcnJvcic7XG5cdFx0dGhpcy5XQVJOSU5HX0NMQVNTICAgICA9ICdpcy13YXJuaW5nJztcblx0XHR0aGlzLkRJU0FCTEVEX0NMQVNTICAgID0gJ2lzLWRpc2FibGVkJztcblx0XHR0aGlzLnJlcG9ydEl0ZW1IZWFkaW5nID0gb3B0aW9ucy5yZXBvcnRJdGVtSGVhZGluZztcblx0XHR0aGlzLnJlcG9ydFJlcG9ydFRhYmxlID0gb3B0aW9ucy5yZXBvcnRSZXBvcnRUYWJsZTtcblx0XHR0aGlzLnJlcG9ydE5vdGljZVR5cGUgID0gb3B0aW9ucy5yZXBvcnROb3RpY2VUeXBlO1xuXHRcdHRoaXMucmVwb3J0SXRlbUxpbmUgICAgPSBvcHRpb25zLnJlcG9ydEl0ZW1MaW5lO1xuXHRcdHRoaXMucmVwb3J0SXRlbVR5cGUgICAgPSBvcHRpb25zLnJlcG9ydEl0ZW1UeXBlO1xuXHRcdHRoaXMucmVwb3J0SXRlbU1lc3NhZ2UgPSBvcHRpb25zLnJlcG9ydEl0ZW1NZXNzYWdlO1xuXG5cdFx0dGhpcy4kc25pZmZSZXBvcnQgICAgID0gb3B0aW9ucy5zbmlmZlJlcG9ydDtcblx0XHR0aGlzLiRwcm9ncmVzc0JhciAgICAgPSBvcHRpb25zLnByb2dyZXNzQmFyO1xuXHRcdHRoaXMuJHNuaWZmZXJJbmZvICAgICA9IG9wdGlvbnMuc25pZmZlckluZm87XG5cdFx0dGhpcy4kY2hlY2tOb3RpY2UgICAgID0gb3B0aW9ucy5jaGVja05vdGljZTtcblx0XHR0aGlzLiRwZXJjZW50YWdlQmFyICAgPSBvcHRpb25zLnBlcmNlbnRhZ2VCYXI7XG5cdFx0dGhpcy4kcGVyY2VudGFnZVRleHQgID0gb3B0aW9ucy5wZXJjZW50YWdlVGV4dDtcblx0XHR0aGlzLiRwZXJjZW50YWdlQ291bnQgPSBvcHRpb25zLnBlcmNlbnRhZ2VDb3VudDtcblx0XHR0aGlzLiRlcnJvck5vdGljZSAgICAgPSBvcHRpb25zLmVycm9yTm90aWNlO1xuXHRcdHRoaXMuJHN0YXJ0Tm90aWNlICAgICA9IG9wdGlvbnMuc3RhcnROb3RpY2U7XG5cdFx0dGhpcy4kbWV0ZXJCYXIgICAgICAgID0gb3B0aW9ucy5tZXRlckJhcjtcblx0XHR0aGlzLiRyZXBvcnRJdGVtICAgICAgPSBvcHRpb25zLnJlcG9ydEl0ZW07XG5cdFx0dGhpcy5ub25jZSAgICAgICAgICAgID0gb3B0aW9ucy5ub25jZTtcblx0XHR0aGlzLnJ1bkFjdGlvbiAgICAgICAgPSBvcHRpb25zLnJ1bkFjdGlvbjtcblx0XHR0aGlzLnJ1blNuaWZmICAgICAgICAgPSBvcHRpb25zLnJ1blNuaWZmO1xuXG5cdFx0dGhpcy5jb3VudCAgICAgPSAwO1xuXHRcdHRoaXMuYWpheEFsbG93ID0gdHJ1ZTtcblx0fVxuXG5cdGVuYWJsZUFqYXgoKSB7XG5cdFx0dGhpcy5hamF4QWxsb3cgPSB0cnVlO1xuXHRcdHRoaXMuJHNuaWZmZXJJbmZvLnJlbW92ZUNsYXNzKCB0aGlzLlNIT1dfQ0xBU1MgKTtcblx0fVxuXG5cdHByZXZlbnRBamF4KCBlbmFibGVCdXR0b24gKSB7XG5cdFx0dGhpcy5hamF4QWxsb3cgPSBmYWxzZTtcblx0XHR0aGlzLiRwZXJjZW50YWdlVGV4dC5odG1sKCBsb2NhbGl6YXRpb25PYmplY3QuYWpheFN0b3BwZWQgKTtcblx0XHR0aGlzLiRwZXJjZW50YWdlQ291bnQucmVtb3ZlQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdCQoIGVuYWJsZUJ1dHRvbiApLnJlbW92ZUNsYXNzKCB0aGlzLkRJU0FCTEVEX0NMQVNTICk7XG5cdH1cblxuXHR0aGVtZUNoZWNrUnVuUEhQQ1MoIGJ1dHRvbiwgdGhlbWUsIHdhcm5pbmdIaWRlLCBvdXRwdXRSYXcsIGlnbm9yZUFubm90YXRpb25zLCBtaW5QSFBWZXJzaW9uLCBzZWxlY3RlZFJ1bGVzZXRzICkge1xuXHRcdGNvbnN0IHNuaWZmZXJSdW5EYXRhID0ge1xuXHRcdFx0dGhlbWVOYW1lOiB0aGVtZSxcblx0XHRcdGhpZGVXYXJuaW5nOiB3YXJuaW5nSGlkZSxcblx0XHRcdHJhd091dHB1dDogb3V0cHV0UmF3LFxuXHRcdFx0aWdub3JlQW5ub3RhdGlvbnM6IGlnbm9yZUFubm90YXRpb25zLFxuXHRcdFx0bWluaW11bVBIUFZlcnNpb246IG1pblBIUFZlcnNpb24sXG5cdFx0XHR3cFJ1bGVzZXRzOiBzZWxlY3RlZFJ1bGVzZXRzLFxuXHRcdFx0YWN0aW9uOiB0aGlzLnJ1bkFjdGlvbixcblx0XHRcdG5vbmNlOiB0aGlzLm5vbmNlXG5cdFx0fTtcblxuXHRcdGlmICggISB0aGlzLmFqYXhBbGxvdyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYWpheChcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0XHRcdGRhdGE6IHNuaWZmZXJSdW5EYXRhLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy4kc3RhcnROb3RpY2UuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0XHRcdHRoaXMuJHByb2dyZXNzQmFyLnJlbW92ZUNsYXNzKCB0aGlzLlNIT1dfQ0xBU1MgKTtcblx0XHRcdFx0XHR0aGlzLiRlcnJvck5vdGljZS5yZW1vdmVDbGFzcyggdGhpcy5TSE9XX0NMQVNTICk7XG5cdFx0XHRcdFx0dGhpcy4kY2hlY2tOb3RpY2UucmVtb3ZlQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0XHRcdHRoaXMuJHBlcmNlbnRhZ2VCYXIucmVtb3ZlQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0XHRcdHRoaXMuJHBlcmNlbnRhZ2VDb3VudC5lbXB0eSgpO1xuXHRcdFx0XHRcdHRoaXMuJG1ldGVyQmFyLmNzcyggJ3dpZHRoJywgMCApO1xuXHRcdFx0XHRcdHRoaXMuJHNuaWZmUmVwb3J0LmVtcHR5KCk7XG5cdFx0XHRcdFx0dGhpcy4kc25pZmZlckluZm8uZW1wdHkoKTtcblx0XHRcdFx0XHQkKCBidXR0b24gKS5hZGRDbGFzcyggdGhpcy5ESVNBQkxFRF9DTEFTUyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KS50aGVuKCAoIHJlc3BvbnNlICkgPT4ge1xuXHRcdFx0dGhpcy4kcHJvZ3Jlc3NCYXIuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0dGhpcy4kcGVyY2VudGFnZUJhci5hZGRDbGFzcyggdGhpcy5TSE9XX0NMQVNTICk7XG5cdFx0XHR0aGlzLiRwZXJjZW50YWdlQ291bnQuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0dGhpcy4kbWV0ZXJCYXIuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0dGhpcy5jb3VudCA9IDA7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdFx0XHRcdGNvbnN0IHRoZW1lTmFtZSAgICAgXHQgPSByZXNwb25zZS5kYXRhWzBdO1xuXHRcdFx0XHRjb25zdCB0aGVtZUFyZ3MgICAgIFx0ID0gcmVzcG9uc2UuZGF0YVsxXTtcblx0XHRcdFx0Y29uc3QgdGhlbWVGaWxlc1JhdyBcdCA9IHJlc3BvbnNlLmRhdGFbMl07XG5cdFx0XHRcdGNvbnN0IHRoZW1lRmlsZXNFeGNsdWRlZCA9IHJlc3BvbnNlLmRhdGFbM107XG5cdFx0XHRcdGNvbnN0IHRvdGFsRmlsZXMgICAgXHQgPSBPYmplY3Qua2V5cyggdGhlbWVGaWxlc1JhdyApLmxlbmd0aDtcblx0XHRcdFx0Y29uc3QgdGhlbWVGaWxlcyAgICBcdCA9IE9iamVjdC52YWx1ZXMoIHRoZW1lRmlsZXNSYXcgKTtcblx0XHRcdFx0dGhpcy4kc3RhcnROb3RpY2UucmVtb3ZlQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHRcdFx0XHR0aGlzLiRwZXJjZW50YWdlVGV4dC50ZXh0KCBsb2NhbGl6YXRpb25PYmplY3QucGVyY2VudENvbXBsZXRlICk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoZW1lTmFtZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoZW1lQXJncyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoZW1lRmlsZXNSYXcpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0aGVtZUZpbGVzRXhjbHVkZWQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0b3RhbEZpbGVzKTtcblx0XHRcdFx0Y29uc29sZS5sb2codGhlbWVGaWxlcyk7XG5cdFx0XHRcdC8vIHRoaXMuaW5kaXZpZHVhbFNuaWZmKCBidXR0b24sIHRoZW1lTmFtZSwgdGhlbWVBcmdzLCB0aGVtZUZpbGVzLCB0b3RhbEZpbGVzLCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLiRwcm9ncmVzc0Jhci5hZGRDbGFzcyggdGhpcy5FUlJPUl9DTEFTUyApO1xuXHRcdFx0XHR0aGlzLiRzbmlmZmVySW5mby5hZGRDbGFzcyggdGhpcy5TSE9XX0NMQVNTICk7XG5cdFx0XHRcdHRoaXMuJHNuaWZmZXJJbmZvLmh0bWwoIHJlc3BvbnNlLmRhdGFbMF0ubWVzc2FnZSApO1xuXHRcdFx0fVxuXHRcdH0sICggeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93biApID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvciggYEVycm9yOiAke2Vycm9yVGhyb3dufTogJHt4aHJ9ICR7dGV4dFN0YXR1c31gICk7XG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvLyBpbmRpdmlkdWFsU25pZmYoIGJ1dHRvbiwgbmFtZSwgYXJncywgdGhlbWVGaWxlcywgdG90YWxGaWxlcywgZmlsZU51bWJlciApIHtcblx0Ly8gXHRjb25zdCBpbmRpdmlkdWFsU25pZmZEYXRhID0ge1xuXHQvLyBcdFx0dGhlbWVOYW1lOiBuYW1lLFxuXHQvLyBcdFx0dGhlbWVBcmdzOiBhcmdzLFxuXHQvLyBcdFx0bm9uY2U6IHRoaXMubm9uY2UsXG5cdC8vIFx0XHRhY3Rpb246IHRoaXMucnVuU25pZmYsXG5cdC8vIFx0XHRmaWxlOiB0aGVtZUZpbGVzW2ZpbGVOdW1iZXJdXG5cdC8vIFx0fTtcblxuXHQvLyBcdGlmICggISB0aGlzLmFqYXhBbGxvdyApIHtcblx0Ly8gXHRcdHJldHVybiBmYWxzZTtcblx0Ly8gXHR9XG5cblx0Ly8gXHRyZXR1cm4gYWpheChcblx0Ly8gXHRcdHtcblx0Ly8gXHRcdFx0dHlwZTogJ1BPU1QnLFxuXHQvLyBcdFx0XHR1cmw6IGFqYXh1cmwsXG5cdC8vIFx0XHRcdGRhdGE6IGluZGl2aWR1YWxTbmlmZkRhdGFcblx0Ly8gXHRcdH1cblx0Ly8gXHQpLnRoZW4oICggcmVzcG9uc2UgKSA9PiB7XG5cdC8vIFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdC8vIFx0XHRcdHRoaXMuY291bnQrKztcblx0Ly8gXHRcdFx0dGhpcy5idW1wUHJvZ3Jlc3NCYXIoIHRoaXMuY291bnQsIHRvdGFsRmlsZXMgKTtcblx0Ly8gXHRcdFx0Y29uc3QgJGNsb25lZFJlcG9ydEVsZW1lbnQgPSB0aGlzLiRyZXBvcnRJdGVtLmNsb25lKCkuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHQvLyBcdFx0XHRjb25zdCBzbmlmZldyYXBwZXIgICAgICAgICA9IHRoaXMucmVuZGVySlNPTiggcmVzcG9uc2UsICRjbG9uZWRSZXBvcnRFbGVtZW50LCBhcmdzICk7XG5cdC8vIFx0XHRcdHRoaXMuJHNuaWZmUmVwb3J0LmFwcGVuZCggc25pZmZXcmFwcGVyICk7XG5cblx0Ly8gXHRcdFx0aWYgKCB0aGlzLmNvdW50IDwgdG90YWxGaWxlcyApIHtcblx0Ly8gXHRcdFx0XHR0aGlzLmluZGl2aWR1YWxTbmlmZiggYnV0dG9uLCBuYW1lLCBhcmdzLCB0aGVtZUZpbGVzLCB0b3RhbEZpbGVzLCB0aGlzLmNvdW50ICk7XG5cdC8vIFx0XHRcdH0gZWxzZSB7XG5cdC8vIFx0XHRcdFx0dGhpcy4kY2hlY2tOb3RpY2UuYWRkQ2xhc3MoIHRoaXMuU0hPV19DTEFTUyApO1xuXHQvLyBcdFx0XHRcdCQoIGJ1dHRvbiApLnJlbW92ZUNsYXNzKCB0aGlzLkRJU0FCTEVEX0NMQVNTICk7XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH0gZWxzZSB7XG5cdC8vIFx0XHRcdHRoaXMuJHNuaWZmZXJJbmZvLmFkZENsYXNzKCB0aGlzLlNIT1dfQ0xBU1MgKTtcblx0Ly8gXHRcdFx0dGhpcy4kc25pZmZlckluZm8uaHRtbCggcmVzcG9uc2UuZGF0YVswXS5tZXNzYWdlICk7XG5cdC8vIFx0XHRcdHRoaXMuJHByb2dyZXNzQmFyLmFkZENsYXNzKCB0aGlzLkVSUk9SX0NMQVNTICk7XG5cdC8vIFx0XHR9XG5cdC8vIFx0fSwgKCB4aHIgKSA9PiB7XG5cdC8vIFx0XHR0aGlzLmNvdW50Kys7XG5cdC8vIFx0XHRsZXQgc25pZmZXcmFwcGVyID0gJyc7XG5cdC8vIFx0XHR0aGlzLmJ1bXBQcm9ncmVzc0JhciggdGhpcy5jb3VudCwgdG90YWxGaWxlcyApO1xuXHQvLyBcdFx0aWYgKCB4aHIuc3RhdHVzID09PSA1MDAgKSB7XG5cdC8vIFx0XHRcdGNvbnN0IGZpbGVzVmFsICAgICAgICAgICAgICAgICAgID0ge307XG5cdC8vIFx0XHRcdGZpbGVzVmFsW3RoZW1lRmlsZXNbZmlsZU51bWJlcl1dID0ge1xuXHQvLyBcdFx0XHRcdGVycm9yczogMSxcblx0Ly8gXHRcdFx0XHR3YXJuaW5nczogMCxcblx0Ly8gXHRcdFx0XHRtZXNzYWdlczogWyB7XG5cdC8vIFx0XHRcdFx0XHRjb2x1bW46IDEsXG5cdC8vIFx0XHRcdFx0XHRmaXhhYmxlOiBmYWxzZSxcblx0Ly8gXHRcdFx0XHRcdGxpbmU6IDEsXG5cdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBsb2NhbGl6YXRpb25PYmplY3Quc25pZmZFcnJvcixcblx0Ly8gXHRcdFx0XHRcdHNldmVyaXR5OiA1LFxuXHQvLyBcdFx0XHRcdFx0dHlwZTogJ0VSUk9SJ1xuXHQvLyBcdFx0XHRcdH0gXVxuXHQvLyBcdFx0XHR9O1xuXHQvLyBcdFx0XHRjb25zdCBlcnJvckRhdGEgICAgICAgICAgICAgICAgICA9IHtcblx0Ly8gXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0Ly8gXHRcdFx0XHRkYXRhOiB7XG5cdC8vIFx0XHRcdFx0XHRmaWxlczogZmlsZXNWYWwsXG5cdC8vIFx0XHRcdFx0XHR0b3RhbHM6IHtcblx0Ly8gXHRcdFx0XHRcdFx0ZXJyb3JzOiAxLFxuXHQvLyBcdFx0XHRcdFx0XHRmaXhhYmxlOiAwLFxuXHQvLyBcdFx0XHRcdFx0XHR3YXJuaW5nczogMCxcblx0Ly8gXHRcdFx0XHRcdFx0ZmF0YWxFcnJvcjogMVxuXHQvLyBcdFx0XHRcdFx0fVxuXHQvLyBcdFx0XHRcdH1cblx0Ly8gXHRcdFx0fTtcblx0Ly8gXHRcdFx0dGhpcy4kcHJvZ3Jlc3NCYXIuYWRkQ2xhc3MoIHRoaXMuRVJST1JfQ0xBU1MgKTtcblx0Ly8gXHRcdFx0c25pZmZXcmFwcGVyID0gdGhpcy5yZW5kZXJKU09OKCBlcnJvckRhdGEgKTtcblx0Ly8gXHRcdH1cblx0Ly8gXHRcdHRoaXMuJHNuaWZmUmVwb3J0LmFwcGVuZCggc25pZmZXcmFwcGVyICk7XG5cdC8vIFx0fVxuXHQvLyBcdCk7XG5cdC8vIH1cblxuXHRyZW5kZXJKU09OKCBqc29uLCByZXBvcnRFbGVtZW50LCBhcmdzICkge1xuXHRcdGlmICggdHlwZW9mIGpzb24uZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHwganNvbi5kYXRhID09PSBudWxsICkge1xuXHRcdFx0cmV0dXJuIGAgPCBkaXYgPiAke2xvY2FsaXphdGlvbk9iamVjdC5lcnJvclJlcG9ydH0gPCAvIGRpdiA+IGA7XG5cdFx0fVxuXG5cdFx0bGV0IHJlcG9ydDtcblxuXHRcdGlmICggYXJncy5yYXdfb3V0cHV0ICkge1xuXHRcdFx0cmVwb3J0ID0ganNvbi5kYXRhO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBqc29uLmRhdGEudG90YWxzID09PSAndW5kZWZpbmVkJyB8fCBqc29uLmRhdGEudG90YWxzID09PSBudWxsICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgganNvbi5kYXRhLnRvdGFscy5lcnJvcnMgPT09IDAgJiYganNvbi5kYXRhLnRvdGFscy53YXJuaW5ncyA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXBvcnQgPSByZXBvcnRFbGVtZW50O1xuXG5cdFx0XHRjb25zdCAkcmVwb3J0SXRlbUhlYWRpbmcgPSByZXBvcnQuZmluZCggdGhpcy5yZXBvcnRJdGVtSGVhZGluZyApO1xuXHRcdFx0Y29uc3QgJHJlcG9ydFJlcG9ydFRhYmxlID0gcmVwb3J0LmZpbmQoIHRoaXMucmVwb3J0UmVwb3J0VGFibGUgKTtcblx0XHRcdGNvbnN0ICRyZXBvcnROb3RpY2VUeXBlICA9IHJlcG9ydC5maW5kKCB0aGlzLnJlcG9ydE5vdGljZVR5cGUgKTtcblxuXHRcdFx0Y29uc3QgZmlsZXBhdGggPSBPYmplY3Qua2V5cygganNvbi5kYXRhLmZpbGVzIClbMF0uc3BsaXQoICcvdGhlbWVzLycgKVsxXTtcblx0XHRcdGNvbnN0IG5vdGljZXMgID0gT2JqZWN0LnZhbHVlcygganNvbi5kYXRhLmZpbGVzIClbMF0ubWVzc2FnZXM7XG5cblx0XHRcdCRyZXBvcnRJdGVtSGVhZGluZy50ZXh0KCBmaWxlcGF0aCApO1xuXG5cdFx0XHQkLmVhY2goXG5cdFx0XHRcdG5vdGljZXMsICggaW5kZXgsIHZhbCApID0+IHtcblx0XHRcdFx0XHRjb25zdCBsaW5lICAgICAgICA9IHZhbC5saW5lO1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgICAgID0gdmFsLm1lc3NhZ2U7XG5cdFx0XHRcdFx0Y29uc3QgdHlwZSAgICAgICAgPSB2YWwudHlwZTtcblx0XHRcdFx0XHRjb25zdCAkc2luZ2xlSXRlbSA9ICRyZXBvcnROb3RpY2VUeXBlLmNsb25lKCkuYWRkQ2xhc3MoIHR5cGUudG9Mb3dlckNhc2UoKSApO1xuXHRcdFx0XHRcdCRzaW5nbGVJdGVtLmZpbmQoIHRoaXMucmVwb3J0SXRlbUxpbmUgKS50ZXh0KCBsaW5lICk7XG5cdFx0XHRcdFx0JHNpbmdsZUl0ZW0uZmluZCggdGhpcy5yZXBvcnRJdGVtVHlwZSApLnRleHQoIHR5cGUgKTtcblx0XHRcdFx0XHQkc2luZ2xlSXRlbS5maW5kKCB0aGlzLnJlcG9ydEl0ZW1NZXNzYWdlICkudGV4dCggbWVzc2FnZSApO1xuXHRcdFx0XHRcdCRzaW5nbGVJdGVtLmFwcGVuZFRvKCAkcmVwb3J0UmVwb3J0VGFibGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JHJlcG9ydE5vdGljZVR5cGUucmVtb3ZlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlcG9ydDtcblx0fVxuXG5cdGJ1bXBQcm9ncmVzc0JhciggY291bnQsIHRvdGFsRmlsZXMgKSB7XG5cdFx0Y29uc3QgY29tcGxldGVkID0gKCAoICggY291bnQgKSAvIHRvdGFsRmlsZXMgKSAqIDEwMCApLnRvRml4ZWQoIDIgKTtcblx0XHR0aGlzLiRwZXJjZW50YWdlQ291bnQudGV4dCggYCR7Y29tcGxldGVkfSAlIGAgKTtcblx0XHR0aGlzLiRtZXRlckJhci5jc3MoICd3aWR0aCcsIGAke2NvbXBsZXRlZH0gJSBgICk7XG5cdH1cbn1cbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBjb25zdCBhamF4ID0gKCBvcHRpb25zLCByZXNvbHZlLCByZWplY3QgKSA9PiAkLmFqYXgoIG9wdGlvbnMgKVxuXHQuZG9uZSggcmVzb2x2ZSApXG5cdC5mYWlsKCByZWplY3QgKTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyJdLCJzb3VyY2VSb290IjoiIn0=