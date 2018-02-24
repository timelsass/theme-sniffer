<?php
/**
 * REST endpoints for callback functions
 *
 * @since      0.2.0
 *
 * @package    Theme_Sniffer\Admin
 */

namespace Theme_Sniffer\Admin;

use Theme_Sniffer\Admin\Checks as Checks;

/**
 * Class that holds the methods for the REST query
 *
 * @package    Theme_Sniffer\Admin
 */
class Routes {
	/**
	 * The ID of this plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.2.0
	 * @param    string $plugin_name  The name of this plugin.
	 * @param    string $version      The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Register endpoints function
	 *
	 * @since 0.1.0
	 */
	public function endpoint_init() {
		register_rest_route( 'theme-sniffer/v1', '/sniff-run', array(
			'methods'  => 'GET',
			'callback' => [ $this, 'run_sniffer' ],
		) );

		register_rest_route( 'theme-sniffer/v1', '/individual-sniff', array(
			'methods'  => 'GET',
			'callback' => [ $this, 'individual_sniff' ],
		) );
	}

	/**
	 * Callback function for the run sniffer endpoint
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @since 0.1.0
	 */
	public function run_sniffer( \WP_REST_Request $request ) {
		$headers = $request->get_headers();

		// Bail if empty.
		if ( empty( $_GET['themeName'] ) ) { // Input var okay.
			$message = esc_html__( 'Theme name not selected.', 'theme-sniffer' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Verify nonce.
		if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
			$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Exit if plugin not bundled properly.
		if ( ! file_exists( rtrim( plugin_dir_path( __FILE__ ), '/' ) . '/vendor/autoload.php' ) ) {
			// translators: Placeholders are used for inserting hardcoded links to the repository.
			$message = sprintf( esc_html__( 'It seems you are using GitHub provided zip for the plugin. Visit %1$sInstalling%2$s to find the correct bundled plugin zip.', 'theme-sniffer' ), '<a href="https://github.com/WPTRT/theme-sniffer#installing" target="_blank">', '</a>' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		if ( empty( $_GET['wpRulesets'] ) ) { // Input var okay.
			$message = esc_html__( 'Please select at least one standard.', 'theme-sniffer' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		$theme_slug = sanitize_text_field( wp_unslash( $_GET['themeName'] ) ); // Input var okay.

		if ( isset( $_GET['hideWarning'] ) && 'true' === $_GET['hideWarning'] ) { // Input var okay.
			$args['show_warnings'] = 'false';
		}

		if ( isset( $_GET['rawOutput'] ) && 'true' === $_GET['rawOutput'] ) { // Input var okay.
			$args['raw_output'] = 1;
		}

		if ( isset( $_GET['minimumPHPVersion'] ) && ! empty( $_GET['minimumPHPVersion'] ) ) { // Input var okay.
			$args['minimum_php_version'] = sanitize_text_field( wp_unslash( $_GET['minimumPHPVersion'] ) );// Input var okay.
		}

		$standards = theme_sniffer_get_standards();

		$selected_standards = array_map( 'sanitize_text_field', wp_unslash( $_GET['wpRulesets'] ) ); // Input var okay.

		foreach ( $selected_standards as $key => $standard ) {
			if ( ! empty( $standards[ $standard ] ) ) {
				$args['standard'][] = $standards[ $standard ]['label'];
			}
		}

		$theme     = wp_get_theme( $theme_slug );
		$php_files = $theme->get_files( 'php', 4, false );
		// Current theme text domain.
		$args['text_domains'][] = $theme_slug;
		// Frameworks.
		foreach ( $php_files as $key => $file ) {
			if ( strrpos( $key, 'hybrid.php' ) ) {
				$args['text_domains'][] = 'hybrid-core';
			}
			if ( strrpos( $key, 'kirki.php' ) ) {
				$args['text_domains'][] = 'kirki';
			}
		}

		$all_files = $theme->get_files( array( 'php', 'css,', 'js' ), -1, false );

		wp_send_json_success( array( $theme_slug, $args, $all_files ) );
	}

	/**
	 * Callback function for the individual sniff run
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @since 0.1.0
	 */
	public function individual_sniff( \WP_REST_Request $request ) {
		$headers = $request->get_headers();

		// Bail if empty.
		if ( empty( $_GET['themeName'] ) || empty( $_GET['themeArgs'] ) || empty( $_GET['file'] ) ) { // Input var okay.
			$message = esc_html__( 'Theme name or arguments were not set, or file was empty', 'theme-sniffer' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Verify nonce.
		if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
			$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
			$error   = new WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		$checks = new Checks( $this->plugin_name, $this->version );

		$theme_name = sanitize_text_field( wp_unslash( $_GET['themeName'] ) ); // Input var okay.
		$theme_args = array_map( 'sanitize_text_field', wp_unslash( $_GET['themeArgs'] ) ); // Input var okay.
		$theme_file = sanitize_text_field( wp_unslash( $_GET['file'] ) ); // Input var okay.

		$sniff = $checks->perform_sniff( $theme_name, $theme_args, $theme_file );

		wp_send_json_success( $sniff );
	}

}
