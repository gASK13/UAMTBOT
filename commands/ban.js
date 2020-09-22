const Command = require('../command.js');
const UserService = require('../services/user.js');

class BanCommand extends Command {

    constructor() {
        super("(Fake)Ban", ['ban'], 1);
        this.banproof_list = ['246332093808902144', '412352063125717002', '483028152130469891', '522160089554092041'];
    }

    setBot(bot) {
        super.setBot(bot);
    }

    help(msg) {
        return "]ban {user}\n\nThis is a joke 'ban' base on some talk in Aground #offtopic server. Use with caution!";
    }

    shortHelp(msg) {
        return "joke-ban a user";
    }

    runInternal(msg, args) {
        let user = UserService.lookupUser(msg, args.slice(1).join(" "));
        if (user == null) {
            return;
        }

        let rip = this.bot.emojis.cache.find(emoji => emoji.name === "rip");

        if (this.banproof_list.indexOf(user.id) > -1 || user.id === this.bot.user.id) {
            msg.channel.send("Wow! " + UserService.getUsername(user) + " is so amazing he can't be banned!");
            return;
        } else if (user.id === '500774841738199070') {
            msg.channel.send("Alchemist rejects your ban with magic, then slaps you into the next week!");
            return;
        }

        msg.channel.send((rip == null ? "RIP" : rip.toString()) + " " + UserService.getUsername(user) + "... you were a good pokemon!");
    }
}

module.exports = BanCommand;
