<?php
/**
 * Fired during plugin activation
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since   0.2.0
 * @package Theme_Sniffer\Includes
 */

namespace Theme_Sniffer\Includes;

/**
 * Class Activator
 */
final class Activator {
	/**
	 * Run functions on plugin activation
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
			include_once ABSPATH . '/wp-admin/includes/plugin.php';
		}

		$plugin = \plugin_basename( __FILE__ );

		if ( ! current_user_can( 'activate_plugins' ) ) {
			\deactivate_plugins( $plugin );

			$error_message = esc_html__( 'You do not have proper authorization to activate a plugin!', 'theme-sniffer' );
			return \wp_die( esc_html( $error_message ) );
		}

		if ( version_compare( PHP_VERSION, '5.6', '<' ) ) {
			\deactivate_plugins( $plugin );

			$error_message = esc_html__( 'Theme Sniffer requires PHP 5.6 or greater to function.', 'theme-sniffer' );
			return \wp_die( esc_html( $error_message ) );
		}
	}
}
