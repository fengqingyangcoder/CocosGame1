var et = require('./excelExport');
var fm = require('./fileManager');
var config = require('../config.json');

fm.readDir(config.sheetPath,function(err,files){
    files.forEach((file) => {
        et.exportXlsx(config.sheetPath, file);
    });
});


