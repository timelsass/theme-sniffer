<?php
/**
 * Admin functions
 *
 * @package NS_Theme_Check
 */

/**
 * Register admin menu.
 *
 * @since 0.1.0
 */
function ns_theme_check_admin_menu() {

	add_theme_page( esc_html__( 'NS Theme Check', 'ns-theme-check' ), esc_html__( 'NS Theme Check', 'ns-theme-check' ), 'manage_options', 'ns-theme-check', 'ns_theme_check_render_admin_page' );

}

add_action( 'admin_menu', 'ns_theme_check_admin_menu' );

/**
 * Callback for admin page.
 *
 * @since 0.1.0
 */
function ns_theme_check_render_admin_page() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'NS Theme Check', 'ns-theme-check' ); ?></h1>
		<hr />
		<?php ns_theme_check_render_form(); ?>
		<hr />
		<?php ns_theme_check_render_output(); ?>
	</div>
	<?php
}
