var fs = require('fs');
var path = require('path');

var deleteQueue = [];

/**读取文件夹内容 */
function readDir(dirPath, onComp) {
    var callback = onComp ? onComp : function (err, files) {
        if (err) {
            console.error(err);
        } else {
            console.log(files);
            console.log("文件夹读取成功!");
        }
    };
    fs.readdir(dirPath, callback);
}
/**同步读取文件内容 */
function readDirSync(dirPath) {
    var files = fs.readdirSync(dirPath);
    if(files.length <= 0){
        console.warn(dirPath+" 中没有文件！");
    }else{
        console.log(files);
    }
    return files;
}



/**创建新文件夹若存在则创建失败 */
function createDir(dirPath) {
    fs.mkdir(dirPath, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("文件夹创建成功!");
        }
    });
}
/**同步创建新文件夹若存在则创建失败 */
function createDirSync(dirPath) {
    fs.mkdirSync(dirPath);
    console.log("创建成功！");
}




/**删除空文件夹若不为空则失败 */
function deleteEmptyDir(dirPath,onComp) {
    var callback = onComp ? onComp : function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("文件夹删除成功!");
        }
    };
    fs.rmdir(dirPath,callback);
}

/**同步删除空文件夹若不为空则失败 */
function deleteEmptyDirSync(dirPath,onComp) {
    fs.rmdirSync(dirPath);
    onComp && onComp();
    // console.log("文件夹删除成功！");
}


/**同步删除队列中的文件夹 */
function deleteDirQueue() {
    var len = deleteQueue.length;
    for(var i = 0; i < len;i++){
        deleteEmptyDirSync(deleteQueue[i]);
    }
}

/** 同步删除文件夹及其中的文件 */
function deleteDirAndFileSync(dirPath,deleteSelf = false) {
    var files = readDirSync(dirPath);
    var len = files.length;
    for(var i = 0;i < len;i++){
        var file = files[i];
        let filePath = path.resolve(dirPath, file);//单个文件绝对路径
        var state = fs.statSync(filePath);//单个文件的状态
        if(state.isDirectory()){//如果是文件夹
            deleteDirAndFileSync(filePath,true);
        }else{//否则是文件,直接删除
            deleteFileSync(filePath);
        }
    }
    deleteSelf && deleteQueue.push(dirPath);
}


/**读取文件 */
function readFile(filePath) {
    return fs.readFile(filePath, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("文件读取成功!");
        }
    });
}

/**写入文件若文件不存在则创建文件并写入 */
function writeFile(filePath, fileData) {
    fs.writeFile(filePath, fileData, function (err) {
        if (err) {
            console.error(err);
        } else {
            // console.log("文件写入成功!");
        }
    });
}

/**删除文件 */
function deleteFile(filePath) {
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("文件删除成功!");
        }
    });
}
/**同步删除文件 */
function deleteFileSync(filePath) {
    fs.unlinkSync(filePath);
    console.log(filePath + " 删除成功！");
}





module.exports = {
    readDir,
    readDirSync,

    createDir,
    createDirSync,

    deleteEmptyDir,
    deleteEmptyDirSync,

    readFile,
    
    writeFile,

    deleteFile,
    deleteFileSync,

    deleteDirAndFileSync,

    deleteDirQueue,

    deleteQueue
}