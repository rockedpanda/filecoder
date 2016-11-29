'use strict';
const fs = require('fs');
const iconv = require('iconv-lite');
var defaultInputCode = 'gbk';
var defaultOutputCode = 'utf8';

/** 实现对fs常用属性扩展的类 */
function CoderFs(defaultCode){
    this.defaultCode = defaultCode || 'utf8';
}
CoderFs.prototype.readFile = function(file,options,callback) {
    if(arguments.length === 2){
        callback = options;
        options = this.defaultCode;
    } else if(arguments.length === 3){
        if(options instanceof Object && !(options instanceof String) && !('encoding' in options)){
            options.encoding = this.defaultCode;
        }
    }
    fs.readFile(file, options, callback);
};
CoderFs.prototype.readFileSync = function(file,options) {
    if(options instanceof Object && !(options instanceof String) && !('encoding' in options)){
        options.encoding = this.defaultCode;
    }
    return fs.readFileSync(file, options);
};
CoderFs.prototype.decodeStream = function(orgCode){
    return iconv.decodeStream(orgCode);
};
CoderFs.prototype.createReadStream = function(path, options, targetCode) {
    targetCode = targetCode || 'utf8';
    let code = this.defaultCode;
    if(options === undefined){
        code = this.defaultCode;
        options = undefined;
    } else if(typeof options ==='string' || options instanceof String){
        code = options;
        options = undefined;
    }
    else if('encoding' in options){
        code = options.encoding;
        options.encoding = null;
    }
    console.log(options);
    return fs.createReadStream(path, options)
        .pipe(iconv.decodeStream(code))
        .pipe(iconv.encodeStream(targetCode));
};
CoderFs.prototype.createWriteStream = function(path, options, sourceCode) {
    sourceCode = sourceCode || 'utf8';
    let code = this.defaultCode;
     if(options === undefined){
        code = this.defaultCode;
        options = undefined;
    } else if(typeof options ==='string' || options instanceof String){
        code = options;
        options = undefined;
    }
    else if('encoding' in options){
        code = options.encoding;
        options.encoding = null;
    }
    let fsStream = fs.createWriteStream(path, options);
    return iconv.decodeStream(sourceCode).pipe(iconv.encodeStream(code)).pipe(fsStream);
};

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
    console.log('---------------------------------1');
    console.log(buffer);
    var text = iconv.decode(buffer, orgCode); //使用原始编码格式解码
    console.log(text);
    console.log('---------------------------------2');
    fs.writeFileSync(filePath, iconv.encode(text, destCode), 'binary'); //按照新格式编码,再按二进制方式写入
}

function getStr(str, orgCode){
    return changeStr(str, orgCode, 'utf8');
}

function changeStr(str, orgCode, destCode) {
    var iconv = require('iconv-lite');
    str = iconv.decode(Buffer.from(str), orgCode);
    return iconv.encode(str, destCode).toString();
}

function getFs(code){
    return new CoderFs(code||'utf8');
}

exports.getStr = getStr;
exports.changeStr = changeStr;
exports.changeFile = changeFile;
exports.changeFileSync = changeFileSync;
exports.setDefaultCoding = setDefaultCoding;
exports.getFs = getFs;