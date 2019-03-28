const Command = require('../command.js');
const UserService = require('../services/user.js');

class SlapCommand extends Command {

    constructor() {
        super("Slap", ['slap'], 1);
    }

    setBot(bot) {
        super.setBot(bot);
    }

    help(msg) {
        return "]slap {user|me}\n\nThis is a joke 'slap' based on some talk in Aground #suggestions server. @Alchemist requested it, so feel free to send him a slap or two!";
    }

    shortHelp(msg) {
        return "slap a user...mostly @Alchemist";
    }

    runInternal(msg, args) {
        let uname = args.slice(1).join(" ").replace("@", "");
        if (uname === 'me') {
            msg.channel.send("Oh, " + UserService.getUsernameFromMessage(msg) + ", silly you! You cannot slap yourself. Or can you?");
        } else {
            let user = UserService.lookupUser(msg, uname);
            if (user == null) {
                return;
            }

            msg.channel.send(UserService.getUsernameFromMessage(msg) + " has just slapped " + UserService.getUsername(user) + "!");
        }
    }
}

module.exports = SlapCommand;
