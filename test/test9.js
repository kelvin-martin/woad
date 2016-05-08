// Test suite for woad.
// Run from 'test' subfolder
'use strict';
const lg = require('../woad.js');
const test = require('unit.js');
const fs = require('fs');

function testFunc() {
	console.log('test9 started - testing logging from a timmer function.')
	const fname = './test9.txt';
	const tname = 'test9';
	const message = 'Loging message.';

	var f1 = lg.create({'name': tname, 'file': fname, 'format': 'TL'});

	// test we have the log file name from 'create'
	test
		.string(f1).is(tname);

	lg.setlevel(f1, lg.TRACE);

	var count = 0;
	var timer = setInterval(function(){
  		lg.error(message);
  		count++
  		if (count >= 100) {
  			clearInterval(timer);

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
			  			.string(m1).contains(':')
			  			.string(m1).contains(message);
				});
			});
  		}
	}, 100 );

}

testFunc();
