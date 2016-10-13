'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var triggers = require('../data/triggers')

var MarvBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'marvbot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'marvbot.db');

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(MarvBot, Bot);

MarvBot.prototype.run = function () {
    MarvBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

MarvBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
};

MarvBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

MarvBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

MarvBot.prototype._firstRunCheck = function () {
    var self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var currentTime = (new Date()).toJSON();

        // this is a first run
        if (!record) {
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        // updates with new last running time
        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

MarvBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, "You can tell that I am a personality type, can't you?" +
        '\n If you want me to do anything or to entertain you (hur hur hur...), just say `Marvbot` or `' + this.name + '` to invoke me!',
        {as_user: true});
};

MarvBot.prototype._onMessage = function (message) {
    var self = this;
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromMarvBot(message) &&
        this._isMentioningMarvBot(message)
    ) {
        let thingSaid = message.text.toLowerCase()
        for (var i = 0; i < triggers.length; i++) {
          let trigger = triggers[i]
          let triggerKey = Object.keys(triggers[i])[0]
          if (thingSaid.indexOf(triggerKey)> -1) {
            let reply = trigger[triggerKey]
            this._replyWithMessage(message, reply)
          }
        }
        if (thingSaid.indexOf("i would like to thank") > -1 ) {
          let startPos = message.text.indexOf("<@") + 2
          let endPos = message.text.indexOf(">")
          let personToThankCode = message.text.substring(startPos, endPos)
          let personToThank = null
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === personToThankCode) {
              personToThank = this.users[i].real_name
            }
          }
          let searchTerm = 'SELECT val FROM stars WHERE name = "' + personToThank + '" LIMIT 1'
          self.db.get(searchTerm, function (err, record) {
              if (err) {
                  return console.error('DATABASE ERROR:', err);
              }

              // this creates the record if person is not in database yet
              if (!record) {
                  self.db.run('INSERT INTO stars(name, val) VALUES( "' + personToThank + '" , 1)')
              } else{
                  self.db.run('UPDATE stars SET val = val + 1 WHERE name = "' + personToThank + '"');
              }
              var numStars = self.db.get(searchTerm, function(err, record) {
                // return record.val
                let starsReply = "You have given " + personToThank + " one more star. " + personToThank + " now has " + record.val + " stars"
                self._replyWithMessage(message, starsReply)
              })
          });
        }


    }
};

MarvBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

MarvBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

MarvBot.prototype._isFromMarvBot = function (message) {
    return message.user === this.user.id;
};

MarvBot.prototype._isMentioningMarvBot = function (message) {
    return message.text.toLowerCase().indexOf('marvbot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

MarvBot.prototype._replyWithMessage = function (originalMessage, reply) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, reply);

}

MarvBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = MarvBot;
