var irc = require('irc'), util = require('util'),
    Twit = require('twit');
var secrets = require('./twitter-secrets');
var preferred_channel = "#tweetme";

var commands = {
	search: function(tweeter, bot, to, string_to_search) {
		tweeter.get('search/tweets', { q: string_to_search, count: 10 }, function(err, reply) {
			bot.say(to, "Twitter search with '" + string_to_search + "'' returned:");
			var status, statuses = reply.statuses, len = statuses.length;
			for (var i =0; i < len; i++) {
				status = statuses[i];
				bot.say(to, status.user.screen_name + ": " + status.text);
			};
		});
	},
	followers: function(tweeter, bot, to, twitter_id) {
		tweeter.get('followers/list', { screen_name: twitter_id, count: 10 },  function (err, reply) {
			bot.say(to, "The user " + twitter_id + " has these followers:");
			if (reply && reply.users) {
				var follower, followers = reply.users, len = followers.length;
				for (var i =0; i < len; i++) {
					follower = followers[i];
					bot.say(to, follower.screen_name + ": " + follower.description + " (" + follower.location + ")");
				};
			}
		});
	},
	help: function(bot, to, message) {
		bot.say(to, message);
		bot.say(to, "Try using 'followers: ' or 'search: '");
	}
};

/*
for testing
console.log(secrets);
var tweeter = new Twit(secrets);
var bot = { say: function(to, string) { console.log("TO: " + to + "; Msg: " + string); }};
*/

var my_bot_name= 'ircbot-' + process.pid;
var bot = new irc.Client('chat.freenode.net', my_bot_name, {
    channels: [preferred_channel],
    debug: true
    });

function process_message(to, message) {
    if (message) {
	var arr = message.split(": ");	
	var command = "";
	if (arr.length > 0) {
		command = arr.shift();
	}
	if (command.length > 0) {
	    var tweeter = new Twit(secrets.twitter_secrets);
	    if (commands[command]) {
			commands[command](tweeter, bot, to, arr.join());
		} else {
			commands.help(bot, to, "");
		}
	}
    }
}
/*
for testing
*/
process_message("search: secret");
process_message("followers: 1angdon");
process_message("tweet: test from nodejs client");

/* not working yet
bot.addListener('message' + preferred_channel, function (from, to, message) {
	console.log("from: " + from + "; to: " + to + "; message: " + util.inspect(message));
	if (to.indexOf(my_bot_name) >= 0) {
		//switch the from to "#tweetme" so it goes in channel
		process_message(preferred_channel, message);
	}
});
*/

bot.addListener('pm', function (from, message) {
    //console.log(from + ' => ME: ' + message);
    process_message(from, message);
});

bot.addListener('join', function(channel, who) {
	if (channel == preferred_channel & who == my_bot_name) {
		console.log("You can talk to me on " + preferred_channel + ", my name is " + my_bot_name);
		commands.help(bot, preferred_channel, "You can talk to me on " + preferred_channel + ", my name is " + my_bot_name)
	}
});
