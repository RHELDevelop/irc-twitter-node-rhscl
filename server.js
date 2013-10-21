var irc = require('irc'), util = require('util'),
    twitter = require('twitter');
var my_bot_name= 'ircbot-' + process.pid;
var bot = new irc.Client('chat.freenode.net', my_bot_name, {
    channels: ['#tweetme'],
    debug: true
    });
console.log("You can talk to me on #tweetme, my name is " + my_bot_name);

bot.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
});

/*
//note, we can't initialize twitter yet because we need to get these from the user    
var twit = new twitter({
    consumer_key: 'STATE YOUR NAME',
    consumer_secret: 'STATE YOUR NAME',
    access_token_key: 'STATE YOUR NAME',
    access_token_secret: 'STATE YOUR NAME'
});
*/