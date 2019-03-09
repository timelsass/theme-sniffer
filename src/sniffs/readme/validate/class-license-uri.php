<?php
/**
 * Validator for License URI in readme.txt.
 *
 * @package Theme_Sniffer\Sniffs\Readme\Validate
 *
 * @since 1.1.0
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Sniffs\Readme\Validate;

use Theme_Sniffer\Helpers\Readme_Helpers;

/**
 * Validator for License URI's.
 *
 * @package Theme_Sniffer\Sniffs\Readme\Validate
 *
 * @since 1.1.0
 */
class License_Uri {

	use Readme_Helpers {
		Readme_Helpers::init as private license_uri_helpers;
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
	 * License URI arguments to use in validation.
	 *
	 * @var Object $args
	 *
	 * @since 1.1.0
	 */
	private $args;

	/**
	 * Instantiate class and set class properties.
	 *
	 * @since 1.1.0
	 *
	 * @param array $args Options to instantiate with.
	 */
	public function __construct( $args ) {
		$this->args = $args;
		$this->license_uri_helpers();
		$this->check();
	}

	/**
	 * Check License URI from readme.txt
	 *
	 * @since 1.1.0
	 */
	public function check() {
		$license = $this->find_license( $this->args->primary );

		// Still report errors when license status is warning (or success of course).
		if ( $license->status !== 'error' ) {
			$uris = $this->license_data[ $license->id ]['uris'];

			// Missing License URI field error.
			if ( empty( $this->args->uri ) ) {
				$this->results[] = [
					'severity' => 'error',
					'message'  => __( 'All themes are required to provide a License URI in their readme.txt!', 'theme-sniffer' ),
				];
			}

			// URI field is invalid.
			if ( empty( preg_grep( '/^' . preg_quote( $this->args->uri, '/' ) . '$/i', $uris ) ) ) {
				$this->results[] = [
					'severity' => 'error',
					'message'  => sprintf(
						/* translators: 1: the user provided License URI in readme.txt 2: the license comparing against in readme.txt 3: a list of suitable license URIs that could be used */
						__( 'The License URI provided: %1$s, is not a known URI reference for the license %2$s.  All themes must meet this requirement!<br/>These are recognized URIs based on the license provided:<br/>%3$s', 'theme-sniffer' ),
						$this->args->uri,
						$this->args->primary,
						implode( '<br/>', $uris )
					),
				];
			}
		}
	}

	/**
	 * Provides results from License URI checks.
	 *
	 * @since 1.1.0
	 *
	 * @return array $results Results from License URI validation checks.
	 */
	public function get_results() {
		return $this->results;
	}
}
