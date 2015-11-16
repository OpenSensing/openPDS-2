var path = require('path');

var config = {
    dropboxRoot: path.join(getUserHome(), 'Dropbox', 'Apps'),
    dataPath: getApplicationPath()
};

function getApplicationPath() {
    var myName = 'openPDS';
    var paths = {
        win32: function() { return path.join(process.env['LOCALAPPDATA'], myName)},
        linux: path.join(getUserHome(), '.config', myName),
        darwin: path.join(getUserHome(), 'Library', 'Application Support', myName)
    };

    return paths[process.platform];
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = config;