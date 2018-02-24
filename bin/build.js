#!/usr/bin/env node
/*eslint no-console: ["error", { allow: ["info", "error"] }] */

const fs = require( 'fs' );
const path = require( 'path' );
const rimraf = require( 'rimraf' );
const archiver = require( 'archiver' );

// Helper methods
const mkdir = ( dir ) => {
	try {
		fs.mkdirSync( dir, 0o755 );
	} catch ( e ) {
		if ( e.code != 'EEXIST' ) {
			throw e;
		}
	}
};

const copyDir = ( src, dest ) => {
	mkdir( dest );
	const fileObjects = fs.readdirSync( src );

	if ( fileObjects.length ) {
		for ( let fileObject in fileObjects ) {
			if ( Object.prototype.hasOwnProperty.call( fileObjects, fileObject ) ) {
				const currentObject = fileObjects[fileObject];
				const current = fs.lstatSync( path.join( src, currentObject ) );

				if ( current.isDirectory() ) {
					copyDir( path.join( src, currentObject ), path.join( dest, currentObject ) );
				} else if ( current.isSymbolicLink() ) {
					const symLink = fs.readlinkSync( path.join( src, currentObject ) );
					fs.symlinkSync( symLink, path.join( src, currentObject ) );
				} else {
					copy( path.join( src, currentObject ), path.join( dest, currentObject ), ( err ) => {
						console.info( `Error occured: ${err}.` );
					});
				}
			}
		}
	}
};

const copy = ( source, target, cb ) => {
	let cbCalled = false;

	const rd = fs.createReadStream( source );

	rd.on( 'error', ( err ) => {
		done( err );
	});

	const wr = fs.createWriteStream( target );

	wr.on( 'error', ( err ) => {
		done( err );
	});

	rd.pipe( wr );

	const done = ( err ) => {
		if ( ! cbCalled ) {
			cb( err );
			cbCalled = true;
		}
	};
};

const createZip = ( zipName, source ) => {

	const output = fs.createWriteStream( `./build/${zipName}` );
	const archive = archiver( 'zip' );

	output.on( 'close', () => {
		console.info( `${archive.pointer()} total bytes` );
		console.info( `${zipName} file created.` );
	});

	archive.on( 'error', ( err ) => {
		throw err;
	});

	archive.pipe( output );
	archive.directory( source, false );
	archive.finalize();
};

const finalize = () => {
	rimraf.sync( './build/theme-sniffer/assets/dev' );
	// console.info( 'Development folder removed, creating a zip file.' );
	// createZip( 'theme-sniffer.zip', './build/theme-sniffer' );
	// rimraf.sync( './build/theme-sniffer/' );
	console.info( 'All done!' );
};

// Copy the plugin to build folder in a new folder, then delete stuff that is not needed in production
rimraf( './build', () => {
	console.info( 'Deleted build directory.' );
	mkdir( './build' );
	copyDir( './src', './build/theme-sniffer/' );
	finalize();
});

