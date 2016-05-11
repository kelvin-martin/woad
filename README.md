# woad
Yet another **[Node.js](https://nodejs.org/en/)** logger.

This is a work in progress, no stable release is yet available.
### Installation
Install from **[GitHub](http://github.com)** by downloading the zip file and '*extract all*' into a folder.

Alternatively clone straight from github using command:
```
git clone https://github.com/kelvin-martin/woad.git
```
This will install all the source files from github and setup a local git repository.
### Usage
Note: the module must be installed before use.
```javascript
const lg = require('woad.js');

lg.create({'file': 'logger.txt'});

lg.info('Hello World.');
```
### API
To use the logger in your code include the woad module with:
```javascript
const lg = require('woad.js');
```
woads's level definitions loosely follow the npm error levels.
```javascript
ERROR = 0;
WARN = 1;
INFO = 2;
VERBOSE = 3;
DEBUG = 4;
TRACE = 5;
```
### Functions
```javascript
create(options)
```
This creates a sink that the logger uses to record messages. The object passed into __*create()*__ contains all the configuration options for that sink. See 'Configuration object' below for a description of the  options. __*create()*__ returns a string representing the name of the sink registered or __*null*__ if the name already exists. The returned name can be used in calls to __*delete()*__, __*setlevel()*__, __*stop()*__ and __*resume()*__.
```javascript
delete(name)
```
Deletes a registered sink from the logger. __*name*__ is the string returned from __*create()*__.
```javascript
setlevel(name, level)
```
Sets the logging level for the named sink. **name** is the string returned from __*create()*__. __*level*__ is one of woads level definitions.
```javascript
stop(name)
```
Stops logging on the named sink. If no name passed then all logging is stopped. __*name*__ is the string returned from __*create()*__.
```javascript
resume(name)
```
Resumes logging on the named sink. If no name passed then all logging is stopped. __*name*__ is the string returned from __*create()*__.
```javascript
log(level, message)
```
Logs a message to all registered sinks if the message level is less than or equal to the currently set sink level. __*message*__ is a string or node buffer. __*level*__ is one of woads level definitions.
```javascript
error(message)
warn(message)
info(message)
verbose(message)
debug(message)
trace(message)
```
The above are helper functions which can be used as an alternative to __*log()*__ without passing in the level for the message. __*message*__ is a string or node buffer.
### Configuration object
The configuration options for a sink can be defined by following options object:
```javascript
// default configuration options
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
```
A configuration object which contains zero or more of the specified fields is required to register a sink with a call to __*create()*__. If an empty object is passed then all default settings are used. If any of the fields are omitted then the default settings for that field are used.
```
'name'         Name (string) used to denote the configured sink. This
               name is returned by create(). If name is 'Console' 
               (case-insensitive) then the file option is ignored and
               all logging is output to Node's console.
'file'         Path (string) of the file that is used for the sink.
'encoding'     The encoding (string) used for saving the message to the
               sink. Valid encodings are Node's encoder string.
               e.g. 'ascii', 'utf8', 'hex'  etc.
'msg_length'   The length (number) of the message recorded. Messages
               longer than 'msg_length' are truncated. The date, time
               and level are not taken into account only the message.
'format'       A format (string) that specifies what information is
               recorded along wth the message. The complete format
               string is 'DTL' which means 'D=date T=time L=level'.
'level'        The level (number) to use to filter messages recorded to
               that sink. level is one of woads level definitions.
               The level for the sink can be changed using setlevel()
'log_state'    The state (boolean) of the logging for that sink. 
               This state can be set to on (true) or off (false) using
               stop() or resume().
'callback'     A callback (function) which is called when a message is
               written to the sink. The callback will take a standard
               node error object which will be null if successful or
               error details if an error occured during the write.
```
### License
woad is freely distributable under the terms of the MIT license.