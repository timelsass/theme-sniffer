<?php
/**
 * Plugin Name:       Theme Sniffer
 * Plugin URI:        https://github.com/WPTRT/theme-sniffer
 * Description:       Theme Sniffer plugin which uses phpcs for automatic theme checking.
 * Version:           0.2.0
 * Author:            WPTRT
 * Author URI:        https://make.wordpress.org/themes/
 * Text Domain:       theme-sniffer
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @since  0.1.0
 * @package Theme_Sniffer
 */

namespace Theme_Sniffer;
use Theme_Sniffer\Includes as Includes;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'THEME_SNIFFER_VERSION', '0.2.0' );
define( 'THEME_SNIFFER_NAME', 'theme-sniffer' );

// Include the autoloader so we can dynamically include the rest of the classes.
include_once( 'lib/autoloader.php' );

add_action( 'admin_init', __NAMESPACE__ . '\\check_php' );

/**
 * Check php function hook
 *
 * Hooks to the init hook, checks for the php version - if lower than 5.3
 * will disable the plugin and add a notice.
 *
 * @since  0.1.4
 * @return void
 */
function check_php() {
	// If php version is lower than 5.3, abort.
	if ( version_compare( PHP_VERSION, '5.3', '<' ) ) {
		$plugin = plugin_basename( __FILE__ );

		if ( is_plugin_active( $plugin ) ) {
			deactivate_plugins( $plugin );
			add_action( 'admin_notices',  __NAMESPACE__ . '\\error_activation_notice' );
			remove_filter( 'plugin_action_links_' . $plugin, 'theme_sniffer_plugin_settings_link' );
			unset( $_GET['activate'] ); // Input var okay.
		}
	}
}

/**
 * Activation error message hook.
 *
 * Hooks to admin_notices hook and outputs the message on activation error.
 *
 * @since  0.1.4
 * @return void
 */
function error_activation_notice() {
	?>
	<div class="error">
		<p><?php esc_html_e( 'Theme Sniffer requires PHP 5.3 or greater to function.', 'theme-sniffer' ); ?></p>
	</div>
	<?php
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_theme_sniffer() {
	$plugin = new Includes\Theme_Sniffer();
	$plugin->run();
}

run_theme_sniffer();
