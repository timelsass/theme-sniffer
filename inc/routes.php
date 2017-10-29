<?php
/**
 * REST endpoints for callback functions
 *
 * @package Theme_Sniffer
 */

add_action( 'rest_api_init', 'theme_sniffer_endpoint_init' );

/**
 * Register endpoints function
 *
 * @since 0.1.0
 */
function theme_sniffer_endpoint_init() {
	register_rest_route( 'theme-sniffer/v1', '/sniff-run', array(
		'methods'  => 'GET',
		'callback' => 'theme_sniffer_run_sniffer',
	) );

	register_rest_route( 'theme-sniffer/v1', '/individual-sniff', array(
		'methods'  => 'GET',
		'callback' => 'theme_sniffer_individual_sniff',
	) );
}

/**
 * Callback function for the run sniffer endpoint
 *
 * @param \WP_REST_Request $request Full data about the request.
 * @since 0.1.0
 */
function theme_sniffer_run_sniffer( \WP_REST_Request $request ) {
	$headers = $request->get_headers();

	// Bail if empty.
	if ( empty( $_GET['themeName'] ) ) {
		$message = esc_html__( 'Theme name not selected.', 'theme-sniffer' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	// Verify nonce.
	if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
		$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	// Exit if plugin not bundled properly.
	if ( ! file_exists( THEME_SNIFFER_DIR . '/vendor/autoload.php' ) ) {
		// translators: Placeholders are used for inserting hardcoded links to the repository.
		$message = sprintf( esc_html__( 'It seems you are using GitHub provided zip for the plugin. Visit %1$sInstalling%2$s to find the correct bundled plugin zip.', 'theme-sniffer' ), '<a href="https://github.com/WPTRT/theme-sniffer#installing" target="_blank">', '</a>' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	if ( empty( $_GET['wpRulesets'] ) ) {
		$message = esc_html__( 'Please select at least one standard.', 'theme-sniffer' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	$theme_slug = sanitize_text_field( wp_unslash( $_GET['themeName'] ) );

	if ( isset( $_GET['hideWarning'] ) && 'true' === $_GET['hideWarning'] ) {
		$args['show_warnings'] = 'false'; // MANUAL INSPECTION!!!!!!!
	}

	if ( isset( $_GET['rawOutput'] ) && 'true' === $_GET['rawOutput'] ) {
		$args['raw_output'] = 1;
	}

	if ( isset( $_GET['minimumPHPVersion'] ) && ! empty( $_GET['minimumPHPVersion'] ) ) {
		$args['minimum_php_version'] = sanitize_text_field( wp_unslash( $_GET['minimumPHPVersion'] ) );
	}

	$standards = theme_sniffer_get_standards();

	$selected_standards = array_map( 'sanitize_text_field', wp_unslash( $_GET['wpRulesets'] ) );

	foreach ( $selected_standards as $key => $standard ) {
		if ( ! empty( $standards[ $standard ] ) ) {
			$args['standard'][] = $standards[ $standard ]['label'];
		}
	}

	$theme = wp_get_theme( $theme_slug );
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
function theme_sniffer_individual_sniff( \WP_REST_Request $request ) {
	$headers = $request->get_headers();
error_log( print_r( $_GET['themeName'], true ) );
error_log( print_r( $_GET['themeArgs'], true ) );
error_log( print_r( $_GET['file'], true ) );
	// Bail if empty.
	if ( empty( $_GET['themeName'] ) || empty( $_GET['themeArgs'] ) || empty( $_GET['file'] ) ) {
		$message = esc_html__( 'Theme name or arguments were not set, or file was empty', 'theme-sniffer' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	// Verify nonce.
	if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
		$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	$sniff = theme_sniffer_do_sniff( $_GET['themeName'], $_GET['themeArgs'], $_GET['file'] );

	wp_send_json_success( $sniff );
}
