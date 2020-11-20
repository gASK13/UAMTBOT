const Command = require('../command.js');
const UserService = require('../services/user.js');

class AgeCommand extends Command {
    constructor() {
        super("Age", ['age'], 0);
    }

    help(msg) {
        return "It's as simple as they come - just type `]age` and I'll tell you how many days, hours or minutes you are pestering people on this server!\nYou can also check other peoples ages by using `]age {user}`...";
    }

    shortHelp(msg) {
        return "provides information about your 'age' on this server";
    }

    runInternal(msg, args) {
        if (!msg.guild) {
            msg.channel.send("I know we haven't been talking for long, but it feels like ages!");
            return;
        }

        let user = UserService.getUser(msg);
        if (args.length >= 2) {
            // find user
            user = UserService.lookupUser(msg, args.slice(1).join(" "));
            if (user == null) {
                return;
            }
            if (user.id === '500774841738199070') {
                msg.channel.send("Alchemist is timeless and has always been a member of this server! All hail the Alchemist!");
                return;
            }
        }
        let value = msg.guild.members.resolve(user.id);

        let ms = new Date().getTime() - value.joinedTimestamp;
        let min = Math.floor(ms / (1000 * 60));
        let hr = Math.floor(min / 60);
        min -= hr * 60;
        let ds = Math.floor(hr / 24);
        hr -= ds * 24;
        let yr = Math.floor(ds / 365);
        ds -= yr * 365;
        msg.channel.send((user.id == msg.author.id ? "You have " : UserService.getUsername(user) + " has ") + "been a member of this server for " + ((yr > 0) ? (yr + " year" + (yr > 1 ? "s" : "") + ", ") : "") + ((ds > 0) ? (ds + " day" + (ds > 1 ? "s" : "") + ", ") : "") + ((ds > 0 || hr > 0) ? (hr + " hour" + (hr > 1 ? "s" : "") + " and ") : "") + min + " minute" + (min > 1 ? "s" : "") + ".");
    }
}

module.exports = AgeCommand;
