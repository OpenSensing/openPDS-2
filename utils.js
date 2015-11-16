var fs = require('fs');
var path = require('path');

exports.spawnPython = function (script_path, params, callback) {
    var spawn = require("child_process").spawn;
    var process = spawn('python',[script_path, params]);

    process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    process.on('exit', function(code) {
        console.log(script_path + " exited with code: " + code);
        if(callback != undefined) {
            callback(code);
        }
    })
};

exports.getFilesAfterDate = function (dir, date) {
    var files = fs.readdirSync(dir);

    return files.filter(function(file) {

        return fs.statSync(path.join(dir, file)).mtime.getTime() > date && file[0] != ".";
    })
};

