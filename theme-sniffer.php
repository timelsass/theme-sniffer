<?php
/**
 * Plugin Name: Theme Sniffer
 * Plugin URI:  https://github.com/WPTRT/theme-sniffer
 * Description: Theme Sniffer plugin which uses PHP_CodeSniffer for automatic theme checking.
 * Version:     0.2.0
 * Author:      WPTRT
 * Author URI:  https://make.wordpress.org/themes/
 * Text Domain: theme-sniffer
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @since   0.1.0
 * @package Theme_Sniffer
 */

namespace Theme_Sniffer;

use Theme_Sniffer\Includes\Main;
use Theme_Sniffer\Includes\Activator;
use Theme_Sniffer\Includes\Config;
use Theme_Sniffer\Includes\Loader;
use Theme_Sniffer\Includes\Internationalization;
use Theme_Sniffer\Admin\Administration;
use Theme_Sniffer\Admin\Checks;

// If this file is called directly, abort.
defined( 'ABSPATH' ) || die();

// Include the autoloader so we can dynamically include the rest of the classes.
$autoloader = __DIR__ . '/vendor/autoload.php';

if ( is_readable( $autoloader ) ) {
	include_once $autoloader;
}

// Check permissions and PHP version.
\register_activation_hook( __FILE__, [ Activator::class, 'activate' ] );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since 0.1.0
 * @since 0.2.0
 */
( new Main(
	new Loader(),
	new Internationalization(),
	new Administration(),
	new Checks()
) )->run();
