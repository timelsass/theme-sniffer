<?php
/**
 * The helpers trait file
 *
 * @since   2.0.0
 * @package Theme_Sniffer\Helpers
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Helpers;

/**
 * Sniffer helpers trait
 *
 * This trait contains some helper methods
 */
trait Sniffer_Helpers {
	/**
	 * Returns standards
	 *
	 * Includes a 'theme_sniffer_add_standards' filter, so that user can add their own standard. The standard has to be added
	 * in the composer before bundling the plugin.
	 *
	 * @since 1.0.0 Added filter so that user can add their own standards. Moved to a trait.
	 * @since 0.1.3
	 *
	 * @return array Standards details.
	 */
	public function get_wpcs_standards() : array {
		$standards = [
			'wordpress-theme' => [
				'label'       => 'WPThemeReview',
				'description' => esc_html__( 'Ruleset for WordPress theme review requirements (Required)', 'theme-sniffer' ),
				'default'     => 1,
			],
			'wordpress-core'  => [
				'label'       => 'WordPress-Core',
				'description' => esc_html__( 'Main ruleset for WordPress core coding standards (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			],
			'wordpress-extra' => [
				'label'       => 'WordPress-Extra',
				'description' => esc_html__( 'Extended ruleset for recommended best practices (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			],
			'wordpress-docs'  => [
				'label'       => 'WordPress-Docs',
				'description' => esc_html__( 'Additional ruleset for WordPress inline documentation standards (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			],
			'wordpress-vip'   => [
				'label'       => 'WordPress-VIP',
				'description' => esc_html__( 'Extended ruleset for WordPress VIP coding requirements (Optional)', 'theme-sniffer' ),
				'default'     => 0,
			],
		];

		if ( has_filter( 'theme_sniffer_add_standards' ) ) {
			$standards = apply_filters( 'theme_sniffer_add_standards', $standards );
		}

		return $standards;
	}

	/**
	 * Return all the active themes
	 *
	 * @since  0.2.0 Moved to a trait.
	 * @return array Array of active themes.
	 */
	public function get_active_themes() : array {
		$all_themes = wp_get_themes();
		$themes     = [];

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
	 * @since 1.0.0 Added PHP 7.x versions. Moved to a trait.
	 * @since 0.1.3
	 *
	 * @return array PHP versions.
	 */
	public function get_php_versions() : array {
		return [
			'5.2',
			'5.3',
			'5.4',
			'5.5',
			'5.6',
			'7.0',
			'7.1',
			'7.2',
			'7.3',
		];
	}

	/**
	 * Returns theme tags.
	 *
	 * @since 1.0.0 Moved to a trait.
	 * @since 0.1.3
	 *
	 * @return array Theme tags array.
	 */
	public function get_theme_tags() : array {

		$tags['allowed_tags'] = [
			'two-columns',
			'three-columns',
			'four-columns',
			'left-sidebar',
			'right-sidebar',
			'grid-layout',
			'flexible-header',
			'accessibility-ready',
			'buddypress',
			'custom-background',
			'custom-colors',
			'custom-header',
			'custom-menu',
			'custom-logo',
			'editor-style',
			'featured-image-header',
			'featured-images',
			'footer-widgets',
			'front-page-post-form',
			'full-width-template',
			'microformats',
			'post-formats',
			'rtl-language-support',
			'sticky-post',
			'theme-options',
			'threaded-comments',
			'translation-ready',
		];

		$tags['subject_tags'] = [
			'blog',
			'e-commerce',
			'education',
			'entertainment',
			'food-and-drink',
			'holiday',
			'news',
			'photography',
			'portfolio',
		];

		return $tags;
	}

	/**
	 * Helper method that returns the default stnadard
	 *
	 * @since 1.0.0
	 * @return string Name of the default standard
	 */
	public function get_default_standard() : string {
		return 'WPThemeReview';
	}
}
