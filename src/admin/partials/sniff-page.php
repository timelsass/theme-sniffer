<?php
/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @since      0.2.0
 *
 * @package    Theme_Sniffer\Admin\Partials;
 */

namespace Theme_Sniffer\Admin\Partials;

use Theme_Sniffer\Admin\Helpers as Helpers;

$helpers = new Helpers();

if ( isset( $_POST['theme_sniffer'] ) && ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['theme_sniffer'] ) ), 'theme_sniffer_nonce' ) ) { // Input var okay.
	wp_die( esc_html__( 'Nonce bust!', 'theme-sniffer' ) );
}

$standards = $helpers->get_wpcs_standards();

$all_themes = wp_get_themes();
$themes     = array();

if ( ! empty( $all_themes ) ) {
	foreach ( $all_themes as $key => $theme ) {
		$themes[ $key ] = $theme->get( 'Name' );
	}
}

if ( empty( $themes ) ) {
	return;
}

$current_theme = get_stylesheet();
if ( ! empty( $_POST['themename'] ) ) { // Input var okay.
	$current_theme = sanitize_text_field( wp_unslash( $_POST['themename'] ) ); // Input var okay.
}

$minimum_php_version = '5.2';
if ( ! empty( $_POST['minimum_php_version'] ) ) { // Input var okay.
	$minimum_php_version = sanitize_text_field( wp_unslash( $_POST['minimum_php_version'] ) ); // Input var okay.
}

$hide_warning = 0;
if ( isset( $_POST['hide_warning'] ) && 'true' === $_POST['hide_warning'] ) { // Input var okay.
	$hide_warning = 1;
}

$raw_output = 0;
if ( isset( $_POST['raw_output'] ) && 'true' === $_POST['raw_output'] ) { // Input var okay.
	$raw_output = 1;
}

$standard_status = wp_list_pluck( $standards, 'default' );

if ( isset( $_POST['_wp_http_referer'] ) ) { // Input var okay.
	foreach ( $standards as $key => $standard ) {
		if ( isset( $_POST[ $key ] ) && 'true' === $_POST[ $key ] ) { // Input var okay.
			$standard_status[ $key ] = 1;
		} else {
			$standard_status[ $key ] = 0;
		}
	}
}
?>
<form action="<?php echo esc_url( admin_url( 'themes.php?page=theme-sniffer' ) ); ?>" method="post" class="form-theme-sniffer">
	<div class="theme-switcher-wrap">
		<h2><?php esc_html_e( 'Select Theme', 'theme-sniffer' ); ?></h2>
		<label for="themename">
			<select name="themename">
				<?php foreach ( $themes as $key => $value ) : ?>
					<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $current_theme, $key ); ?>><?php echo esc_html( $value ); ?></option>
				<?php endforeach; ?>
			</select>
		</label>
		<span class="button button-secondary js-start-check"><?php esc_attr_e( 'Go', 'theme-sniffer' ); ?></span>
		<span class="button button-secondary js-stop-check"><?php esc_attr_e( 'Stop', 'theme-sniffer' ); ?></span>
	</div><!-- .theme-switcher-wrap -->
	<div class="standards-wrap">
		<h2><?php esc_html_e( 'Select Standard', 'theme-sniffer' ); ?></h2>
		<?php foreach ( $standards as $key => $standard ) : ?>
			<label for="<?php echo esc_attr( $key ); ?>" title="<?php echo esc_attr( $standard['description'] ); ?>">
				<input type="checkbox" name="selected_ruleset[]" id="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $key ); ?>" <?php checked( $standard_status[ $key ], 1 ); ?> />
				<?php echo '<strong>' , esc_html( $standard['label'] ) , '</strong>: ' , esc_html( $standard['description'] ); ?>
			</label><br>
		<?php endforeach; ?>
	</div><!-- .standards-wrap -->
	<div class="options-wrap">
		<h2><?php esc_html_e( 'Options', 'theme-sniffer' ); ?></h2>
		<label for="hide_warning"><input type="checkbox" name="hide_warning" id="hide_warning" value="1" <?php checked( $hide_warning, 1 ); ?> /><?php esc_html_e( 'Hide Warnings', 'theme-sniffer' ); ?></label>
		&nbsp;<label for="raw_output"><input type="checkbox" name="raw_output" id="raw_output" value="1" <?php checked( $raw_output, 1 ); ?> /><?php esc_html_e( 'Raw Output', 'theme-sniffer' ); ?></label>&nbsp;
		<?php $php_versions = $helpers->get_php_versions(); ?>
		<label for="minimum_php_version">
			<select name="minimum_php_version">
			<?php foreach ( $php_versions as $version ) : ?>
				<option value="<?php echo esc_attr( $version ); ?>" <?php selected( $minimum_php_version, $version ); ?>><?php echo esc_html( $version ); ?></option>
			<?php endforeach; ?>
			</select>
			<?php esc_html_e( 'Minimum PHP Version', 'theme-sniffer' ); ?>
		</label>
	</div><!-- .options-wrap -->
</form>
<div class="start-notice js-start-notice"><?php esc_html_e( 'Check starting', 'theme-sniffer' ); ?></div>
<div class="progress-bar js-progress-bar">
	<span class="error-notice js-error-notice"><?php esc_html_e( 'Check has failed :(', 'theme-sniffer' ); ?></span>
	<span class="percentage js-percentage-bar"><span class="js-percentage-text"><?php esc_html_e( 'Percent completed: ', 'theme-sniffer' ); ?></span><span class="percentage-count js-percentage-count"></span></span>
	<span class="meter js-meter-bar"></span>
</div>
<div class="theme-sniffer-report js-sniff-report">
	<div class="report-file-item js-report-item">
		<div class="report-file-heading js-report-item-heading"></div>
		<table class="report-table js-report-table">
			<tr class="item-type js-report-notice-type">
				<td class="td-line js-report-item-line"></td>
				<td class="td-type js-report-item-type"></td>
				<td class="td-message js-report-item-message"></td>
			</tr>
		</table>
	</div>
</div><!-- .theme-sniffer-report -->
<div class="theme-sniffer-info js-sniffer-info"></div>
<div class="check-done js-check-done"><?php esc_html_e( 'All done!', 'theme-sniffer' ); ?></div>
