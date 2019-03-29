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
                switch (uname) {
                    case "water":
                        msg.channel.send("Splash!");
                        break;
                    case "stone":
                        msg.channel.send("Ow! " + UserService.getUsernameFromMessage(msg) + " has broken their wrist!" );
                        break;
                    case "fire":
                        msg.channel.send("Yikes! " + UserService.getUsernameFromMessage(msg) + " has burned their hand!" );
                        break;
                    case "earth":
                        msg.channel.send("THUD!" );
                        break;
                    case "air":
                        msg.channel.send("...... seriously?" );
                        break;
                }
                return;
            }

            if (user.id === '522160089554092041') {
                msg.channel.send(UserService.getUsernameFromMessage(msg) + " has tried to slap [UAMT]Bot. [UAMT]Bot evaded. [UAMT]Bot has slapped " + UserService.getUsernameFromMessage(msg) + " so hard that " + UserService.getUsernameFromMessage(msg) + " fainted!");
            } else if (user.id === msg.author.id) {
                msg.channel.send(UserService.getUsernameFromMessage(msg) + " really likes to slap themselves. Nudge nudge wink wink.");
            } else {
                msg.channel.send(UserService.getUsernameFromMessage(msg) + " has just slapped " + UserService.getUsername(user) + "!");
            }
        }
    }
}

module.exports = SlapCommand;
