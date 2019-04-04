let https = require("https");
let fs = require("fs");
let mods = JSON.parse(fs.readFileSync('mods.json', 'utf8'));

class ModIOService {

    static save() {
        fs.writeFile("mods.json", JSON.stringify(mods), "utf8", function (error) {
        });
    }

    static getModStats() {
        // get stats
        // if any trigger milestones, output
    }

    static getModLink(apikey, sterm, msg) {
        sterm = encodeURI(sterm);
        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods?api_key=' + apikey + "&_q=" + sterm,
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

module.exports = ModIOService;
