const IdeaManipluationCommand = require('./common/ideaManipulation.js');

class IdeaFinishCommand extends IdeaManipluationCommand {
    constructor() {
        super("Idea Finish", ['finish', 'finishidea'], 1);
    }

    help(msg) {
        return "`]finish {IDEA TEXT HERE}` or `]finish {IDEA ID}` to remove an idea based on text or ID";
    }

    shortHelp(msg) {
        return "finish ideas from user idea list";
    }

    formatRemoval(idea, username) {
        return "Good job finally finishing " + idea.replace("@", "") + ", " + username + "!";
    }
}

module.exports = IdeaFinishCommand;
