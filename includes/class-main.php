<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @since 0.2.0
 *
 * @package Theme_Sniffer\Includes
 */

namespace Theme_Sniffer\Includes;

use Theme_Sniffer\Admin as Admin;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since   0.2.0
 * @package Theme_Sniffer\Includes
 * @author  Infinum <info@infinum.co>
 */
class Main {

	/**
	 * Plugin name constant
	 */
	const PLUGIN_NAME = 'theme-sniffer';

	/**
	 * Plugin version constant
	 */
	const PLUGIN_VERSION = '0.2.0';

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since  0.2.0
	 * @access protected
	 * @var    Theme_Sniffer_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since 0.2.0
	 */
	public function __construct() {
		$this->loader  = new Loader();
		$this->helpers = new Admin\Helpers();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_ajax_hooks();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since  0.2.0
	 * @access private
	 */
	private function set_locale() {
		$plugin_i18n = new Internationalization();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since  0.2.0
	 * @access private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Admin\Admin( self::PLUGIN_NAME, self::PLUGIN_VERSION );

		$this->loader->add_action( 'plugin_action_links_' . plugin_basename( __FILE__ ), $plugin_admin, 'plugin_settings_link' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'admin_menu' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_filter( 'extra_theme_headers', $this->helpers, 'add_headers' );
	}

	/**
	 * Define hooks that will run on ajax call
	 *
	 * @since  0.2.0
	 * @access public
	 */
	public function define_ajax_hooks() {
		$checks = new Admin\Checks( self::PLUGIN_NAME, self::PLUGIN_VERSION, $this->helpers );

		$this->loader->add_action( 'wp_ajax_run_sniffer', $checks, 'run_sniffer' );
		$this->loader->add_action( 'wp_ajax_individual_sniff', $checks, 'individual_sniff' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 0.2.0
	 */
	public function run() {
		$this->loader->run();
	}
}
