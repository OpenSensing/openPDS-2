var fs = require('fs-extra');
var hogan = require('hogan.js');
var sqlite = require('sqlite3');
var config = require('./config.js');
var path = require('path');
var utils = require('./utils.js');


function submitDataSourceForm() {

    var configPath = document.getElementById('testPath');

    installDataSource(configPath.value);
    $('#newDataSourceForm').submit();
}

function installDataSource(manifestPath) {
    var db = process.mainModule.exports.db;

    var manifestJSON = fs.readFileSync(manifestPath, 'utf-8');
    var manifest = JSON.parse(manifestJSON);

    db.dataSources.find({name: manifest.name}, function (err, results) {
        if (err != null) {
            console.log(err);
        }

        if (results.length > 0) {
            console.log("Data source already exists");
            $('ul.tabs').tabs('select_tab', 'dataSources');
            return;
        } else {
            var localDataSourcePath = path.join(config.dataPath, 'dataSources', manifest.name);

            fs.mkdirsSync(localDataSourcePath);
            fs.copySync(path.join(path.dirname(manifestPath), manifest.parserPath), path.join(localDataSourcePath, manifest.parserPath));

            manifest.dataTypes.forEach(function (dataType) {
                var db_root_path = localDataSourcePath;
                console.log(db_root_path);
                var cache_db_name = manifest.name + "_" + dataType.name + ".db";
                createDataTypeDB(path.join(db_root_path, cache_db_name), dataType.name, dataType.schema);
                dataType.cache_db_name = cache_db_name;
                dataType.dataSource = manifest.name;
                dataType.name = manifest.name + "." + dataType.name;
                db.dataTypes.insert(dataType);
            });

            manifest.dropboxFileLocation = path.join(config.dropboxRoot, manifest.dropboxFileLocation);
            db.dataSources.insert(manifest, function (err, newDoc) {
                if (err) {
                    console.log(err.toString());
                }
                getAllDataSources();
                $('ul.tabs').tabs('select_tab', 'dataSources');
            });


        }
    });

}

function createDataTypeDB(db_name, table_name, schema) {
    var db = new sqlite.Database(db_name);
    db.serialize(function () {
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
    process.mainModule.exports.db.dataSources.find({}, function (err, results) {
        var template = $('#dataSourcesList').html();
        var html = hogan.compile(template).render({dataSources: results});
        $('#dataSourcesContainer').html(html);
        $('.collapsible').collapsible();
    });
}

function processRawDataSourceByName(dataSourceName) {
    process.mainModule.exports.db.dataSources.findOne({name: dataSourceName}, function(err, doc) {
        if (doc != null) {
            processRawDataSource(doc);
        }
    })
}

function processRawDataSource(dataSource) {
    var lastProcessingDate = dataSource.lastProcessingDate;
    if (!lastProcessingDate) {
        lastProcessingDate = new Date(0);
    }

    var filesToProcess = utils.getFilesAfterDate(dataSource.dropboxFileLocation, lastProcessingDate);

    if (filesToProcess.length === 0) {
        return;
    }

    var dataTypeDBs = [];

    dataSource.dataTypes.forEach(function (dataType) {
        dataTypeDBs.push(dataType.cache_db_name);
    });

    lastProcessingDate = new Date();

    utils.spawnPython(path.join(config.dataPath, 'dataSources', dataSource.name, dataSource.parserPath), JSON.stringify({
        files: filesToProcess,
        dbs: dataTypeDBs,
        files_root: dataSource.dropboxFileLocation,
        dbs_root: path.join(config.dataPath, 'dataSources', dataSource.name)
    }), function (code) {
        if (code.toString() == '0') {
            process.mainModule.exports.db.dataSources.update({_id: dataSource._id}, {$set: {lastProcessingDate: lastProcessingDate}}, {});
        }
    });
}