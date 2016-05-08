// Test suite for woad.
// Run from 'test' subfolder
'use strict';
const lg = require('../woad.js');
const test = require('unit.js');
const fs = require('fs');

function testFunc() {
	console.log('test6 started - testing of use of message format')
	const fname = './test6.txt';
	const tname = 'test6';
	const message = 'Loging another short text message.';

	var f1 = lg.create({'name': tname, 'file': fname, 'format': ''});

	// test we have the log file name from 'create'
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
  			.string(m1).notContains('ERROR')
  			.string(m1).notContains('WARN')
  			.string(m1).notContains('INFO')
  			.string(m1).notContains('VERBOSE')
  			.string(m1).notContains('DEBUG')
  			.string(m1).notContains('TRACE')
  			.string(m1).notContains('-')
  			.string(m1).notContains(':')
  			.string(m1).contains(message);
		});
	});
}

testFunc();
