class Command {
    constructor(bot, name, shortlist, min_args) {
        this.name = name;
        this.shorlist = shortlist;
        this.min_args = min_args;
        this.bot = bot;
    }

    help(msg) {
        return "No help defined for " + name + "!"
    }

    shortHelp(msg) {
        return "no help available";
    }

    run(msg, args) {
        if ((args.length - 1) < this.min_args) {
            msg.channel.send("The " + name + " command requires more parameters. Check help!");
        }
        this.runInternal(msg, args)
    }

    runInternal(msg, args) {
        msg.channel.send("Ouch! The developers forgot to implement " + name + " command!");
    }

    supports(cmd) {
        return this.shorlist.indexOf(cmd) > -1;
    }
}

module.exports = Command;