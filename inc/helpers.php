<?php
/**
 * Helper functions
 *
 * @package NS_Theme_Check
 */

/**
 * Render form.
 *
 * @since 0.1.0
 */
function ns_theme_check_render_form() {
	$all_themes = wp_get_themes();
	$themes = array();

	if ( ! empty( $all_themes ) ) {
		foreach ( $all_themes as $key => $theme ) {
			$themes[ $key ] = $theme->get( 'Name' );
		}
	}

	if ( empty( $themes ) ) {
		return;
	}

	$current_theme = get_stylesheet();

	if ( ! empty( $_POST['themename'] ) ) {
		$current_theme = $_POST['themename'];
	}

	$hide_warning = 0;
	if ( isset( $_POST['hide_warning'] ) && 1 === absint( $_POST['hide_warning'] ) ) {
		$hide_warning = 1;
	}

	$raw_output = 0;
	if ( isset( $_POST['raw_output'] ) && 1 === absint( $_POST['raw_output'] ) ) {
		$raw_output = 1;
	}

	?>
	<form action="<?php echo esc_url( admin_url( 'themes.php?page=ns-theme-check' ) ); ?>" method="post">
		<?php wp_nonce_field( 'ns_theme_check_run', 'ns_theme_check_nonce' ); ?>
		<label for="themename"><?php esc_html_e( 'Select Theme', 'ns-theme-check' ); ?>
			<select name="themename">
			<?php foreach ( $themes as $key => $value ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $current_theme, $key ); ?>><?php echo esc_html( $value ); ?></option>
			<?php endforeach; ?>
			</select>
		</label>
		<input type="submit" value="<?php esc_attr_e( 'GO', 'ns-theme-check' ); ?>" class="button button-secondary" />
		&nbsp;<label for=""><input type="checkbox" name="hide_warning" id="hide_warning" value="1" <?php checked( $hide_warning, 1 ); ?> /><?php esc_html_e( 'Hide Warning', 'ns-theme-check' ); ?></label>
		&nbsp;<label for=""><input type="checkbox" name="raw_output" id="raw_output" value="1" <?php checked( $raw_output, 1 ); ?> /><?php esc_html_e( 'Raw Output', 'ns-theme-check' ); ?></label>
	</form>
	<?php
}

/**
 * Render sniff results.
 *
 * @since 0.1.0
 */
function ns_theme_check_render_output() {

	// Bail if empty.
	if ( empty( $_POST['themename'] ) ) {
		return;
	}

	// Verify nonce.
	if ( ! isset( $_POST['ns_theme_check_nonce'] ) || ! wp_verify_nonce( $_POST['ns_theme_check_nonce'], 'ns_theme_check_run' ) ) {
		esc_html_e( 'Error', 'ns-theme-check' );
		return;
	}

	$args = array(
		'show_warnings' => 1,
		'raw_output'    => 0,
	);

	if ( isset( $_POST['hide_warning'] ) && 1 === absint( $_POST['hide_warning'] ) ) {
		$args['show_warnings'] = 0;
	}

	if ( isset( $_POST['raw_output'] ) && 1 === absint( $_POST['raw_output'] ) ) {
		$args['raw_output'] = 1;
	}

	ns_theme_check_do_sniff( $_POST['themename'], $args );

}

/**
 * Perform sniff check.
 *
 * @since 0.1.0
 *
 * @param string $theme Theme slug.
 * @param array  $args Arguments.
 */
function ns_theme_check_do_sniff( $theme, $args = array() ) {

	require_once NS_THEME_CHECK_DIR . '/vendor/autoload.php';

	// Path to WordPress Theme coding standard.
	PHP_CodeSniffer::setConfigData( 'installed_paths', NS_THEME_CHECK_DIR . '/vendor/wp-coding-standards/wpcs/', true );

	// Set default standard.
	PHP_CodeSniffer::setConfigData( 'default_standard', 'WordPress-Theme', true );

	if ( isset( $args['show_warnings'] ) ) {
		PHP_CodeSniffer::setConfigData( 'show_warnings', absint( $args['show_warnings'] ), true );
	}

	// Initialise CodeSniffer.
	$phpcs = new PHP_CodeSniffer_CLI();
	$phpcs->checkRequirements();

	// Set CLI arguments.
	$values['files']       = get_theme_root() . '/' . $theme;
	$values['reportWidth'] = '9999';
	if ( isset( $args['raw_output'] ) && 0 === absint( $args['raw_output'] ) ) {
		$values['reports']['json'] = null;
	}

	// Sniff theme files.
	if ( isset( $args['raw_output'] ) && 1 === absint( $args['raw_output'] ) ) {
		echo '<div class="theme-check-report theme-check-report-raw"><pre>';
		$phpcs->process( $values );
		echo '</pre></div>';
	} else {
		ob_start();
		$phpcs->process( $values );
		$raw_output = ob_get_clean();
		$output = json_decode( $raw_output );
		if ( ! empty( $output ) ) {
			ns_theme_check_render_json_report( $output );
		}
	}

	return;

}

/**
 * Render JSON data in cleaner format.
 *
 * @since 0.1.0
 *
 * @param string $json JSON data.
 */
function ns_theme_check_render_json_report( $json ) {
	echo '<div class="theme-check-report theme-check-report-json">';
	print_r( $json );
	echo '</div>';
}
