// Test suite for woad.
// Run from 'test' subfolder
'use strict';
const lg = require('../woad.js');
const test = require('unit.js');
const fs = require('fs');

function testFunc() {
	console.log('test11 started - testing logging to Console.')
	const fname = './test11.txt';
	const message = 'Log message';

	var f1 = lg.create({'name': 'console'});

	// test we have the default log file name from 'create'
	test
		.string(f1).is('console');

	lg.setlevel(f1, lg.TRACE);
	lg.error(message);
	lg.warn(message);
	lg.info(message);
	lg.verbose(message);
	lg.debug(message);
	lg.trace(message);
}

testFunc();
