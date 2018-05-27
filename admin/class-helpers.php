<?php
/**
 * File that holds helper class
 *
 * @since      0.2.0
 *
 * @package    Theme_Sniffer\Admin
 */

namespace Theme_Sniffer\Admin;

/**
 * Class that holds the helper methods.
 *
 * @package    Theme_Sniffer\Admin
 */
class Helpers {
	/**
	 * Returns standards
	 *
	 * Includes a 'theme_sniffer_add_standards' filter, so that user can add their own standard. The standard has to be added
	 * in the composer before bundling the plugin.
	 *
	 * @since 0.2.0 Added filter so that user can add their own standards.
	 * @since 0.1.3
	 *
	 * @return array Standards details.
	 */
	public function get_wpcs_standards() {
		$standards = array(
			'wordpress-theme' => array(
				'label'       => 'WordPress-Theme',
				'description' => esc_html__( 'Ruleset for WordPress theme review requirements (Required)', 'theme-sniffer' ),
				'default'     => 1,
			),
			'wordpress-core'  => array(
				'label'       => 'WordPress-Core',
				'description' => esc_html__( 'Main ruleset for WordPress core coding standards (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			),
			'wordpress-extra' => array(
				'label'       => 'WordPress-Extra',
				'description' => esc_html__( 'Extended ruleset for recommended best practices (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			),
			'wordpress-docs'  => array(
				'label'       => 'WordPress-Docs',
				'description' => esc_html__( 'Additional ruleset for WordPress inline documentation standards (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			),
			'wordpress-vip'   => array(
				'label'       => 'WordPress-VIP',
				'description' => esc_html__( 'Extended ruleset for WordPress VIP coding requirements (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			),
		);

		if ( has_filter( 'theme_sniffer_add_standards' ) ) {
			$standards = apply_filters( 'theme_sniffer_add_standards', $standards );
		}

		return $standards;
	}

	/**
	 * Return all the active themes
	 *
	 * @since 0.2.0
	 * @return array Array of active themes.
	 */
	public function get_active_themes() {
		$all_themes = wp_get_themes();
		$themes     = array();

		if ( ! empty( $all_themes ) ) {
			foreach ( $all_themes as $key => $theme ) {
				$themes[ $key ] = $theme->get( 'Name' );
			}
		}

		return $themes;
	}

	/**
	 * Returns PHP versions.
	 *
	 * @since 0.2.0 Added PHP 7.x versions
	 * @since 0.1.3
	 *
	 * @return array PHP versions.
	 */
	public function get_php_versions() {

		$output = array(
			'5.2',
			'5.3',
			'5.4',
			'5.5',
			'5.6',
			'7.0',
			'7.1',
			'7.2',
		);

		return $output;
	}

	/**
	 * Returns theme tags.
	 *
	 * @since 0.1.3
	 *
	 * @return array PHP versions.
	 */
	public function get_theme_tags() {

		$tags['allowed_tags'] = array(
			'two-columns'           => 'two-columns',
			'three-columns'         => 'three-columns',
			'four-columns'          => 'four-columns',
			'left-sidebar'          => 'left-sidebar',
			'right-sidebar'         => 'right-sidebar',
			'grid-layout'           => 'grid-layout',
			'flexible-header'       => 'flexible-header',
			'accessibility-ready'   => 'accessibility-ready',
			'buddypress'            => 'buddypress',
			'custom-background'     => 'custom-background',
			'custom-colors'         => 'custom-colors',
			'custom-header'         => 'custom-header',
			'custom-menu'           => 'custom-menu',
			'custom-logo'           => 'custom-logo',
			'editor-style'          => 'editor-style',
			'featured-image-header' => 'featured-image-header',
			'featured-images'       => 'featured-images',
			'footer-widgets'        => 'footer-widgets',
			'front-page-post-form'  => 'front-page-post-form',
			'full-width-template'   => 'full-width-template',
			'microformats'          => 'microformats',
			'post-formats'          => 'post-formats',
			'rtl-language-support'  => 'rtl-language-support',
			'sticky-post'           => 'sticky-post',
			'theme-options'         => 'theme-options',
			'threaded-comments'     => 'threaded-comments',
			'translation-ready'     => 'translation-ready',
		);

		$tags['subject_tags'] = array(
			'blog'           => 'blog',
			'e-commerce'     => 'e-commerce',
			'education'      => 'education',
			'entertainment'  => 'entertainment',
			'food-and-drink' => 'food-and-drink',
			'holiday'        => 'holiday',
			'news'           => 'news',
			'photography'    => 'photography',
			'portfolio'      => 'portfolio',
		);

		return $tags;
	}

	/**
	 * Allow fetching custom headers.
	 *
	 * @since 0.1.3
	 *
	 * @param array $extra_headers List of extra headers.
	 *
	 * @return array List of extra headers.
	 */
	public function add_headers( $extra_headers ) {
		$extra_headers[] = 'License';
		$extra_headers[] = 'License URI';
		$extra_headers[] = 'Template Version';

		return $extra_headers;
	}
}
