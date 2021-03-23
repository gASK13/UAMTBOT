let https = require("https");
let fs = require("fs");
let mods = JSON.parse(fs.readFileSync('mods.json', 'utf8'));

const newModMessages = ["{UNAME} just published a new mod {MODNAME}! Download it like it's hot, download it like it's hot!",
    "*slaps mod.io roof* This bad boy can fit so many mods! Like {UNAME}'s new mod - {MODNAME}",
    "Psst! Did you hear {UNAME} released {MODNAME} just now?"];

const subMilestones = [
//    { milestone: 10, messages: ["Looking for an undiscovered gem of a mod? {MODNAME} just got its 10th subscriber!"]},
//    { milestone: 25, messages: ["Look at that! {MODNAME} by {UNAME} just got 25 subs. That's a lot of subs!"]},
    { milestone: 50, messages: ["Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers!"]},
    { milestone: 100, messages: ["{UNAME} made {MODNAME} so well that 100 people subscribed to it."]},
//    { milestone: 125, messages: ["You know what is better then 100 subs? 150 subs! And that is how many {MODNAME} just got."]},
    { milestone: 200, messages: ["I bet you did not expect {MODNAME} to get 200 subscribers, did you {UNAME}?"]},
//    { milestone: 250, messages: ["250 subscribers, {UNAME}! You know what it means? {MODNAME} should get a new update!"]},
    { milestone: 300, messages: ["{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 ~~warriors~~ subscribers, {UNAME}!"]},
    { milestone: 400, messages: ["Pop the champagne! Roll out the red carpet! There is a new star n town - it's {UNAME} and his {MODNAME} with 400 subs!!"]},
    { milestone: 500, messages: ["Impossible! The readings are off the chart, {UNAME}! {MODNAME} is at 500 subscribers ... how is that possible?!"]}
];

const anouncementChannel = "422849152012255254";

const downMilestones = [
//    { milestone: 50, messages: ["Tell your friends - a new popular mod is in town and it is {MODNAME} by {UNAME}. Here's to another 50 downloads!"]},
    { milestone: 100, messages: ["Now we're talking! Three digits, baby! {UNAME}'s {MODNAME} just hit 100 downloads. Drink are on {UNAME}!"]},
    { milestone: 250, messages: ["{UNAME} is slowly climbing up the ladder with their {MODNAME} - 250 downloads!"]},
//    { milestone: 300, messages: ["{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 downloads, {UNAME}. Not as good as 300 subs, but still..."]},
//    { milestone: 400, messages: ["400 downloads for {MODNAME}? Now **that** is something, {UNAME}!"]},
    { milestone: 500, messages: ["{UNAME} must have done something right, otherwise {MODNAME} would not get to 500 downloads."]},
    { milestone: 1000, messages: ["Did you send your mother a link to {MODNAME}, {UNAME}? Cause you should, cause 1000 downloads is something to be proud of!"]},
    { milestone: 2000, messages: ["They called {UNAME} crazy! They said that {MODNAME} could never get 2000 downloads. They laughed at {UNAME}? Well who is laughing now? WHO? MWAHAHAHAHAHAHAHAHA!!!"]}
];

class ModIOService {

    static getTime() {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date+' '+time;
    }

    static save() {
        fs.writeFile("mods.json", JSON.stringify(mods), "utf8", function (error) {});
    }

    static formatMsg(msg, element) {
        return msg.replace(/{UNAME}/g, "**" + element.submitted_by.username + "**").replace(/{MODNAME}/g, "**" + element.name + "**")
        +" \n\n" + element.profile_url;
    }

