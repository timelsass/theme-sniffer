<?php
/**
 * File for sniff checking methods
 *
 * @since      0.2.0
 *
 * @package    Theme_Sniffer\Admin
 */

namespace Theme_Sniffer\Admin;

use Theme_Sniffer\Admin\Helpers as Helpers;

/**
 * Class that controls the sniff checks
 *
 * Holds the methods necessary for sniff checks and style.css header
 * check.
 *
 * @package    Theme_Sniffer\Admin
 */
class Checks {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.2.0
	 * @param    string  $plugin_name  The name of this plugin.
	 * @param    string  $version      The version of this plugin.
	 * @param    Helpers $helpers      Helpers class instance.
	 */
	public function __construct( $plugin_name, $version, Helpers $helpers ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->helpers     = $helpers;
	}

	/**
	 * Perform sniff check.
	 *
	 * @since 0.1.0
	 *
	 * @param string $theme_slug Theme slug.
	 * @param array  $args Arguments.
	 * @param string $file Path of the file to sniff.
	 *
	 * @return bool
	 */
	public function perform_sniff( $theme_slug, $args = array(), $file ) {

		require_once WP_PLUGIN_DIR . '/' . $this->plugin_name . '/vendor/autoload.php';

		$defaults = array(
			'show_warnings'       => true,
			'raw_output'          => 0,
			'minimum_php_version' => '5.2',
			'standard'            => array(),
			'text_domains'        => array( $theme_slug ),
		);

		$args = wp_parse_args( $args, $defaults );

		// Set CLI arguments.
		$values['files']              = $file;
		$values['reportWidth']        = '110';
		$values['ignore-annotations'] = true;

		if ( 0 === absint( $args['raw_output'] ) ) {
			$values['reports']['json'] = null;
		}

		if ( ! empty( $args['standard'] ) ) {
			$values['standard'] = $args['standard'];
		}

		$values['standard'][] = WP_PLUGIN_DIR . '/' . $this->plugin_name . '/phpcs.xml';

		// Set default standard.
		PHP_CodeSniffer::setConfigData( 'default_standard', 'WordPress-Theme', true );

		// Ignoring warnings when generating the exit code.
		PHP_CodeSniffer::setConfigData( 'ignore_warnings_on_exit', true, true );

		// Show only errors?
		PHP_CodeSniffer::setConfigData( 'show_warnings', absint( $args['show_warnings'] ), true );

		// Ignore unrelated files from the check.
		$values['ignored'] = array(
			'.*/node_modules/.*',
			'.*/vendor/.*',
			'.*/assets/build/.*',
			'.*/build/.*',
		);

		// Set minimum supported PHP version.
		PHP_CodeSniffer::setConfigData( 'testVersion', $args['minimum_php_version'] . '-7.0', true );

		// Set text domains.
		PHP_CodeSniffer::setConfigData( 'text_domain', implode( ',', $args['text_domains'] ), true );

		// Path to WordPress Theme coding standard.
		PHP_CodeSniffer::setConfigData( 'installed_paths', WP_PLUGIN_DIR . '/' . $this->plugin_name . '/vendor/wp-coding-standards/wpcs/', true );

		// Initialize CodeSniffer.
		$phpcs_cli = new PHP_CodeSniffer_CLI();
		$phpcs_cli->checkRequirements();

		ob_start();
		$num_errors = $phpcs_cli->process( $values );
		$raw_output = ob_get_clean();
		$output     = '';

		// Sniff theme files.
		if ( 1 === absint( $args['raw_output'] ) ) {
			if ( ! empty( $raw_output ) ) {
				$output = '<pre>' . esc_html( $raw_output ) . '</pre>';
			}
		} else {
			$output = json_decode( $raw_output );
		} // End if().

		return $output;
	}

