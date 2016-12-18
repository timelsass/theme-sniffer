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

	// ns_theme_check_do_sniff( $_POST['themename'] );

}

function ns_theme_check_do_sniff( $theme ) {

	require_once( __DIR__ . '/vendor/autoload.php' );

	// Path to WordPress Theme coding standard.
	PHP_CodeSniffer::setConfigData( 'installed_paths', dirname(__FILE__) . '/vendor/wp-coding-standards/wpcs/', true );

	// Initialise CodeSniffer.
	$phpcs = new PHP_CodeSniffer_CLI();
	$phpcs->checkRequirements();

	// Set CLI arguments.
	$values['files']       = get_theme_root() . '/' . $theme;
	$values['reportWidth'] = '9999';
	$values['standard']    = 'WordPress-Theme';

	// Sniff theme files.
	echo '<div class="report" style="margin: 1em;"><pre>';
	$phpcs->process( $values );
	echo '</pre></div>';

	return;

}
