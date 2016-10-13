'use strict';

var MarvBot = require('../lib/marvbot');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var marvbot = new MarvBot({
    token: token,
    dbPath: dbPath,
    name: name
});

marvbot.run();
