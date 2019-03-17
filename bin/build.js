const fs = require( 'fs' );
const path = require( 'path' );

( async () => {
	const read = fs.createReadStream( path.resolve( path.join( __dirname, '..', 'assets', 'dev', 'licenses.json' ) ) );
	const write = fs.createWriteStream( path.resolve( path.join( __dirname, '..', 'assets', 'build', 'licenses.json' ) ) );

	try {
		return await new Promise( ( resolve, reject ) => {
			read.on( 'error', reject );
			write.on( 'error', reject );
			write.on( 'finish', resolve );
			read.pipe( write );
		} );
	} catch ( error ) {
		read.destroy();
		write.end();
		throw error;
	}

} )().catch( console.error );
