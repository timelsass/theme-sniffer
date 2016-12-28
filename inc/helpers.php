<?php

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
	</form>
	<?php
}

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
	);

	if ( isset( $_POST['hide_warning'] ) && 1 === absint( $_POST['hide_warning'] ) ) {
		$args['show_warnings'] = 0;
	}

	ns_theme_check_do_sniff( $_POST['themename'], $args );

}

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

	// Sniff theme files.
	echo '<div class="report" style="margin: 1em;"><pre>';
	$phpcs->process( $values );
	echo '</pre></div>';

	return;

}
