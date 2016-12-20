<?php
/**
 * Plugin Name:       NS Theme Check
 * Plugin URI:
 * Description:       Theme Check using sniffs.
 * Version:           0.1.0
 * Author:            Nilambar Sharma
 * Author URI:        http://nilambar.net
 * Text Domain:       ns-theme-check
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'NS_THEME_CHECK_BASENAME', basename( dirname( __FILE__ ) ) );
define( 'NS_THEME_CHECK_DIR', rtrim( plugin_dir_path( __FILE__ ), '/' ) );
define( 'NS_THEME_CHECK_URL', rtrim( plugin_dir_url( __FILE__ ), '/' ) );

require_once NS_THEME_CHECK_DIR . '/inc/helpers.php';
require_once NS_THEME_CHECK_DIR . '/inc/admin.php';
