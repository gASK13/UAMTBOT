const Command = require('../command.js');
const IdeaService = require('../services/ideas.js');
const UserService = require('../services/user.js');

class IdeaListCommand extends Command {
    constructor() {
        super("Idea Listing", ['ideas'], 0);
    }

    help(msg) {
        return "`]ideas` to list your ideas\n`]ideas {user}` to list user's ideas\n`]ideas clear` to delete all your ideas\n`]ideas private` to hide your idea list from others\n`]ideas public` to make it public again";
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
                return;
            } else if (args[1] === 'private' || args[1] === 'public') {
                msg.channel.send("Your idea list is now " + args[1] + ".");
                IdeaService.optout(msg.author.id, args[1] === 'private');
                return;
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
            } else if (user.id === '352201261971668992') {
                msg.channel.send("Airom outsourced his idea list outside of my reach - it now resides on Trello.\nhttps://trello.com/b/cHBcEuMH/airoms-aground-mods");
            } else if (user.id === '483028152130469891') {
                msg.channel.send("VorTechnix wanted to edit my source code... so he made his move to Trello official.\nhttps://trello.com/b/PS3aIp52/vortechnix-modding");
            } else {
                if (user.id === msg.author.id) {
                    msg.channel.send("Sorry, seems like you are all out of ideas!");
                } else {
                    msg.channel.send("Sorry, seems like " + UserService.getUsername(user) + " is out of ideas!");
                }
            }
        } else {
            if (user.id === msg.author.id || !IdeaService.isOptout(user.id)) {
                msg.channel.send(UserService.getUsername(user) + "'s idea list:\n\n");
                let i = 1;
                msg.channel.send(userIdeas.map(idea => (i++) + ".: " + idea.replaceAll("@", "")).join("\n"));
            } else {
                msg.channel.send("Sorry, but " + UserService.getUsername(user) + " decided to keep their ideas private.");
            }
        }
    }
}

module.exports = IdeaListCommand;
