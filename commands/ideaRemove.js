const IdeaManipluationCommand = require('./common/ideaManipulation.js');

class IdeaRemoveCommand extends IdeaManipluationCommand {
    constructor() {
        super("Idea Removal", ['remove', 'clear', 'removeidea', 'clean'], 1);
    }

    help(msg) {
        return "`]remove {IDEA TEXT HERE}` or `]remove {IDEA ID}` to remove an idea based on text or ID";
    }

    shortHelp(msg) {
        return "removes ideas from user idea list";
    }

    formatRemoval(idea, username) {
        return idea.replace("@", "") + " was not a good one anyway ...";
    }
}

module.exports = IdeaRemoveCommand;