	/**
	 * Perform style.css header check.
	 *
	 * @since 0.3.0
	 *
	 * @param string $theme_slug Theme slug.
	 * @param array  $theme WP_Theme Theme object.
	 *
	 * @return bool
	 */
	public function style_headers_check( $theme_slug, $theme ) {

		$pass             = true;
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
					/* translators: 1: comment header line, 2: style.css */
					esc_html__( 'The %1$s is not defined in the style.css header.', 'theme-sniffer' ),
					$header
				),
				'severity' => 'error',
			);
		}

		if ( strpos( $theme_slug, 'wordpress' ) || strpos( $theme_slug, 'theme' ) ) { // WPCS: spelling ok.
			$notices[] = array(
				'message'  => esc_html__( 'The theme name cannot contain WordPress or Theme.', 'theme-sniffer' ),
				'severity' => 'error',
			);
		}

		if ( preg_match( '|[^\d\.]|', $theme->get( 'Version' ) ) ) {
			$notices[] = array(
				'message'  => esc_html__( 'Version strings can only contain numeric and period characters (like 1.2).', 'theme-sniffer' ),
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
				/* translators: %1$s: Text Domain, %2$s: Theme Slug */
				'message'  => sprintf(
					esc_html__( 'The text domain "%1$s" must match the theme slug "%2$s".', 'theme-sniffer' ),
					$theme->get( 'TextDomain' ),
					$theme_slug
				),
				'severity' => 'error',
			);
		}

		$helpers = new Helpers();

		$registered_tags    = $helpers->get_theme_tags();
		$tags               = array_map( 'strtolower', $theme->get( 'Tags' ) );
		$tags_count         = array_count_values( $tags );
		$subject_tags_names = array();

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

			if ( isset( $registered_tags['subject_tags'][ $tag ] ) ) {
				$subject_tags_names[] = $tag;
				continue;
			}

			if ( ! isset( $registered_tags['allowed_tags'][ $tag ] ) ) {
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

			if ( 'accessibility-ready' === $tag ) {
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

		if ( empty( $notices ) ) {
			return true;
		}

		?>
		<div class="report-file-item">
			<div class="report-file-heading">
				<span class="heading-field">
				<?php
				printf(
					/* translators: 1: File name */
					esc_html__( 'File: %s', 'theme-sniffer' ), esc_html( $theme_slug ) . '/style.css'
				);
				?>
				</span>
			</div><!-- .report-file-heading -->
			<table class="report-table">
			<?php foreach ( $notices as $notice ) : ?>
				<tr class="item-type-<?php echo esc_attr( $notice['severity'] ); ?>">
				<td class="td-type"><?php echo esc_html( $notice['severity'] ); ?></td>
				<td class="td-message"><?php echo esc_html( $notice['message'] ); ?></td>
				</tr>
			<?php endforeach; ?>
			</table>
		</div><!-- .report-file-item -->
		<?php
		return $pass;
	}

	/**
	 * Callback function for the individual sniff run
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @since 0.1.0
	 */
	public static function individual_sniff( \WP_REST_Request $request ) {
		$headers = $request->get_headers();

		// Bail if empty.
		if ( empty( $_GET['themeName'] ) || empty( $_GET['themeArgs'] ) || empty( $_GET['file'] ) ) { // Input var okay.
			$message = esc_html__( 'Theme name or arguments were not set, or file was empty', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Verify nonce.
		if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
			$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		$theme_name = sanitize_text_field( wp_unslash( $_GET['themeName'] ) ); // Input var okay.
		$theme_args = array_map( 'sanitize_text_field', wp_unslash( $_GET['themeArgs'] ) ); // Input var okay.
		$theme_file = sanitize_text_field( wp_unslash( $_GET['file'] ) ); // Input var okay.

		$sniff = self::perform_sniff( $theme_name, $theme_args, $theme_file );

		wp_send_json_success( $sniff );
	}

	/**
	 * Callback function for the run sniffer endpoint
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @since 0.1.0
	 */
	public static function run_sniffer( \WP_REST_Request $request ) {
		$headers = $request->get_headers();
		$self = new static;

		// Bail if empty.
		if ( empty( $_GET['themeName'] ) ) { // Input var okay.
			$message = esc_html__( 'Theme name not selected.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Verify nonce.
		if ( ! wp_verify_nonce( $headers['x_wp_nonce'][0], 'wp_rest' ) ) {
			$message = esc_html__( 'Nonce error.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		// Exit if plugin not bundled properly.
		if ( ! file_exists( WP_PLUGIN_DIR . '/' . $self->plugin_name . '/vendor/autoload.php' ) ) {
			// translators: Placeholders are used for inserting hardcoded links to the repository.
			$message = sprintf( esc_html__( 'It seems you are using GitHub provided zip for the plugin. Visit %1$sInstalling%2$s to find the correct bundled plugin zip.', 'theme-sniffer' ), '<a href="https://github.com/WPTRT/theme-sniffer#installing" target="_blank">', '</a>' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		if ( empty( $_GET['wpRulesets'] ) ) { // Input var okay.
			$message = esc_html__( 'Please select at least one standard.', 'theme-sniffer' );
			$error   = new \WP_Error( '-1', $message );
			wp_send_json_error( $error );
		}

		$theme_slug = sanitize_text_field( wp_unslash( $_GET['themeName'] ) ); // Input var okay.

		if ( isset( $_GET['hideWarning'] ) && 'true' === $_GET['hideWarning'] ) { // Input var okay.
			$args['show_warnings'] = 'false';
		}

		if ( isset( $_GET['rawOutput'] ) && 'true' === $_GET['rawOutput'] ) { // Input var okay.
			$args['raw_output'] = 1;
		}

		if ( isset( $_GET['minimumPHPVersion'] ) && ! empty( $_GET['minimumPHPVersion'] ) ) { // Input var okay.
			$args['minimum_php_version'] = sanitize_text_field( wp_unslash( $_GET['minimumPHPVersion'] ) );// Input var okay.
		}

		$standards = $self->helpers->get_wpcs_standards();

		$selected_standards = array_map( 'sanitize_text_field', wp_unslash( $_GET['wpRulesets'] ) ); // Input var okay.

		foreach ( $selected_standards as $key => $standard ) {
			if ( ! empty( $standards[ $standard ] ) ) {
				$args['standard'][] = $standards[ $standard ]['label'];
			}
		}

		$theme     = wp_get_theme( $theme_slug );
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

		$all_files = $theme->get_files( array( 'php', 'css,', 'js' ), -1, false );

		wp_send_json_success( array( $theme_slug, $args, $all_files ) );
	}
}
