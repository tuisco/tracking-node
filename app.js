#!/usr/bin/env node

"use strict";

// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
process.setMaxListeners(0);

module.exports = require('./lib/server');
