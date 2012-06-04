/*

	Generate kperf.min.js using Google Closure Compiler
	Execute with: node minify.js

*/

var compressor = require('node-minify');

new compressor.minify({
	type: 'gcc',
	fileIn: 'src/kperf.js',
	fileOut: 'src/kperf.min.js',
	options: [ 
		//'--create_source_map', 'war/js/' + filename.replace('.js', '.map'), 
		//'--debug',
		//'--compilation_level', 'ADVANCED_OPTIMIZATIONS'
		]
});