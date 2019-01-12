<?php
/**
 * Core scripts and styles class file
 *
 * @since 0.2.0
 * @package Theme_Sniffer\Assets
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Assets;

use Theme_Sniffer\Assets\Script_Asset;
use Theme_Sniffer\Assets\Style_Asset;
use Theme_Sniffer\Core\Service;


/**
 * Core class that enqueues scripts and styles
 */
final class Core_Enqueue implements Service {

	const JS_HANDLE = 'theme-sniffer-js';
	const JS_URI    = 'themeSniffer.js';

	const CSS_HANDLE = 'theme-sniffer-css';
	const CSS_URI    = 'themeSniffer.css';

	const LOCALIZATION_HANDLE = 'themeSnifferLocalization';

	/**
	 * Register the assets.
	 */
	public function register() : void {
		$this->register_assets();
	}

	/**
	 * Get the array of known assets.
	 *
	 * @return array<Asset>
	 */
	protected function register_assets() : array {

		$sniffer_page_script = new Script_Asset(
			self::JS_HANDLE,
			self::JS_URI,
			[ 'jquery' ],
			false,
			Script_Asset::ENQUEUE_FOOTER
		);

		$sniffer_page_script->add_localization(
			self::LOCALIZATION_HANDLE,
			array(
				'sniffError'         => esc_html__( 'The check has failed. This could happen due to running out of memory. Either reduce the file length or increase PHP memory.', 'theme-sniffer' ),
				'percentComplete'    => esc_html__( 'Percent completed: ', 'theme-sniffer' ),
				'errorReport'        => esc_html__( 'Error', 'theme-sniffer' ),
				'ajaxStopped'        => esc_html__( 'Sniff stopped', 'theme-sniffer' ),
			)
		);

		$sniffer_page_style = new Style_Asset(
			self::CSS_HANDLE,
			self::CSS_URI
		);

		return [
			$sniffer_page_script,
			$sniffer_page_style,
		];
	}
}
