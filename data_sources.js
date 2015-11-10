var fs = require('fs');;
var db = require('./db.js');
var hogan = require('hogan');

function submitDataSourceForm() {

    var configPath = document.getElementById('testPath');
    console.log(configPath.value);

    installDataSource(configPath.value);
    $('#newDataSourceForm').submit();
}

function installDataSource(manifestPath) {

    var manifestJSON = fs.readFileSync(manifestPath, 'utf-8');
    var manifest = JSON.parse(manifestJSON);

    var dataSource = new db.models.DataSource();

    dataSource.name = manifest.name;
    dataSource.parserPath = manifest.parserPath;
    dataSource.dropboxFileLocation = manifest.dropboxFileLocation;

    console.log(dataSource.name);

    db.session.add(dataSource);
    db.session.flush();

    console.log(db.models.DataSource.all().forEach(function(data_source) {
        console.log(data_source.name);
    }))

}

function getAllDataSources() {
    db.models.DataSource.all(db.session).list(null, function(results) {
        var template = $('#dataSourcesList').html();
        var html = hogan.compile(template).render({dataSources: results});
        $('#dataSourcesContainer').html(html);
    });
}