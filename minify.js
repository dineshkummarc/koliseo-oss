/*

	Generate kperf.min.js using Google Closure Compiler
	Execute with: node minify.js

*/

var compressor = require('node-minify');

new compressor.minify({
	type: 'yui',
	fileIn: 'src/kperf.css',
	fileOut: 'src/kperf.min.css'
});

new compressor.minify({
	type: 'gcc',
	fileIn: 'src/kperf.js',
	fileOut: 'src/kperf.min.js'
});