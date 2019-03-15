const Command = require('../command.js');
const IdeaService = require('../services/ideas.js');
const UserService = require('../services/user.js');

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
        let user = UserService.getUser(msg);
        if (args.length >= 2) {
            if (args[1] === 'clear' || args[1] === 'clean' || args[1] === 'purge') {
                msg.channel.send("Forgetting all your ideas. None of them was any good anyway...");
                IdeaService.clearUserIdeas(msg.author.id);
                return
            } else {
                // find user
                user = UserService.lookupUser(msg, args.slice(1).join(" "));
                if (user == null) {
                    return;
                }
            }
        }

        // List them
        let userIdeas = IdeaService.getUserIdeas(user.id);
        if (!userIdeas || userIdeas.length === 0) {
            if (user.id === '246332093808902144') {
                if (user.id === msg.author.id) {
                    msg.channel.send("WOW! You are so full of ideas I can't even show them all!");
                } else {
                    msg.channel.send("WOW! " + UserService.getUsername(user) + " is so full of ideas I can't even show them all!");
                }
            } else if (user.id === '412352063125717002') {
                msg.channel.send("gASK ~~keeps an ogranized list of ideas~~ puts all his ideas on a huge assorted pile on Trello.\nhttps://trello.com/b/1VpT0EUe/aground-modding");
            } else {
                if (user.id === msg.author.id) {
                    msg.channel.send("Sorry, seems like you are all out of ideas!");
                } else {
                    msg.channel.send("Sorry, seems like " + UserService.getUsername(user) + " is out of ideas!");
                }
            }
        } else {
            msg.channel.send(UserService.getUsername(user) + "'s idea list:\n\n");
            let i = 1;
            msg.channel.send(userIdeas.map(idea => (i++) + ".: " + idea.replace("@", "")).join("\n"));
        }
    }
}

module.exports = IdeaListCommand;
