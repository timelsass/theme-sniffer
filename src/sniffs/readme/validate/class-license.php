<?php
/**
 * Validator for licenses strings provided.
 *
 * @package Theme_Sniffer\Sniffs\Readme\Validate
 *
 * @since 1.1.0
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Sniffs\Readme\Validate;

use Theme_Sniffer\Helpers\Readme_Helpers;

/**
 * Validator for License String In Readme.
 *
 * @package Theme_Sniffer\Sniffs\Readme\Validate
 *
 * @since 1.1.0
 */
class License {

	use Readme_Helpers {
		Readme_Helpers::init as private license_helpers;
	}

	/**
	 * Sniff results for license field.
	 *
	 * @var array $results
	 *
	 * @since 1.1.0
	 */
	private $results = [];

	/**
	 * License string to validate
	 *
	 * @var string $license
	 *
	 * @since 1.1.0
	 */
	private $license;

	/**
	 * Instantiate class and set class properties.
	 *
	 * @since 1.1.0
	 *
	 * @param array $args Options to instantiate with.
	 */
	public function __construct( $args ) {
		$this->license = $args;
		$this->license_helpers();
		$this->check( $this->license );
	}

	/**
	 * Check license from readme.txt
	 *
	 * @since 1.1.0
	 *
	 * @param string $license License to check.
	 */
	public function check( $license ) {
		$license_data = $this->find_license( $license );

		// Only report errors.
		if ( $license_data->status !== 'success' ) {
			$this->results[] = [
				'severity' => $license_data->status,
				'message'  => $license_data->message,
			];
		}

		// Check if GPLv2 compatible if no errors found with License Identifier so far.
		if ( $license_data->status !== 'error' && ! $this->is_gpl2_compatible( $license_data ) ) {
			$this->results[] = [
				'severity' => 'error',
				'message'  => sprintf(
					/* translators: %s: the license specified in readme.txt */
					__( 'The license specified, %s is not compatible with WordPress\' license of GPL-2.0-or-later.  All themes must meet this requirement!' ),
					$this->license
				),
			];
		}
	}

	/**
	 * Provides results from license checks.
	 *
	 * @since 1.1.0
	 *
	 * @return array $results Results from license validation checks.
	 */
	public function get_results() {
		return $this->results;
	}
}
