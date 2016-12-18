<?php

add_action( 'admin_menu', 'ns_theme_check_admin_menu' );

function ns_theme_check_admin_menu() {

	add_theme_page( __( 'NS Theme Check', 'ns-theme-check' ), __( 'NS Theme Check', 'ns-theme-check' ), 'manage_options', 'ns-theme-check', 'ns_theme_check_render_admin_page', 'dashicons-tickets' );

}

function ns_theme_check_render_admin_page() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'NS Theme Check', 'ns-theme-check' ); ?></h1>
		<hr />
		<?php ns_theme_check_render_form(); ?>
		<hr />

	</div><!-- .wrap -->
	<?php
}
