'use strict';
var fs = require('fs');
var coder = require('../index.js');

console.log(coder.changeStr('中文UTF8测试','utf8','gbk'));
var cfs = coder.getFs('gbk');
cfs.createReadStream('gbk.txt').pipe(process.stdout);
cfs.createReadStream('gbk.txt').pipe(fs.createWriteStream('uu.txt','utf8'));

fs.createReadStream('utf.txt','utf8').pipe(cfs.createWriteStream('gg.txt','gbk'));
fs.createReadStream('utf.txt','utf8').pipe(process.stdout);