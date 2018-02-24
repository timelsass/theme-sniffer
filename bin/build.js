#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );

// Helper methods
const mkdir = (dir) => {
	// making directory without exception if exists
	try {
		// fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
	}
};


const copyDir = (src, dest) => {
	mkdir(dest);
	const files = fs.readdirSync(src);
	for(let i = 0; i < files.length; i++) {
		const current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			const symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};

const copy = (src, dest) => {
	const oldFile = fs.createReadStream(src);
	const newFile = fs.createWriteStream(dest);
	util.pump(oldFile, newFile);
};


// Copy the plugin to build folder in a new folder, then delete stuff that is not needed in production

mkdir('./build');
