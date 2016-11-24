'use strict';
const fs = require('fs');
const iconv = require('iconv-lite');
var defaultInputCode = 'gbk';
var defaultOutputCode = 'utf8';

/**
 * 设置默认的编码格式
 * @param {Object} option {'org':'gbk','dest':'utf8'}
 */
function setDefaultCoding(option) {
    if('org' in option){
        defaultInputCode = option.in;
    }
    if('dest' in option){
        defaultOutputCode = option.out;
    }
}

function changeFile(filePath, orgCode, destCode, callback) {
    orgCode = orgCode || defaultInputCode;
    destCode = destCode || defaultOutputCode;
}

function changeFileSync(filePath, orgCode, destCode) {
    orgCode = orgCode || defaultInputCode;
    destCode = destCode || defaultOutputCode;

    var buffer = Buffer.from(fs.readFileSync(filePath, {
        encoding: 'binary'
    }), 'binary');   //得到文件内容对应的Buffer
    var text = iconv.decode(buffer, orgCode); //使用原始编码格式解码
    fs.writeFileSync(filePath, iconv.encode(text, destCode), 'binary'); //按照新格式编码,再按二进制方式写入
}

function getStr(str, orgCode){
    return changeStr(str, orgCode, 'utf8');
}

function changeStr(str, orgCode, destCode) {
    var iconv = require('iconv-lite');
    str = iconv.decode(Buffer.from(str), orgCode);
    return iconv.encode("Sample input string", destCode);
}

exports.getStr = getStr;
exports.changeStr = changeStr;
exports.changeFile = changeFile;
exports.changeFileSync = changeFileSync;
exports.setDefaultCoding = setDefaultCoding;