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

use Theme_Sniffer\Admin\Administration;
use Theme_Sniffer\Admin\Checks;

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
 */
class Main extends Config {

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
	 * @param Loader               $loader Loader dependency.
	 * @param Internationalization $plugin_i18n Internationalization dependency.
	 * @param Administration       $admin Admin dependency.
	 * @param Checks               $checks Checks dependency.
	 * @since 0.2.0
	 */
	public function __construct(
		Loader $loader,
		Internationalization $plugin_i18n,
		Administration $admin,
		Checks $checks
	) {
		$this->loader      = $loader;
		$this->plugin_i18n = $plugin_i18n;
		$this->admin       = $admin;
		$this->checks      = $checks;

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
		$this->loader->add_action( 'plugins_loaded', $this->plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since  0.2.0
	 * @access private
	 */
	private function define_admin_hooks() {
		$basename = static::PLUGIN_NAME . '/' . static::PLUGIN_NAME . '.php';

		$this->loader->add_action( 'plugin_action_links_' . $basename, $this->admin, 'plugin_settings_link' );
		$this->loader->add_action( 'admin_menu', $this->admin, 'admin_menu' );
		$this->loader->add_action( 'admin_enqueue_scripts', $this->admin, 'enqueue_scripts' );
		$this->loader->add_filter( 'extra_theme_headers', $this->admin, 'add_headers' );
	}

	/**
	 * Define hooks that will run on ajax call
	 *
	 * @since  0.2.0
	 * @access public
	 */
	private function define_ajax_hooks() {
		$this->loader->add_action( 'wp_ajax_run_sniffer', $this->checks, 'run_sniffer' );
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