    static getModComments(apikey, bot) {
        // find last "date added" across all mods
        let lastDate = 0;
        for (let c in mods.comments) {
            if (mods.comments[c].last > lastDate) { lastDate = mods.comments[c].last; }
        }

        try{
            let self = this;
            self.processComments(apikey, lastDate, (cmnt) => {
                // is this new comment? send message!
                if (cmnt.event_type == 'MOD_COMMENT_ADDED') {
                    if (mods.comments[cmnt.mod_id] == null) { mods.comments[cmnt.mod_id] = { users: [], last: 0 }; }
                    if ((mods.comments[cmnt.mod_id].users.length > 0)) {
                        self.getMod(apikey, cmnt.mod_id, (mod) => {
                            for (let user of mods.comments[cmnt.mod_id].users) {
                                let fullUser = bot.users.resolve(user);
                                if (fullUser != null) {}
                                    fullUser.send("A new comment was added to a mod you are watching - " + mod.name + "\n" + mod.profile_url);
                                    console.log("A message was sent to " + fullUser.username + " about " + mod.name);
                                } else {
                                    console.log("Unable to send message to " + user + " about " + mod.name);
                                }
                            }
                        });
                    }
                    if (cmnt.date_added > mods.comments[cmnt.mod_id].last) { mods.comments[cmnt.mod_id].last = cmnt.date_added; }
                }
                // also set LAST to this (or max)
            }, () => { self.save(); }, 0);
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
                mods.comments[element.id].users.splice(mods.comments[element.id].users.indexOf(user), 1);
                msg.channel.send('I will not bother you with notifications about ' + element.name + ' anymore!');
                this.save();
            }
        });
    }

    static getModStats(apikey, bot) {
        try{
            let self = this;
            let channel = bot.channels.resolve(anouncementChannel);

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
            }, () => { self.save(); }, 0);
        } catch (error) {
            console.log(error);
        }
    }

    static getModLink(apikey, sterm, msg) {
        sterm = encodeURI(sterm);

        this.findMod(apikey,  sterm,  msg, (element) => { msg.channel.send(element.profile_url); });
    }

    static processMods(apikey, code, endCode, offset) {
        // get stats
        let self = this;

        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods?_offset=' + offset + '&api_key=' + apikey,
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
                try {
                    let obj = JSON.parse(output);
                    if (obj.data != null) {
                        obj.data.forEach(function (element) {
                            code(element);
                        });
                    }

                    if ((obj.result_total - 100) > offset) {
                        self.processMods(apikey, code, endCode, offset + 100);
                    } else {
                        endCode();
                    }
                } catch (error) {
                    console.log(self.getTime() + "BORK error ON processMods", error);
                    endCode();
                }
            });
        });

        req.on('error', function (err) {
            console.log(self.getTime() + "BORK err ON processMods", err);
        });

        req.end();
    }

    static processComments(apikey, lastDate, code, endCode, offset) {
        let self = this;

        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods/events?_offset=' + offset + '&date_added-min=' + (lastDate+1) + '&api_key=' + apikey,
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
                try {
                    let obj = JSON.parse(output);
                    if (obj.result_count >= 1) {
                        obj.data.forEach(function (element) {
                            code(element);
                        });
                    }

                    if ((obj.result_total - 100) > offset) {
                        self.processComments(apikey, lastDate, code, endCode, offset + 100);
                    } else {
                        endCode();
                    }
                } catch (e) {
                    console.log(self.getTime() + "BORK e ON processComments", e);
                    endCode();
                }
            });
        });

        req.on('error', function (err) {
            console.log(self.getTime() + "BORK err ON processComments", err);
        });

        req.end();
    }

    static findMod(apikey, sterm, msg, code) {
        let self = this;

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
                try {
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
                } catch (e) {
                    console.log(self.getTime() + "BORK e ON findMod", e);
                    msg.channel.send("BORK BORK I AM BORKED. SEND HELP!");
                }
            });
        });

        req.on('error', function (err) {
            if (msg) {
                console.log(self.getTime() + "BORK err ON findMod", err);
                msg.channel.send("BOT BORKED. BORK BORK.");
            }
        });

        req.end();
    }

    static getMod(apikey, id, code) {
        let self = this;

        let options = {
            host: 'api.mod.io',
            port: 443,
            path: '/v1/games/34/mods/' + id + '?api_key=' + apikey,
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
                try {
                    let obj = JSON.parse(output);
                    code(obj);
                } catch (e) {
                    console.log(self.getTime() + "BORK e ON getMod", e);
                    msg.channel.send("BORK BORK I AM BORKED. SEND HELP!");
                }
            });
        });

        req.on('error', function (err) {
            if (msg) {
                console.log(self.getTime() + "BORK err ON getMod", err);
                msg.channel.send("BOT BORKED. BORK BORK.");
            }
        });

        req.end();
    }
}

module.exports = ModIOService;
