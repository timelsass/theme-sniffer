<?php

function ns_theme_check_render_form() {
	$all_themes = wp_get_themes();
	$themes = array();

	if ( ! empty( $all_themes ) ) {
		foreach ( $all_themes as $key => $theme ) {
			$themes[ $key ] = $theme->get( 'Name' );
		}
	}

	if ( empty( $themes ) ) {
		return;
	}

	?>
	<form action="themes.php?page=ns-theme-check" method="post">
		<label for="themename"><?php esc_html_e( 'Select Theme', 'ns-theme-check' ); ?>
			<select name="themename">
			<?php foreach ( $themes as $key => $value ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value ); ?></option>
			<?php endforeach; ?>
			</select>
		</label>
		<input type="submit" value="<?php esc_attr_e( 'GO', 'ns-theme-check' ); ?>" class="button button-secondary" />
	</form>
	<?php
}
