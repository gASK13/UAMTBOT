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
        let user = UserService.getUser(msg);
        if (args.length >= 2) {
            // find user
            user = UserService.lookupUser(msg, args.slice(1).join(" "));
            if (user == null) { return; }
        }
        msg.guild.fetchMember(user).then(function(value) {
            let ms = new Date().getTime() - value.joinedTimestamp;
            let min = Math.floor(ms / (1000 * 60));
            let hr = Math.floor(min / 60); min -= hr * 60;
            let ds = Math.floor(hr / 24); hr -= ds * 24;
            msg.channel.send((user.id == msg.author.id ? "You have " : UserService.getUsername(user) + " has ") + "been a member of this server for " + ((ds > 0) ? (ds + " days, ") : "") + ((ds > 0 || hr > 0) ? (hr + " hours and ") : "") + min + " minutes.");
        });
    }
}

module.exports = AgeCommand;
