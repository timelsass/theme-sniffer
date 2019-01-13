<?php
/**
 * File containing the asset aware interface
 *
 * @since 0.2.0
 * @package Theme_Sniffer\Assets
 */

declare( strict_types=1 );

namespace Theme_Sniffer\Assets;

/**
 * Assets Aware interface.
 */
interface Assets_Aware {
  /**
   * Set the assets handler to use within this object.
   *
   * @param Assets_Handler $assets Assets handler to use.
   */
  public function with_assets_handler( Assets_Handler $assets );
}
