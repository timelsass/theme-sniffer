<?php
/**
 * Readme Validator
 *
 * @since   1.1.0
 *
 * @package Theme_Sniffer\Sniffs\Readme
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Sniffs\Readme;

use Theme_Sniffer\Sniffs\Has_Results;

/**
 * Responsible for initiating validators.
 *
 * @package Theme_Sniffer\Sniffs\Readme
 *
 * @since   1.1.0
 */
class Validator implements Has_Results {

	/**
	 * Sniff results for the readme.txt.
	 *
	 * @var array $results
	 *
	 * @since 1.1.0
	 */
	public $results = [];

	/**
	 * Instantiate class and set class properties.
	 *
	 * @since 1.1.0
	 *
	 * @param \Theme_Sniffer\Sniffs\Readme\Parser $parser Parser object.
	 */
	public function __construct( Parser $parser ) {
		$this->parser = $this->set_defaults( $parser );
		$this->validate( $parser );
	}

	/**
	 * Set defaults that are necessary for any validators if needed.
	 *
	 * @since 1.1.0
	 *
	 * @param Object $parser Populated parser object.
	 */
	public function set_defaults( $parser ) {
		if ( ! empty( $parser->license ) && ! empty( $parser->license_uri ) ) {
			$parser->license_uri = (object) [
				'primary' => $parser->license,
				'uri'     => $parser->license_uri,
			];
		}

		return $parser;
	}

	/**
	 * Runs any existing validators set on parser.
	 *
	 * @since 1.1.0
	 *
	 * @param Object $parser Populated parser object.
	 */
	public function validate( $parser ) {
		foreach ( $parser as $name => $args ) {
			$class = __NAMESPACE__ . '\\' . ucwords( $name, '_' );

			if ( class_exists( $class ) ) {
				$validator = new $class( $args );
				$results   = $validator->get_results();

				if ( is_array( $results ) ) {
					$this->results = array_merge( $this->results, $results );
				}
			}
		}
	}

	/**
	 * Return results from all validator parts ran.
	 *
	 * @since 1.1.0
	 *
	 * @return array $results Validator warnings/messages.
	 */
	public function get_results() {
		return $this->results;
	}
}
