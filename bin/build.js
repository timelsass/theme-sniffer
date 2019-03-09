const fs = require( 'fs' ),
	path = require( 'path' );

( async () => {
	var rd = fs.createReadStream( path.resolve( path.join( __dirname, '..', 'assets', 'dev', 'licenses.json' ) ) );
	var wr = fs.createWriteStream( path.resolve( path.join( __dirname, '..', 'assets', 'build', 'licenses.json' ) ) );
	try {
		return await new Promise( ( resolve, reject ) => {
			rd.on( 'error', reject );
			wr.on( 'error', reject );
			wr.on( 'finish', resolve );
			rd.pipe( wr );
		} );
	} catch ( e ) {
		rd.destroy();
		wr.end();
		throw e;
	}
} )().catch( console.error );
