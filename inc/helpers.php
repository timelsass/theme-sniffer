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
	$values['reportWidth'] = '110';
	if ( isset( $args['raw_output'] ) && 0 === absint( $args['raw_output'] ) ) {
		$values['reports']['json'] = null;
	}

	// Sniff theme files.
	if ( isset( $args['raw_output'] ) && 1 === absint( $args['raw_output'] ) ) {
		echo '<div class="theme-check-report theme-check-report-raw">';
		ns_theme_check_show_repot_info();
		echo '<pre>';
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
	?>
	<div class="theme-check-report theme-check-report-json">
		<?php ns_theme_check_show_repot_info(); ?>

		<div class="summary">
			<h4><?php esc_html_e( 'Summary', 'ns-theme-check' ); ?></h4>
			<ul class="summary-list">
				<li><span class="item-field"><?php esc_html_e( 'Errors:', 'ns-theme-check' ); ?></span><?php echo absint( $json->totals->errors ); ?></li>
				<li><span class="item-field"><?php esc_html_e( 'Warning:', 'ns-theme-check' ); ?></span><?php echo absint( $json->totals->warnings ); ?></li>
			</ul><!-- .summary-list -->
		</div><!-- .summary -->
		<hr />

		<?php
		$files = '';
		if ( isset( $json->files ) ) {
			$files = $json->files;
		}
		?>

		<?php if ( $files ) : ?>

			<div class="report-files">
				<h4><?php esc_html_e( 'Details', 'ns-theme-check' ); ?></h4>
				<?php foreach ( $files as $file_key => $file ) : ?>

					<?php
					$errors   = $file->errors;
					$warnings = $file->warnings;

					if ( 0 === absint( $errors ) && 0 === absint( $warnings ) ) {
						continue;
					}
					?>

					<div class="report-file-item">
						<div class="report-file-heading">
							<span class="heading-field"><?php esc_html_e( 'File:', 'ns-theme-check' ); ?></span>
							<?php
								$exploded_file_path = explode( '/themes/', $file_key );
								$file_name = array_pop( $exploded_file_path );
							?>
							<?php echo esc_html( $file_name ); ?>

						</div><!-- .report-file-heading -->
						<div class="report-file-heading-meta">
							<?php echo sprintf( esc_html__( '%1$d errors and %2$d warnings' ), absint( $errors ), absint( $warnings ) ); ?>
						</div><!-- .report-file-heading-meta -->

						<?php if ( ! empty( $file->messages ) && is_array( $file->messages ) ) : ?>

							<table class="report-table">
								<?php foreach ( $file->messages as $item ) : ?>
									<?php $row_class = ( 'error' === strtolower( $item->type ) ) ? 'error' : 'warning'; ?>
									<tr class="item-type-<?php echo esc_attr( $row_class ); ?>">
										<td><?php printf( esc_html__( 'Line: %d', 'ns-theme-check' ), absint( $item->line ) ); ?></td>
										<td><?php echo esc_html( $item->type ); ?></td>
										<td><?php echo esc_html( $item->message ); ?></td>
									</tr>
								<?php endforeach; ?>
							</table>

						<?php endif; ?>

					</div><!-- .report-file-item -->

				<?php endforeach; ?>
			</div><!-- .report-files -->

		<?php endif; ?>

	</div><!-- .theme-check-report .theme-check-report-json -->
	<?php
}

/**
 * Show info about report.
 *
 * @since 0.1.2
 */
function ns_theme_check_show_repot_info() {
	?>
	<p><strong><?php esc_html_e( 'Note: Errors need to be fixed and Warnings are things that need to be checked manually.', 'ns-theme-check' ); ?></strong></p>
	<hr />
	<?php
}
