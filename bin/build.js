#!/usr/bin/env node

const fse = require( 'fs-extra' );
const path = require( 'path' );

const dir = '/build';


// Copy the plugin to build folder in a new folder, then delete stuff that is not needed in production

// With async/await:
async function example( directory ) {
	try {
		await fse.ensureDir( directory );
		console.log( 'build/ directory created!' );
	} catch ( err ) {
		console.error( err );
	}
}

example( dir );
