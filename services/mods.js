let https = require("https");
let fs = require("fs");
let mods = JSON.parse(fs.readFileSync('mods.json', 'utf8'));

const newModMessages = ["{UNAME} just published a new mod {MODNAME}! Download it like it's hot, download it like it's hot!",
    "*slaps mod.io roof* This bad boy can fit so many mods! Like {UNAME}'s new mod - {MODNAME}",
    "Psst! Did you hear {UNAME} released {MODNAME} just now?"];

const subMilestones = [
    { milestone: 10, messages: ["Looking for an undiscovered gem of a mod? {MODNAME} just got its 10th subscriber!"]},
    { milestone: 25, messages: ["Look at that! {MODNAME} by {UNAME} just got 25 subs. That's a lot of subs!"]},
    { milestone: 50, messages: ["Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers!"]},
    { milestone: 100, messages: ["{UNAME} made {MODNAME} so well that 100 people subscribed to it."]},
    { milestone: 150, messages: ["You know what is better then 100 subs? 150 subs! And that is how many {MODNAME} just got."]},
    { milestone: 200, messages: ["I bet you did not expect {MODNAME} to get 200 subscribers, did you {UNAME}?"]},
    { milestone: 250, messages: ["250 subscribers, {UNAME}! You know what it means? {MODNAME} should get a new update!"]},
    { milestone: 300, messages: ["{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 ~~warriors~~ subscribers, {UNAME}!"]},
    { milestone: 500, messages: ["You have done the impossible {UNAME}! {MODNAME} is at 500 subscribers...amazing!"]}
];

const anouncementChannel = "422849152012255254";

const downMilestones = [
    { milestone: 50, messages: ["Tell your friends - a new popular mod is in town and it is {MODNAME} by {UNAME}. Here's to another 50 downloads!"]},
    { milestone: 100, messages: ["Now we're talking! Three digits, baby! {UNAME}'s {MODNAME} just hit 100 downloads. Drink are on {UNAME}!"]},
    { milestone: 200, messages: ["{UNAME} is slowly climbing up the ladder with their {MODNAME} - 200 downloads!"]},
    { milestone: 300, messages: ["{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 downloads, {UNAME}. Not as good as 300 subs, but still..."]},
    { milestone: 400, messages: ["400 downloads for {MODNAME}? Now **that** is something, {UNAME}!"]},
    { milestone: 500, messages: ["{UNAME} must have done something right, otherwise {MODNAME} would not get to 500 downloads."]},
    { milestone: 1000, messages: ["Did you send your mother a link to {MODNAME}, {UNAME}? Cause you should, cause 1000 downloads is something to be proud of!"]}
];

class ModIOService {

    static save() {
        fs.writeFile("mods.json", JSON.stringify(mods), "utf8", function (error) {
        });
    }

    static formatMsg(msg, element) {
        return msg.replace(/{UNAME}/g, "**" + element.submitted_by.username + "**").replace(/{MODNAME}/g, "**" + element.name + "**")
        +" \n\n" + element.profile_url;
    }

    static getModComments(apikey, bot) {
        try{
        let self = this;

        this.processMods(apikey, (element) => {
            // is anyone watching this mod? if so, load comments and notify them if needed
            if (mods.comments == null) { mods.comments = {}; }
            if (mods.comments[element.id] == null) { mods.comments[element.id] = { users: [], last: 0 }; }
            let last = mods.comments[element.id].last;
            let new_count = 0;
            this.processComments(apikey, element.id, (cmnt) => {
                new_count += (last == null || last < cmnt.date_added) ? 1 : 0;
                if (mods.comments[element.id].last == null || mods.comments[element.id].last < cmnt.date_added) {
                    mods.comments[element.id].last = cmnt.date_added;
                }
            }, () => {
                if (new_count > 0) {
                    for (let user of mods.comments[element.id].users) {
                        bot.fetchUser(user).then((fullUser) => {
                            fullUser.send((new_count > 1 ? (new_count + "new comments were") : ("A new comment was")) + " added to a mod you are watching - " + element.name + "\n" + element.profile_url)
                        });
                    }
                }
                self.save();
            });
        }, () => { self.save(); });
        } catch (error) {
            console.log(error);
        }
    }

