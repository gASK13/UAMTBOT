require('../command.js');

class AgeCommand extends Command {
    constructor() {
        super("Age", ['age'], 0);
    }

    help(msg) {
        return "It's as simple as they come - just type ]age and I'll tell you how many days, hours or minutes you are pestering people on this server!";
    }

    shortHelp(msg) {
        return "provides information about your 'age' on this server";
    }

    runInternal(msg, args) {
        msg.guild.fetchMember(msg.author).then(function(value) {
            let ms = new Date().getTime() - value.joinedTimestamp;
            let min = Math.floor(ms / (1000 * 60));
            let hr = Math.floor(min / 60); min -= hr * 60;
            let ds = Math.floor(hr / 24); hr -= ds * 24;
            msg.channel.send("You are a member of this server for " + ((ds > 0) ? (ds + " days, ") : "") + ((ds > 0 || hr > 0) ? (hr + " hours and ") : "") + min + " minutes.");
        });
    }
}

