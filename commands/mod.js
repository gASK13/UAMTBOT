const Command = require('../command.js');
let https = require("https");

class ModCommand extends Command {
    constructor() {
        super("Mod Search", ['mod'], 0);
    }

    setAuth(auth) {
        super.setAuth(auth);
        this.apikey = auth.apikey;
    }

    help(msg) {
        return "Type in ]mod {name} to find a mod. Even a partial name is enough - if you get it wrong, I will try to help you by listing all relevant mods that you might be looking for!";
    }

    shortHelp(msg) {
        return "quick link an Aground mod";
    }

    runInternal(msg, args) {
        if (args.length < 2) {
            msg.channel.send("Usage: ]mod {search_term}");
        } else {
            let sterm = args.slice(1).join("_");
            sterm = encodeURI(sterm);
            let options = {
                host: 'api.mod.io',
                port: 443,
                path: '/v1/games/34/mods?api_key=' + this.apikey + "&_q=" + sterm,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            let req = https.request(options, function (res) {
                let output = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    output += chunk;
                });

                res.on('end', function () {
                    let obj = JSON.parse(output);
                    if (obj.result_count === 0) {
                        msg.channel.send("Sorry, not mod matching this name was found.");
                    } else if (obj.result_count === 1) {
                        msg.channel.send(obj.data[0].profile_url)
                    } else {
                        let names = "";
                        let foundOne = false;
                        obj.data.forEach(function (element) {
                            if (sterm.toLowerCase() === new String(element.name).toLowerCase()) {
                                msg.channel.send(element.profile_url);
                                foundOne = true;
                                return;
                            }
                            names += (names.length > 0 ? ", " : "") + element.name
                        });
                        if (foundOne) {
                            return;
                        }
                        msg.channel.send("There are multiple mods matching your name. Did you mean " + names + "?");
                    }
                });
            });

            req.on('error', function (err) {
                msg.channel.send("BOT BORKED. BORK BORK.");
            });

            req.end();
        }
    }
}

module.exports = ModCommand;
