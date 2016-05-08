// Test suite for woad.
// Run from 'test' subfolder
'use strict';
const lg = require('../woad.js');
const test = require('unit.js');
const fs = require('fs');

function testFunc() {
	console.log('test3 started - testing of named log usage')
	const fname = './test3.txt';
	const tname = 'test3';
	const message = 'Loging text message.';

	var f1 = lg.create({'name': tname, 'file': fname});

	// test we have the default log file name from 'create'
	test
		.string(f1).is(tname);

	lg.setlevel(f1, lg.TRACE);
	lg.error(message);
	lg.warn(message);
	lg.info(message);
	lg.verbose(message);
	lg.debug(message);
	lg.trace(message);
	
	// test log file exists
	fs.access(fname, function(err) {
		if (err) {
			test.fail('log file [' + fname + '] does not exist.')
		}

		// test contents of log file
		fs.readFile(fname, (err, data) => {
  		if (err) {
  			test.fail('log file [' + fname + '] reading contents.')
  		}
  		var m1 = data.toString();
  		console.log(m1);
  		test
  			.string(m1).contains('ERROR')
  			.string(m1).contains('WARN')
  			.string(m1).contains('INFO')
  			.string(m1).contains('VERBOSE')
  			.string(m1).contains('DEBUG')
  			.string(m1).contains('TRACE')
  			.string(m1).contains('-')
  			.string(m1).contains(':')
  			.string(m1).contains(message);
		});
	});
}

testFunc();
