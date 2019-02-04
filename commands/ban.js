const Command = require('../command.js');

class BanCommand extends Command {

    constructor() {
        super("(Fake)Ban", ['ban'], 1);
        this.banproof_list = [246332093808902144, 412352063125717002, 483028152130469891, 522160089554092041]
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
        let lookup_uname = args.slice(1).join(" ").replace("@", "");
        let found_users = [];
        const rip = this.bot.emojis.find(emoji => emoji.name === "rip");
        let username = "";

        msg.guild.members.forEach((member) => {
            if ((member.nickname != null && member.nickname.toLowerCase().includes(lookup_uname.toLowerCase()))
                || (member.user.username.toLowerCase().includes(lookup_uname.toLowerCase()))) {
                found_users.push(member.id);
                username = member.nickname == null ? member.user.username : member.nickname;
            }
        });

        if (found_users.length === 0) {
            msg.channel.send("Sorry, I don't know wnyone called '" + lookup_uname + "'.");
            return;
        } else if (found_users.length > 1) {
            msg.channel.send("Mate, I know **many** people called '" + lookup_uname + "'...");
            return;
        }

        if (this.banproof_list.indexOf(found_users[0]) > -1 || found_users[0] === this.bot.user.id) {
            msg.channel.send("Wow! " + username + " is so amazing he can't be banned!");
            return;
        }

        msg.channel.send((rip == null ? "RIP" : rip.toString()) + " " + username + "... You were a good pokemon!");
    }
}

module.exports = BanCommand;
