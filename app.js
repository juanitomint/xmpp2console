'use strict';
/*
 * on debian:
 * 
 * apt-get install libicu-dev
 * 
 * 
 */

console.log(".-------------------------------.");
console.log("| * Starting XMPP BOT service * |");
console.log("'-------------------------------'");

var path = require('path');
var fs = require('fs');
var sh = require('execSync');
var xmpp = require('./index')
var argv = process.argv
var baseDir = path.dirname(fs.realpathSync(__filename)) + '/';
console.log("'LOADING CONFIG:'");
var data = fs.readFileSync(baseDir + 'config/config.json');
var config = JSON.parse(data);
var listen = true;
var client = new xmpp.Client(config.client);
process.cwd(config.appsDir);
client.on('online', function() {
	console.log('online')
	client.send(new xmpp.Element('presence', {}).c('show').t('chat').up().c(
			'status').t(
			(config.helloMsg) ? config.helloMsg : 'XMPP BOT ready for order'));
	/*
	 * add authorized users
	 */
	for ( var i in config.enabledJIDs) {

		var stanza = new xmpp.Element('presence', {
			type : 'subscribe',
			to : config.enabledJIDs[i]
		});
		console.log('Suscribing:' + config.enabledJIDs[i]);
		client.send(stanza);
	}
})

client
		.on(
				'stanza',
				function(stanza) {
					var result = "";
					// if (stanza.is('presence')) console.log(stanza.attrs);
					if (stanza.is('message') &&
					// Important: never reply to errors!
					(stanza.attrs.type !== 'error')) {
						// ---Only allow enabled JID to control this bot
						var pJID = stanza.from.split('/');

						// console.log(stanza.getChild('body'));
						// console.log('--------------------------------------------------');
						// Swap addresses...
						if (stanza.getChild('body')) {
							if (config.enabledJIDs.indexOf(pJID[0]) != -1) {
								var cmd_arr = stanza.getChildText('body')
										.toString().split(' ');
								var cmd = cmd_arr[0];
								if (listen) {

									console.log(stanza.from + ' > '
											+ cmd_arr.join(' '));

									switch (cmd) {
									case "sleep":
										/*
										 * Bot will stop listening for commands
										 */
										listen = false;
										result = "going sleep for a while";
										break;
									case "poweroff":
										/*
										 * power off the bot process
										 */
										console.log('Bye...!!!');
										process.exit();
										break;
									case "halt":
										break;
									default:
										/*
										 * Check if is a predefined command
										 */
										if (config.predefCmds[cmd]) {
											for ( var i in config.predefCmds[cmd]) {
												result += execute_cmd(config.predefCmds[cmd][i]);
											}
										} else {
											cmd = cmd_arr.join(' ');
											result = 'Result:\n'
													+ execute_cmd(cmd);
										}
										break;
									}
									send_msg(stanza.attrs.from, result);
								}
								if (cmd == "wakeup") {
									listen = true;
									send_msg(stanza.attrs.from,
											'ready for commands again');
								}

							} else {// ---end enabled JIDs
								send_msg(
										stanza.attrs.from,
										(config.noJIDcmd) ? execute_cmd(config.noJIDcmd)
												: "sorry can't receive orders from you");
							}
						}

					}
				})

client.on('error', function(e) {
	console.error(e)
});
function send_msg(to, msg) {
	var st1 = new xmpp.Element('message', {
		"to" : to,
		"type" : "chat"
	}).c('body').t(msg);
	client.send(st1);
}

function execute_cmd(cmd) {
	var result = sh.exec(cmd);
	return result.stdout
}

function readJSON(file, callback) {
	try {
		var data = fs.readFileSync(file), myObj;
		try {
			myObj = JSON.parse(data);
			if (callback) {
				callback(myObj, null);
			} else {
				return myObj;
			}
		} catch (err) {
			callback({}, err);
		}
	} catch (err) {
		callback({}, err);
	}
}