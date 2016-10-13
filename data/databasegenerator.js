var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var outputFile = process.argv[2] || path.resolve(__dirname, 'marvbot.db');
var db = new sqlite3.Database(outputFile);

 db.run('CREATE TABLE IF NOT EXISTS info (name TEXT PRIMARY KEY, val TEXT DEFAULT NULL)');

 db.run('CREATE TABLE IF NOT EXISTS stars (name TEXT PRIMARY KEY, val INTEGER DEFAULT NULL)');
