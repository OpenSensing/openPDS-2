var fs = require('fs');
var hogan = require('hogan');
var sqlite = require('sqlite3');

function submitDataSourceForm() {

    var configPath = document.getElementById('testPath');

    installDataSource(configPath.value);
    $('#newDataSourceForm').submit();
}

function installDataSource(manifestPath) {

    var manifestJSON = fs.readFileSync(manifestPath, 'utf-8');
    var manifest = JSON.parse(manifestJSON);

    manifest.dataTypes.forEach(function(dataType) {
        var cache_db_name = manifest.name + "_" + dataType.name + ".db";
        createDataTypeDB(cache_db_name, dataType.name,  dataType.schema);
        dataType.cache_db_name = cache_db_name;
    });

    process.mainModule.exports.db.insert(manifest, function(err, newDoc) {

    });
}

function createDataTypeDB(db_name, table_name, schema) {
    var db = new sqlite.Database(db_name);
    db.serialize(function() {
        var createDataTypeTableStatement = "CREATE TABLE IF NOT EXISTS " + table_name + " (" + createSQLStringFromSchema(schema) + ")";
        console.log(createDataTypeTableStatement);
        db.run(createDataTypeTableStatement)
    });

    db.close()
}

function createSQLStringFromSchema(schema) {
    var columnTypes = [];

    for (property in schema) {
        columnTypes.push(property + " " + schema[property])
    }

    console.log(columnTypes.join());
    return columnTypes.join()
}

function getAllDataSources() {
    process.mainModule.exports.db.find({}, function (err, results) {
        var template = $('#dataSourcesList').html();
        var html = hogan.compile(template).render({dataSources: results});
        $('#dataSourcesContainer').html(html);
    });
}