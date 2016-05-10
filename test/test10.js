// Test suite for woad.
// Run from 'test' subfolder
'use strict';
const lg = require('../woad.js');
const test = require('unit.js');
const fs = require('fs');

function testFunc() {
	console.log('test10 started - testing duplicate name.');
	const fname1 = './test10f1.txt';
	const fname2 = './test10f2.txt';
	const tname = 'test10';
	const message = 'A logging message.';

	var f1 = lg.create({'name': tname, 'file': fname1 });
	var f2 = lg.create({'name': tname, 'file': fname2 });

	// test we have the the first log file name from 'create'
	test
		.string(f1).is(tname);

  // test the 2nd name is null
	test
		.value(f2).isNull();

	lg.setlevel(f1, lg.TRACE);

	lg.error(message);
	lg.warn(message);
	lg.info(message);
	lg.verbose(message);
	lg.debug(message);
	lg.trace(message);

  // test log file does not exists
	fs.access(fname2, function(err) {
		if (!err) {
			test.fail('log file [' + fname2 + '] does exist.');
		}
	});

	// test log file exists
	fs.access(fname1, function(err) {
		if (err) {
			test.fail('log file [' + fname1 + '] does not exist.');
		}

		// test contents of log file
		fs.readFile(fname1, (err, data) => {
	  	if (err) {
	  		test.fail('log file [' + fname1 + '] reading contents.')
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