    static watchModComments(apikey, user, modname, msg) {
        let self = this;
        this.findMod(apikey,  modname, msg, (element) => {
            if (mods.comments == null) { mods.comments = {}; }
            if (mods.comments[element.id] == null) { mods.comments[element.id] = { users: [], last: 0 }; }
            if (mods.comments[element.id].users.indexOf(user) > -1) {
                msg.channel.send('Oh, silly you! You are already watching mod ' + element.name + '!');
            } else {
                mods.comments[element.id].users.push(user);
                msg.channel.send('You will be notified about any new comments for ' + element.name + '!');
                this.save();
            }
        });
    }

    static unwatchModComments(apikey, user, modname, msg) {
        this.findMod(apikey,  modname,  msg, (element) => {
            if (mods.comments == null) { mods.comments = {}; }
            if (mods.comments[element.id] == null) { mods.comments[element.id] = { users: [], last: 0 }; }
            if (mods.comments[element.id].users.indexOf(user) <= -1) {
                msg.channel.send('Huh? You were not watching ' + element.name + ' comments in the first place!');
            } else {
                mods.comments[element.id].users.splic(mods.comments[element.id].users.indexOf(user), 1);
                msg.channel.send('I will not bother you with notifications about ' + element.name + ' anymore!');
                this.save();
            }
        });
    }

    static getModStats(apikey, bot) {
        try{
        let self = this;
        let channel = bot.channels.get(anouncementChannel);

        this.processMods(apikey, (element) => {
            if (!mods[element.id]) {
                mods[element.id] = { downloads: 0, subs: 0};
                channel.send(self.formatMsg(newModMessages[Math.floor(Math.random() * newModMessages.length)], element));
            } else {
                for (let milestone of subMilestones) {
                    if ((mods[element.id].subs < milestone.milestone) && (element.stats.subscribers_total >= milestone.milestone)) {
                        channel.send(self.formatMsg(milestone.messages[Math.floor(Math.random() * milestone.messages.length)], element));
                    }
                }
                for (let milestone of downMilestones) {
                    if ((mods[element.id].downloads < milestone.milestone) && (element.stats.downloads_total >= milestone.milestone)) {
                        channel.send(self.formatMsg(milestone.messages[Math.floor(Math.random() * milestone.messages.length)], element));
                    }
                }
            }
            mods[element.id].downloads = Math.max(mods[element.id].downloads, element.stats.downloads_total);
            mods[element.id].subs = Math.max(element.stats.subscribers_total, mods[element.id].subs);
        }, () => { self.save(); });
        } catch (error) {
        console.log(error);
    }       
    }

    static getModLink(apikey, sterm, msg) {
        sterm = encodeURI(sterm);

        this.findMod(apikey,  sterm,  msg, (element) => { msg.channel.send(element.profile_url); });
    }

    static processMods(apikey, code, endCode) {
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
                if (obj.data != null) {
                    obj.data.forEach(function (element) {
                        code(element);
                    });
                }

                endCode();
            });
        });

        req.on('error', function (err) {
            console.error("BORK BORK!", err);
        });

        req.end();
    }

    static processComments(apikey, modid, code, endCode) {
        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods/' + modid + '/comments?api_key=' + apikey,
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
                if (obj.result_count >= 1) {
                    obj.data.forEach(function (element) {
                        code(element);
                    });
                }

                endCode();
            });
        });

        req.on('error', function (err) {
            console.error("BORK BORK!", err);
        });

        req.end();
    }

    static findMod(apikey, sterm, msg, code) {
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
                    code(obj.data[0]);
                } else {
                    let names = "";
                    let foundOne = false;
                    obj.data.forEach(function (element) {
                        if (sterm.toLowerCase() === new String(element.name).toLowerCase()) {
                            code(element);
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
            if (msg) {
                msg.channel.send("BOT BORKED. BORK BORK.");
            }
        });

        req.end();
    }
}

module.exports = ModIOService;
