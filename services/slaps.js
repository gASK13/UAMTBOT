let fs = require("fs");

fs.writeFile("slaps.json", '{}', { flag: 'wx' }, function (err) {
    if (err) throw err;
    console.log("SLAPS saved!");
});

let slaps = JSON.parse(fs.readFileSync('slaps.json', 'utf8'));

class SlapService {

    static save() {
        fs.writeFile("slaps.json", JSON.stringify(slaps), "utf8", function (error) {
        });
    }

    static saveSlap(slapper, slapee) {
        if (slapper === slapee) { return; }
        this.resetUser(slapper);
        this.resetUser(slapee);
        slapper.dealt++;
        slapee.received++;
        this.save();
    }

    static resetUser(user) {
        if (!slaps[user]) {
            slaps[user] = { received: 0, dealt: 0};
        }
    }

    static getSlapStats(user) {
        if (slaps[user] == null) {
            return " is still untouched by anyone else.";
        } else {
            return " has dealt " + slaps[user].dealt + " slaps and received " + slaps[user].received + " slaps!";
        }
    }


    static getBestStats() {
        return "COMING SOON!";
    }
}

module.exports = SlapService;
