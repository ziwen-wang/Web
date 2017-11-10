var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
var opt = {
    title: '事项报告',
    ripName: 'nodejs测试',
    matterCenter: 'word导出功能测试',
    reportName: 'New Website',
    reportTime:'2017-01-01',
    reportTimeEnd:'2017-11-01',
    ReportExplanation:'今天是个好日子，今天是个好日子，今',
    imglength1:'../img/1.jpg'
}
var date = new Date()
var time = date.getFullYear().toString()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()
doc.setData(opt);

try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, opt.title+time+'.docx'), buf);