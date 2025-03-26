var path = require('path');
var fm = require('./fileManager');
var config = require('../config.json');

fm.deleteDirAndFileSync(path.resolve(config.exportPath));
fm.deleteDirQueue();