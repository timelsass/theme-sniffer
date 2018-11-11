<?php
/**
 * File for sniff checking methods
 *
 * @since 0.2.0
 *
 * @package Theme_Sniffer\Admin
 */

namespace Theme_Sniffer\Admin;

// We need to use the PHP_CS autoloader to access the Runner and Config.
require_once dirname( dirname( __FILE__ ) ) . '/vendor/squizlabs/php_codesniffer/autoload.php';

use \PHP_CodeSniffer\Runner;
use \PHP_CodeSniffer\Config;
use \PHP_CodeSniffer\Reporter;
use \PHP_CodeSniffer\Files\DummyFile;

use Theme_Sniffer\Admin\Helpers;
use Theme_Sniffer\Includes\Config as Plugin_Config;

/**
 * Class that controls the sniff checks
 *
 * Holds the methods necessary for sniff checks
 *
 * @package Theme_Sniffer\Admin
 */
class Checks extends Plugin_Config {
	/**
	 * Perform style.css header check.
	 *
	 * @since 0.3.0
	 *
	 * @param string    $theme_slug    Theme slug.
	 * @param \WP_Theme $theme         WP_Theme Theme object.
	 * @param bool      $show_warnings Show warnings.
	 *
	 * @return bool
	 */
	private function style_headers_check( $theme_slug, \WP_Theme $theme, $show_warnings ) {

		$required_headers = array(
			'Name',
			'Description',
			'Author',
			'Version',
			'License',
			'License URI',
			'TextDomain',
		);

		foreach ( $required_headers as $header ) {
			if ( $theme->get( $header ) ) {
				continue;
			}

			$notices[] = array(
				'message'  => sprintf(
					/* translators: 1: comment header line */
					esc_html__( 'The %1$s is not defined in the style.css header.', 'theme-sniffer' ),
					$header
				),
				'severity' => 'error',
			);
		}

		if ( strpos( $theme_slug, 'wordpress' ) || strpos( $theme_slug, 'theme' ) ) { // WPCS: spelling ok.
			$notices[] = array(
				'message'  => esc_html__( 'The theme name cannot contain WordPress or Theme as a part of its name.', 'theme-sniffer' ),
				'severity' => 'error',
			);
		}

		if ( preg_match( '|[^\d\.]|', $theme->get( 'Version' ) ) ) {
			$notices[] = array(
				'message'  => esc_html__( 'Version strings can only contain numeric and period characters (e.g. 1.2).', 'theme-sniffer' ),
				'severity' => 'error',
			);
		}

		// Prevent duplicate URLs.
		$themeuri  = trim( $theme->get( 'ThemeURI' ), '/\\' );
		$authoruri = trim( $theme->get( 'AuthorURI' ), '/\\' );

		if ( $themeuri === $authoruri ) {
			$notices[] = array(
				'message'  => esc_html__( 'Duplicate theme and author URLs. A theme URL is a page/site that provides details about this specific theme. An author URL is a page/site that provides information about the author of the theme. The theme and author URL are optional.', 'theme-sniffer' ),
				'severity' => 'error',
			);
		}

		if ( $theme_slug === $theme->get( 'Text Domain' ) ) {
			$notices[] = array(
				'message'  => sprintf(
					/* translators: %1$s: Text Domain, %2$s: Theme Slug */
					esc_html__( 'The text domain "%1$s" must match the theme slug "%2$s".', 'theme-sniffer' ),
					$theme->get( 'TextDomain' ),
					$theme_slug
				),
				'severity' => 'error',
			);
		}

		$registered_tags    = Helpers::get_theme_tags();
		$tags               = array_map( 'strtolower', $theme->get( 'Tags' ) );
		$tags_count         = array_count_values( $tags );
		$subject_tags_names = array();

		$subject_tags = array_flip( $registered_tags['subject_tags'] );
		$allowed_tags = array_flip( $registered_tags['allowed_tags'] );

		foreach ( $tags as $tag ) {
			if ( $tags_count[ $tag ] > 1 ) {
				$notices[] = array(
					'message'  => sprintf(
						/* translators: %s: Theme tag */
						esc_html__( 'The tag "%s" is being used more than once, please remove the duplicate.', 'theme-sniffer' ),
						$tag
					),
					'severity' => 'error',
				);
			}

			if ( isset( $subject_tags[ $tag ] ) ) {
				$subject_tags_names[] = $tag;
				continue;
			}

			if ( ! isset( $allowed_tags[ $tag ] ) ) {
				$notices[] = array(
					'message'  => sprintf(
						/* translators: %s: Theme tag */
						esc_html__( 'Please remove "%s" as it is not a standard tag.', 'theme-sniffer' ),
						$tag
					),
					'severity' => 'error',
				);
				continue;
			}

			if ( 'accessibility-ready' === $tag && $show_warnings ) {
				$notices[] = array(
					'message'  => esc_html__( 'Themes that use the "accessibility-ready" tag will need to undergo an accessibility review.', 'theme-sniffer' ),
					'severity' => 'warning',
				);
			}
		}

		$subject_tags_count = count( $subject_tags_names );

		if ( $subject_tags_count > 3 ) {
			$notices[] = array(
				'message'  => sprintf(
					/* translators: 1: Subject theme tag, 2: Tags list */
					esc_html__( 'A maximum of 3 subject tags are allowed. The theme has %1$d subjects tags [%2$s]. Please remove the subject tags, which do not directly apply to the theme.', 'theme-sniffer' ),
					$subject_tags_count,
					implode( ',', $subject_tags_names )
				),
				'severity' => 'error',
			);
		}

		$theme_root = get_theme_root( $theme_slug );

		if ( empty( $notices ) ) {
			return array();
		}

		$error_count   = 0;
		$warning_count = 0;
		$messages      = array();

		foreach ( $notices as $notice ) {
			$severity = $notice['severity'];
			if ( $severity === 'error' ) {
				$error_count++;
			} else {
				$warning_count++;
			}

			$messages[] = array(
				'message'  => $notice['message'],
				'severity' => $severity,
				'fixable'  => false,
				'type'     => false,
			);
		}

		$header_results = array(
			'totals' => array(
				'errors'   => $error_count,
				'warnings' => $warning_count,
				'fixable'  => $error_count + $warning_count,
			),
			'files' => array(
				"{$theme_root}/{$theme_slug}/style.css" => array(
					'errors'   => $error_count,
					'warnings' => $warning_count,
					'messages' => $messages,
				),
			),
		);

		return $header_results;
	}

