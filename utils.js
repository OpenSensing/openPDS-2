var fs = require('fs');

exports.spawnPython = function (script_path, params) {
    var spawn = require("child_process").spawn;
    var process = spawn('python',[script_path, params]);

    process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
};

exports.getFilesAfterDate = function (dir, date) {
    var files = fs.readdirSync(dir);

    return files.filter(function(file) {

        return fs.statSync(dir + file).mtime.getTime() > date && file[0] != ".";
    })
};

