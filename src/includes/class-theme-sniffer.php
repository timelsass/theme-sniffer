<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @since      0.2.0
 *
 * @package    Theme_Sniffer\Includes
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
 * @since      0.2.0
 * @package    Theme_Sniffer\Includes
 * @author     Infinum <info@infinum.co>
 */
class Theme_Sniffer {
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
	 * @since    0.2.0
	 * @access   protected
	 * @var      Theme_Sniffer_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    0.2.0
	 */
	public function __construct() {
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		// $this->register_rest_routes();
		$this->helpers = $this->get_plugin_helpers();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    0.2.0
	 * @access   private
	 */
	private function load_dependencies() {
		$this->loader = new Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    0.2.0
	 * @access   private
	 */
	private function set_locale() {
		$plugin_i18n = new Internationalization();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    0.2.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		$plugin_admin   = new Admin\Admin( self::PLUGIN_NAME, self::PLUGIN_VERSION );
		$plugin_helpers = $this->helpers;

		$this->loader->add_action( 'plugin_action_links_' . plugin_basename( __FILE__ ), $plugin_admin, 'plugin_settings_link' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'admin_menu' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_filter( 'extra_theme_headers', $plugin_helpers, 'add_headers' );
	}

	/**
	 * Register custom REST routes.
	 *
	 * @since    0.2.0
	 * @access   private
	 */
	private function register_rest_routes() {
		$plugin_helpers = $this->helpers;
		$plugin_checks  = new Admin\Checks();

		$plugin_rest = new Admin\Routes( self::PLUGIN_NAME, $plugin_helpers, $plugin_checks );

		$this->loader->add_action( 'rest_api_init', $plugin_rest, 'endpoint_init' );
	}

	/**
	 * Method that returns instance of Helpers class.
	 *
	 * @return Admin\Helpers Instance of Helpers class.
	 * @since    0.2.0
	 * @access   private
	 */
	private function get_plugin_helpers() {
		return new Admin\Helpers();
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    0.2.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     0.2.0
	 * @return    Theme_Sniffer_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}
}