	/**
	 * Callback function to run the sniffer
	 *
	 * Props to Greg Sherwood on helping with the example of the phpcs runner
	 * https://gist.github.com/gsherwood/aafd2c16631a8a872f0c4a23916962ac.
	 *
	 * Once necessary checks are being made (security, arguments, check for minified files), a Runner class
	 * is called, and a config is set. For full config explanation, see
	 * https://github.com/squizlabs/PHP_CodeSniffer/blob/master/src/Config.php
	 *
	 * @since 0.2.0 Removed extra callback, and use just one callback to check every file.
	 * @since 0.1.0
	 *
	 * @throws \WP_Error Throws WP_Error if error happens.
	 */
	public function run_sniffer() {
		// Bail if theme wasn't selected.
		if ( empty( $_POST['themeName'] ) ) {
			$message = esc_html__( 'Theme name not selected.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Nonce check.
		if ( isset( $_POST['nonce'] ) &&
			! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'theme_sniffer_nonce' )
		) {
			$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Additional settings (theme prefixes, standards, preview options).
		$theme_prefixes = '';

		if ( isset( $_POST['themePrefixes'] ) && $_POST['themePrefixes'] !== '' ) {
			$theme_prefixes = sanitize_text_field( wp_unslash( $_POST['themePrefixes'] ) );
		}

		if ( empty( $_POST['wpRulesets'] ) ) {
			$message = esc_html__( 'Please select at least one standard.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		$theme_slug = sanitize_text_field( wp_unslash( $_POST['themeName'] ) );

		$show_warnings = true;

		if ( isset( $_POST['hideWarning'] ) && $_POST['hideWarning'] === 'true' ) {
			$show_warnings = false;
		}

		$raw_output = false;

		if ( isset( $_POST['rawOutput'] ) && $_POST['rawOutput'] === 'true' ) {
			$raw_output = true;
		}

		$ignore_annotations = false;

		if ( isset( $_POST['ignoreAnnotations'] ) && $_POST['ignoreAnnotations'] === 'true' ) {
			$ignore_annotations = true;
		}

		if ( isset( $_POST['minimumPHPVersion'] ) && ! empty( $_POST['minimumPHPVersion'] ) ) {
			$minimum_php_version = sanitize_text_field( wp_unslash( $_POST['minimumPHPVersion'] ) );
		}

		// Check theme headers.
		$theme_header_checks = $this->style_headers_check( $theme_slug, wp_get_theme( $theme_slug ), $show_warnings );

		$standards = Helpers::get_wpcs_standards();

		$standards_array = array();

		$selected_standards = array_map( 'sanitize_text_field', wp_unslash( $_POST['wpRulesets'] ) );
		foreach ( $selected_standards as $key => $standard ) {
			if ( ! empty( $standards[ $standard ] ) ) {
				$standards_array[] = $standards[ $standard ]['label'];
			}
		}

		$theme     = \wp_get_theme( $theme_slug );
		$php_files = $theme->get_files( 'php', 4, false );

		// Current theme text domain.
		$args['text_domains'][] = $theme_slug;

		// Frameworks.
		foreach ( $php_files as $key => $file ) {
			if ( strrpos( $key, 'hybrid.php' ) ) {
				$args['text_domains'][] = 'hybrid-core';
			}
			if ( strrpos( $key, 'kirki.php' ) ) {
				$args['text_domains'][] = 'kirki';
			}
		}

		$all_files     = $theme->get_files( array( 'php', 'css,', 'js' ), -1, false );
		$removed_files = [];

		// Minified file check.
		foreach ( $all_files as $file_name => $file_path ) {
			// Check if files have .min in the file name.
			if ( false !== strpos( $file_name, '.min.js' ) || false !== strpos( $file_name, '.min.css' ) ) {
				unset( $all_files[ $file_name ] );
				$removed_files[] = $file_name;
				break;
			}

			try {
				$file_contents = file_get_contents( $file_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				$file_lines    = explode( "\n", $file_contents );

				$row = 0;
				foreach ( $file_lines as $line ) {
					if ( $row <= 10 ) {
						if ( strlen( $line ) > 1000 ) {
							unset( $all_files[ $file_name ] );
							$removed_files[] = $file_name;
							break;
						}
					}
				}
			} catch ( Exception $e ) {
				throw new \WP_Error(
					'error_reading_file',
					sprintf(
						/* translators: %s: Name of the file */
						esc_html__( 'There was an error reading the file %s', 'theme-sniffer' ),
						$file_name
					)
				);
			}
		}

		$ignored = '.*/node_modules/.*,.*/vendor/.*,.*/assets/build/.*,.*/build/.*,.*/bin/.*';

		$runner = new Runner();

		$runner->config            = new Config( [ '-s', '-p' ] );
		$runner->config->standards = $standards_array;

		// Set default standard.
		Config::setConfigData( 'default_standard', 'WPThemeReview', true );

		// Ignoring warnings when generating the exit code.
		Config::setConfigData( 'ignore_warnings_on_exit', true, true );

		// Show only errors?
		Config::setConfigData( 'show_warnings', $show_warnings, true );

		// Set minimum supported PHP version.
		Config::setConfigData( 'testVersion', $minimum_php_version . '-', true );

		// Set text domains.
		Config::setConfigData( 'text_domain', implode( ',', $args['text_domains'] ), true );

		if ( $theme_prefixes !== '' ) {
			// Set prefix.
			Config::setConfigData( 'prefixes', $theme_prefixes, true );
		}

		$all_files = array_values( $all_files );

		$runner->config->files       = $all_files;
		$runner->config->annotations = $ignore_annotations;
		$runner->config->parallel    = false;
		$runner->config->colors      = false;
		$runner->config->tabWidth    = 0;
		$runner->config->reportWidth = 110;
		$runner->config->interactive = false;
		$runner->config->cache       = false;
		$runner->config->ignored     = $ignored;

		if ( ! $raw_output ) {
			$runner->config->reports = [ 'json' => null ];
		}

		$runner->init();

		$runner->reporter = new Reporter( $runner->config );

		foreach ( $all_files as $file_path ) {
			$file       = new DummyFile( file_get_contents( $file_path ), $runner->ruleset, $runner->config );
			$file->path = $file_path;

			$runner->processFile( $file );
		}

		ob_start();
		$runner->reporter->printReports();
		$sniff_results = ob_get_clean();

		$theme_header_checks;

		$sniffer_results = json_decode( $sniff_results, true );

		$total_errors  = $theme_header_checks['totals']['errors'] + $sniffer_results['totals']['errors'];
		$total_warning = $theme_header_checks['totals']['warnings'] + $sniffer_results['totals']['warnings'];
		$total_fixable = $theme_header_checks['totals']['fixable'] + $sniffer_results['totals']['fixable'];
		$total_files   = $theme_header_checks['files'] + $sniffer_results['files'];

		$results = array(
			'totals' => array(
				'errors'   => $total_errors,
				'warnings' => $total_warning,
				'fixable'  => $total_fixable,
			),
			'files'  => $total_files,
		);

		\wp_send_json( $results );
	}
}
