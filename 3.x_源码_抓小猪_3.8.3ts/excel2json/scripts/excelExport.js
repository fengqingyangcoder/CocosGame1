let path = require('path');
let xlsx = require('node-xlsx');
let fm = require('./fileManager');
let config = require('../config.json');

function exportXlsxToJson(sheetPath, name) {
    console.log('excelToJson')
    if (name.indexOf('meta') != -1) return;
    if (name.indexOf('~') != -1) return;
    let fullPath = path.resolve(sheetPath, name);
    let fileName = name.split('.')[0];
    let sheets = xlsx.parse(fullPath);
    if (!sheets) {
        console.error("表" + name + "不存在！可能是路径错误！");
    }
    let sheetObj = {};
    let sheetLen = sheets.length;
    console.log("准备解析表格：" + name);
    for (let i = 0; i < sheetLen; i++) {
        let sheetInfo = sheets[i];
        if (sheetInfo) {
            let sheetName = sheetInfo.name;
            let sheetData = sheetInfo.data;
            if (!sheetName) {
                console.error(fullPath + "中表名不存在！");
                return;
            }
            if (!sheetData) {
                console.error(fullPath + "中表数据不存在！");
                return;
            }
            if (sheetData && sheetData.length <= 0) {
                console.error(fullPath + "中表为空！");
                return;
            }
            let startIdx = 4;
            console.log("开始解析表：" + sheetName + " 共" + (sheetData.length - startIdx) + "条数据...");
            sheetObj[sheetName] = [];
            let propName = [];
            let types = sheetData[2]
            for (let j = 0; j < sheetData.length; j++) {
                let data = sheetData[j];
                if (data) {
                    if (j == 1) {
                        //读取key
                        for (let k = 0; k < data.length; k++) {
                            propName.push(data[k]);
                        }
                    } else if (j >= startIdx && data.length > 0) {
                        let o = {};
                        //读取值
                        for (let m = 0; m < data.length; m++) {
                            let value = data[m];
                            let type = types[m];
                            value = typeConvert(value, type)
                            o[propName[m]] = value;
                        }
                        sheetObj[sheetName].push(o);
                    }
                }
            }
        } else {
            console.error("表解析错误！");
        }
    }
    let str = JSON.stringify(sheetObj);
    fm.writeFile(path.resolve(config.exportPath, fileName + ".json"), str);
    console.log("表格" + name + "解析完毕！\n");
}

function exportXlsxToTs(sheetPath, name) {
    console.log('excelToTs')
    if (name.indexOf('meta') != -1) return;
    if (name.indexOf('~') != -1) return;
    let fullPath = path.resolve(sheetPath, name);
    let fileName = name.split('.')[0];
    let sheets = xlsx.parse(fullPath);
    if (!sheets) {
        console.error("表" + name + "不存在！可能是路径错误！");
    }
    let sheetLen = sheets.length;
    console.log("准备解析表格：" + name);

    let str = '';

    for (let i = 0; i < sheetLen; i++) {
        let sheetInfo = sheets[i];
        if (sheetInfo) {
            let sheetName = sheetInfo.name;
            let sheetData = sheetInfo.data;
            if (!sheetName) {
                console.error(fullPath + "中表名不存在！");
                return;
            }
            if (!sheetData) {
                console.error(fullPath + "中表数据不存在！");
                return;
            }
            if (sheetData && sheetData.length <= 0) {
                console.error(fullPath + "中表为空！");
                return;
            }
            let startIdx = 4;
            console.log("开始解析表：" + sheetName + " 共" + (sheetData.length - startIdx) + "条数据...");

            str += `export const Cfg${sheetName} = [\n`

            let propName = [];
            let types = sheetData[2]
            for (let j = 0; j < sheetData.length; j++) {
                let data = sheetData[j];
                if (data) {
                    if (j == 1) {
                        //读取key
                        for (let k = 0; k < data.length; k++) {
                            propName.push(data[k]);
                        }
                    } else if (j >= startIdx && data.length > 0) {
                        //读取值
                        str += '\t{\n'
                        for (let m = 0; m < data.length; m++) {
                            let value = data[m];
                            let type = types[m];
                            value = typeConvert(value, type)
                            str += '\t\t'
                            str += `${propName[m]}: ${value},\n`
                        }
                        str += '\t},\n'
                    }
                }
            }

            str += ']\n'

        } else {
            console.error("表解析错误！");
        }
    }
    fm.writeFile(path.resolve(config.exportTsPath, "cfg_" + fileName + ".ts"), str);
    console.log("表格" + name + "解析完毕！\n");
}
function typeConvert(value, type) {
    switch (type) {
        case "string":
            return `"${value}"`
        case "int":
            return parseInt(value)
        case "float":
            return parseFloat(value)
        case "bool":
            return parseInt(value)
        case "string_array":
        case "array":
            return value ? value.split(",") : []
        case "number_array":
            if (typeof value == "number") return [value]
            return value ? value.split(",").map(Number) : []
        default:
            return value
    }
}

module.exports = {
    exportXlsxToJson,exportXlsxToTs
}