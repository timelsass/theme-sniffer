<?php
/**
 * Helper functions
 *
 * @package NS_Theme_Check
 */

/**
 * Render JSON data in cleaner format.
 *
 * @since 0.1.0
 *
 * @param string $json JSON data.
 */
function ns_theme_check_render_json_report( $json ) {

	if ( ! isset( $json->files ) ) {
		return;
	}
	?>
	<?php foreach ( $json->files as $file_key => $file ) : ?>
		<?php
		if ( 0 === absint( $file->errors ) && 0 === absint( $file->warnings ) ) {
			continue;
		}
		$exploded_file_path = explode( '/themes/', $file_key );
		$file_name = array_pop( $exploded_file_path );
		?>
		<div class="report-file-item">
			<div class="report-file-heading">
				<span class="report-file-heading-field"><?php printf( esc_html__( 'File: %s','ns-theme-check' ), esc_html( $file_name ) ); ?></span><!-- .report-file-heading-field -->
			</div><!-- .report-file-heading -->
			<?php if ( ! empty( $file->messages ) && is_array( $file->messages ) ) : ?>
				<table class="report-table">
					<?php foreach ( $file->messages as $item ) : ?>
						<?php $row_class = ( 'error' === strtolower( $item->type ) ) ?'item-type-error' : 'item-type-warning'; ?>
						<tr class="<?php echo esc_attr( $row_class ); ?>">
							<td class="td-line"><?php printf( esc_html__( 'Line: %d','ns-theme-check' ), absint( $item->line ) ); ?></td>
							<td class="td-type"><?php echo esc_html( $item->type ); ?></td>
							<td class="td-message"><?php echo esc_html( $item->message ); ?></td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endif; ?>
		</div><!-- .report-file-item -->
	<?php endforeach; ?>
	<?php
}

/**
 * Returns standards.
 *
 * @since 0.1.3
 *
 * @return array Standards details.
 */
function ns_theme_check_get_standards() {

	$output = array(
		'wordpress-theme' => array(
			'label'       => 'WordPress-Theme',
			'description' => 'Ruleset for WordPress theme review requirements (Required)',
			'default'     => 1,
		),
		'wordpress-core' => array(
			'label'       => 'WordPress-Core',
			'description' => 'Main ruleset for WordPress core coding standards (Optional)',
			'default'     => 0,
		),
		'wordpress-extra' => array(
			'label'       => 'WordPress-Extra',
			'description' => 'Extended ruleset for recommended best practices (Optional)',
			'default'     => 0,
		),
		'wordpress-docs' => array(
			'label'       => 'WordPress-Docs',
			'description' => 'Additional ruleset for WordPress inline documentation standards (Optional)',
			'default'     => 0,
		),
		'wordpress-vip' => array(
			'label'       => 'WordPress-VIP',
			'description' => 'Extended ruleset for WordPress VIP coding requirements (Optional)',
			'default'     => 0,
		),
	);

	return $output;

}

/**
 * Returns PHP versions.
 *
 * @since 0.1.3
 *
 * @return array PHP versions.
 */
function ns_theme_check_get_php_versions() {

	$output = array(
		'5.2',
		'5.3',
		'5.4',
		'5.5',
		'5.6',
		'7.0',
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
function ns_theme_check_get_theme_tags() {

	$tags['allowed_tags'] = array(
		'grid-layout'           => 'grid-layout',
		'one-column'            => 'one-column',
		'two-columns'           => 'two-columns',
		'three-columns'         => 'three-columns',
		'four-columns'          => 'four-columns',
		'left-sidebar'          => 'left-sidebar',
		'right-sidebar'         => 'right-sidebar',
		'flexible-header'       => 'flexible-header',
		'footer-widgets'        => 'footer-widgets',
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
function ns_theme_check_add_headers( $extra_headers ) {
	$extra_headers[] = 'License';
	$extra_headers[] = 'License URI';
	$extra_headers[] = 'Template Version';
	return $extra_headers;
}
add_filter( 'extra_theme_headers', 'ns_theme_check_add_headers' );
