const Command = require('../command.js');
const IdeaService = require('../services/ideas.js');

class IdeaListCommand extends Command {
    constructor() {
        super("Idea Listing", ['ideas'], 0);
    }

    help(msg) {
        return "`]ideas` to list your ideas\n`]ideas {user}` to list user's ideas\n`]ideas clear` to delete all your ideas";
    }

    shortHelp(msg) {
        return "allows listing of user idea list";
    }

    runInternal(msg, args) {
        let uid = msg.author.id;
        let unm = msg.author.nickname == null ? msg.author.username : msg.author.nickname;
        let unma = "you are";
        if (args.length >= 2) {
            if (args[1] === 'clear' || args[1] === 'clean' || args[1] === 'purge') {
                msg.channel.send("Forgetting all your ideas. None of them was any good anyway...");
                IdeaService.clearUserIdeas(uid);
                return
            } else {
                // find user
                let uname = args.slice(1).join(" ").replace("@", "");
                let foundUs = [];
                msg.guild.members.forEach((member) => {
                    if ((member.nickname != null && member.nickname.toLowerCase().includes(uname.toLowerCase()))
                        || (member.user.username.toLowerCase().includes(uname.toLowerCase()))) {
                        foundUs.push(member.id);
                        unm = member.nickname == null ? member.user.username : member.nickname;
                        unma =  unm + " is";
                    }
                });

                if (foundUs.length === 0) {
                    msg.channel.send("Sorry, I don't know wnyone called '" + uname + "'.");
                    return;
                } else if (foundUs.length > 1) {
                    msg.channel.send("Mate, I know **many** people called '" + uname + "'...");
                    return;
                } else {
                    uid = foundUs[0];
                }
            }
        }
        // List them
        let userIdeas = IdeaService.getUserIdeas(uid);
        if (!userIdeas || userIdeas.length === 0) {
            if (uid === '246332093808902144') {
                msg.channel.send("WOW! " + unma + " so full of ideas I can't even show them all!");
            } else if (uid === '412352063125717002') {
                msg.channel.send("gASK ~~keeps an ogranized list of ideas~~ puts all his ideas on a huge assorted pile on Trello.\nhttps://trello.com/b/1VpT0EUe/aground-modding");
            } else {
                msg.channel.send("Sorry, seem like " + unma + " out of ideas!");
            }
        }
        else {
            msg.channel.send(unm +"'s idea list:");
            let i = 1;
            let idealist = "";
            userIdeas.forEach(function(element) {
                idealist += "\n " + (i++) + ".: " + element.replace("@", "");
            });
            msg.channel.send(idealist);
        }
    }
}

module.exports = IdeaListCommand;
