var path = './';
var fs = require('fs');

fs.watch(path, function () {
    if (location)
        location.reload();
});

var persistence = require("persistencejs");
//var persistenceStore = require("persistencejs/lib/persistence.store.sqlite3");
var persistenceStore = persistence.StoreConfig.init(persistence, { adaptor: 'sqlite3' });

persistenceStore.config(persistence, 'openPDS.db');

var session = persistenceStore.getSession();

var DataSource = persistence.define('DataSource', {
    name: "TEXT",
    parserPath: "TEXT",
    dropboxFileLocation: "TEXT"
});

var DataType = persistence.define("DataType", {
    name: "TEXT"
});

DataSource.hasMany('dataTypes', DataType, "dataSource");

session.schemaSync();
