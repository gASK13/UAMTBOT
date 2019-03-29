const Command = require('../command.js');
const UserService = require('../services/user.js');
const SlapService = require('../services/slaps');

class SlapCommand extends Command {

    constructor() {
        super("Slap Stats", ['slapstat'], 0);
    }

    setBot(bot) {
        super.setBot(bot);
    }

    help(msg) {
        return "]slapstat [{user}]\n\nYou wanna know where you stand? You will know!!";
    }

    shortHelp(msg) {
        return "get slapping game stat";
    }

    runInternal(msg, args) {
        let user = UserService.getUser(msg);
        if (args.length >= 2) {
            user = UserService.lookupUser(msg, args.slice(1).join(" "));
            if (user == null) {
                return;
            }

        }

        msg.channel.send(UserService.getUsername(user) + SlapService.getSlapStats(user.id));
    }
}

module.exports = SlapCommand;
