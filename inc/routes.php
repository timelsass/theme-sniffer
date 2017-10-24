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
	register_rest_route( 'wp/v2/theme-sniffer/', '/sniff-run', array(
		'methods'  => 'POST',
		'callback' => 'theme_sniffer_run_sniffer',
	) );

	register_rest_route( 'wp/v2/theme-sniffer/', '/individual-sniff', array(
		'methods'  => 'POST',
		'callback' => 'theme_sniffer_individual_sniff',
	) );
}

/**
 * Callback function for the run sniffer endpoint
 *
 * @since 0.1.0
 */
function theme_sniffer_run_sniffer() {
	// Bail if empty.
	if ( empty( $_POST['themename'] ) ) {
		return;
	}

	// Verify nonce.
	if ( ! isset( $_POST['theme_sniffer_nonce'] ) || ! wp_verify_nonce( $_POST['theme_sniffer_nonce'], 'wp_rest' ) ) {
		esc_html_e( 'Nonce error', 'theme-sniffer' );
		return;
	}

	if ( ! file_exists( THEME_SNIFFER_DIR . '/vendor/autoload.php' ) ) {
		$message = sprintf( esc_html__( 'It seems you are using GitHub provided zip for the plugin. Visit %1$sInstalling%2$s to find the correct bundled plugin zip.', 'theme-sniffer' ), '<a href="https://github.com/ernilambar/theme-sniffer#installing" target="_blank">', '</a>' );
		$error = new WP_Error( '-1', $message );
		wp_send_json_error( $error );
	}

	$theme_slug = esc_html( $_POST['themename'] );

	if ( isset( $_POST['hide_warning'] ) && 'true' === $_POST['hide_warning'] ) {
		$args['show_warnings'] = true;
	}

	if ( isset( $_POST['raw_output'] ) && 'true' === $_POST['raw_output'] ) {
		$args['raw_output'] = 1;
	}

	if ( isset( $_POST['minimum_php_version'] ) && ! empty( $_POST['minimum_php_version'] ) ) {
		$args['minimum_php_version'] = esc_html( $_POST['minimum_php_version'] );
	}

	$standards = theme_sniffer_get_standards();
	foreach ( $standards as $key => $standard ) {
		if ( isset( $_POST[ $key ] ) && 'true' === $_POST[ $key ] ) {
			$args['standard'][] = $standard['label'];
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
 * @since 0.1.0
 */
function theme_sniffer_individual_sniff() {
	// Bail if empty.
	if ( empty( $_POST['theme_name'] ) || empty( $_POST['theme_args'] ) || empty( $_POST['file'] ) ) {
		return;
	}

	// Verify nonce.
	if ( ! isset( $_POST['theme_sniffer_nonce'] ) || ! wp_verify_nonce( $_POST['theme_sniffer_nonce'], 'wp_rest' ) ) {
		esc_html_e( 'Nonce error', 'theme-sniffer' );
		return;
	}

	$sniff = theme_sniffer_do_sniff( $_POST['theme_name'], $_POST['theme_args'], $_POST['file'] );

	wp_send_json_success( $sniff );
}
