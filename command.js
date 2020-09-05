class Command {
    constructor(name, shortlist, min_args) {
        this.name = name;
        this.shorlist = shortlist;
        this.min_args = min_args;
    }

    setBot(bot) {
        this.bot = bot;
    }

    setAuth(auth) {
        this.auth = auth;
    }

    help(msg) {
        return "No help defined for " + this.name + "!"
    }

    shortHelp(msg) {
        return "no help available";
    }

    run(msg, args) {
        if ((args.length - 1) < this.min_args) {
            msg.channel.send("The " + this.name + " command requires more parameters! Usage:\n" + this.help());
            return;
        }
        this.runInternal(msg, args)
    }

    runInternal(msg, args) {
        msg.channel.send("Ouch! The developers forgot to implement " + this.name + " command!");
    }

    supports(cmd) {
        return this.shorlist.indexOf(cmd) > -1;
    }
}

module.exports = Command;