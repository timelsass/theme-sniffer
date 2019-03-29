const fs = require( 'fs' );
const path = require( 'path' );
const licenses = require( 'wp-license-compatibility' );

fs.writeFile( path.resolve( path.join( __dirname, '..', 'assets', 'build', 'licenses.json' ) ), JSON.stringify( licenses, null, 2 ), err => console.error );
