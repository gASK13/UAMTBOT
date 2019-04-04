let https = require("https");
let fs = require("fs");
let mods = JSON.parse(fs.readFileSync('mods.json', 'utf8'));

const newModMessages = ["{UNAME} just published a new mod {MODNAME}! Download it like it's hot, download it like it's hot!",
    "*slaps mod.io roof* This bad boy can fit so many mods! Like {UNAME}'s new mod - {MODNAME}",
    "Psst! Did you hear {UNAME} released {MODNAME} just now?"];

const subMilestones = [
    { milestone: 10, messages: ["Looking for an undiscovered gem of a mod? {MODNAME} just got its 10th subscriber!"]},
    { milestone: 25, messages: ["Look at that! {MODNAME} by {UNAME} just got 25 subs. That's a lot of subs!"]},
    { milestone: 50, messages: ["Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers!"]}
];

const anouncementChannel = "563352173338034196";

const downMilestones = [];

class ModIOService {

    static save() {
        fs.writeFile("mods.json", JSON.stringify(mods), "utf8", function (error) {
        });
    }

    static formatMsg(msg, element) {
        return msg.replace("{UNAME}", element.submitted_by.username).replace("{MODNAME}", element.name)
        +" \n\n" + element.profile_url;
    }

    static getModStats(apikey, bot) {
        let self = this;

        // get stats
        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods?api_key=' + apikey,
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
                let channel = bot.channels.get(anouncementChannel);
                let names = "";
                obj.data.forEach(function (element) {
                    if (!mods[element.id]) {
                        mods[element.id] = { downloads: 0, subs: 0};
                        channel.send(self.formatMsg(newModMessages[Math.floor(Math.random() * newModMessages.length)], element));
                    } else {
                        console.log(mods[element.id].subs + "/" + element.stats.subscribers_total);
                        for (let milestone in subMilestones) {
                            console.log("CHECKING MILESTON " + milestone.milestone + " AGAINST " + element.name);
                            if ((mods[element.id].subs < milestone.milestone) && (element.stats.subscribers_total >= milestone.milestone)) {
                                console.log("YAY!");
                                channel.send(self.formatMsg(milestone.messages[Math.floor(Math.random() * milestone.messages.length)], element));
                            }
                        }
                    }
                    mods[element.id].downloads = Math.max(mods[element.id].downloads, element.stats.downloads_total);
                    mods[element.id].subs = Math.max(element.stats.subscribers_total, mods[element.id].subs);
                });

                self.save();
            });
        });

        req.on('error', function (err) {
            console.error("BORK BORK!", err);
        });

        req.end();
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
