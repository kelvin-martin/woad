'use strict';
const fs = require('fs');
const assert = require('assert');

// level definitions
module.exports.ERROR = 0;
module.exports.WARN = 1;
module.exports.INFO = 2;
module.exports.VERBOSE = 3;
module.exports.DEBUG = 4;
module.exports.TRACE = 5;

// level strings
const levels = [
	'ERROR   ', 'WARN    ', 'INFO    ', 
	'VERBOSE ', 'DEBUG   ', 'TRACE   '
];

// set of logging options
var log_options = [];

// global logging state
var log_state = true;

function default_handler(err) {
	if (err) console.log('Logging data ' + err);
}

// default options
const default_options = {
	'name': 'default-log',
	'file': 'log.txt',
	'encoding': 'utf8',
	'msg_length': 60,
	'format': 'DL',
	'level': module.exports.INFO,
	'log_state': true,
	'callback': default_handler
};

// Format a date string in the form: YY-MM-DD HH:MM:SS.
function format_date(date) {
	return date.toISOString()
		.replace(/T/, ' ')
		.replace(/\..+/, '') + ' ';	
}

// Format a time string in the form: HH:MM:SS.
function format_time(date) {
	return ('0' + date.getHours()).slice(-2) + ':' +
		('0' + date.getMinutes()).slice(-2) + ':' +
		('0' + date.getSeconds()).slice(-2) + '.' +
		('00' + date.getMilliseconds()).slice(-3) + ' ';
}

// Returns level option as a string i.e.'TRACE'.
function format_level(lvl) {
	return (levels[lvl]);
}

// Returns an index of the named logged file or -1 if not found
function get_index(name) {
	var result = -1;
	for (var index = 0; index < log_options.length; index++) {
		if (log_options[index].name !== undefined) {
			if (log_options[index].name === name) {
				result = index;
				break;
			}
		}
	}
	return result;
}

// Creates a sink for log messages.
// options is a set of configuration settings
module.exports.create = function(options) {
	var index = log_options.length;
	if (options !== undefined) {
		assert.equal(typeof (options), 'object',
			"argument 'options' must be an object.");
		log_options.push(Object.create(default_options));
		if (options.name !== undefined) {
			assert.equal(typeof (options.name), 'string',
			"argument 'name' must be a string.");
			if (get_index(options.name) > -1) {
				return null; // name already exists
			}
			log_options[index].name = options.name.toLowerCase();
		}		
		if (options.file !== undefined) {
			assert.equal(typeof (options.file), 'string',
			"argument 'file' must be a string.");
			log_options[index].file = options.file;
		}
		if (options.encoding !== undefined) {
			assert.equal(typeof (options.encoding), 'string',
			"argument 'encoding' must be a string.");
			log_options[index].encoding = options.encoding;
		}
		if (options.msg_length !== undefined) {
			assert.equal(typeof (options.msg_length), 'number',
			"argument 'msg_length' must be a number.");
			assert.equal(options.msg_length > 0, true,
			"argument 'msg_length' must be a positive number.");
			log_options[index].msg_length = options.msg_length;
		}
		if (options.format !== undefined) {
			assert.equal(typeof (options.format), 'string',
			"argument 'format' must be a string.");
			log_options[index].format = options.format;
		}	
		if (options.level !== undefined) {
			assert.equal(typeof (options.level), 'number',
			"argument 'level' must be a number.");
			log_options[index].level = options.level;
		}
		if (options.log_state !== undefined) {
			assert.equal(typeof (options.log_state), 'boolean',
			"argument 'log_state' must be a boolean.");
			log_options[index].log_state = options.log_state;
		}
		if (options.callback !== undefined) {
			assert.equal(typeof (options.callback), 'function',
			"argument 'callback' must be a function.");
			log_options[index].callback = options.callback;
		}
	}
	return log_options[index].name;
};

// Deletes a registered sink.
module.exports.delete = function(name) {
	if (name !== undefined) {
		assert.equal(typeof (name), 'string',
		"argument 'name' must be a string.");
		var index = get_index(name);
		if (index != -1) {
			delete log_options[index];
		}
	}
};

// Updates the current message level for a sink.
module.exports.setlevel = function(name, level) {
	if (name !== undefined) {
		assert.equal(typeof (name), 'string',
		"argument 'name' must be a string.");
		if (level !== undefined) {
			assert.equal(typeof (level), 'number',
			"argument 'level' must be a number.");
			var index = get_index(name);
			if (index != -1) {
				log_options[index].level = level;
			}
		}	
	}
};

// Sets the logging state of a sink or if name
// is ommited then sets the global logging state.
function set_logging_state(state, name) {
	if (name === undefined) {
		log_state = state;
	} else {
		assert.equal(typeof (name), 'string',
		"argument 'name' must be a string.");
		var index = get_index(name);
		if (index != -1) {
				log_options[index].log_state = state;
		}
	}
}

// Stops logging for a sink or for all 
// sinks if name is ommited.
module.exports.stop = function(name) {
	set_logging_state(false, name);
};

// Resumes logging for a sink or for all 
// sinks if name is ommited.
module.exports.resume = function(name) {
	set_logging_state(true, name);
};

// Logs a message to all registered sinks if the message
// level is less than or equal to the currently set sink level
module.exports.log = function(level, message) {
	if (log_state === false) return;
	assert.equal(typeof (level), 'number',
		"argument 'level' must be a valid number."); 
	var date = new Date();
	for (var index = 0; index < log_options.length; index++) {
		if (log_options[index] !== undefined) {
			var dstamp = '', tstamp = '', lvl = '';
			var options = log_options[index];
			if (options.log_state === true) {
				if (options.format.indexOf('D') > -1) {
					dstamp = format_date(date);
				}
				if (options.format.indexOf('T') > -1) {
					tstamp = format_time(date);
				}
				if (options.format.indexOf('L') > -1) {
					 lvl = format_level(level);
				}
				if (level <= options.level) {
					message = message.substring(0, options.msg_length);
					if (options.name === 'console') {
						console.log(dstamp + tstamp + lvl + message);
					} else {
						fs.appendFile(options.file, 
							dstamp + tstamp + lvl + message + '\n',
							options.encoding, options.callback);
					}	
				}
			}
		}
	}
};

// exported helper functions
module.exports.error = function(message) {
	this.log(this.ERROR, message);
};

module.exports.warn = function(message) {
	this.log(this.WARN, message);
};

module.exports.info = function(message) {
	this.log(this.INFO, message);
};

module.exports.verbose = function(message) {
	this.log(this.VERBOSE, message);
};

module.exports.debug = function(message) {
	this.log(this.DEBUG, message);
};

module.exports.trace = function(message) {
	this.log(this.TRACE, message);
};
