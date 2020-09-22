# UAMTBOT

## How to start
To start this app locally, you need a couple things:
- a valid token (sorry, not gonna give you mine for now :)
- node.js (https://nodejs.org/en/download/ or use yum on Linux)

After installing the node.js and downloading the code and setting auth.json with the token (see below), do:
- npm install
- npm install discord.js

To run the bot, just type
- npm start

Auth token file should look like this:

```JS
{
    "token": "MySuP3RS3cR37T0kEn FOR DISCORD",
    "apikey" :  "mod.io API KEY goes here 123456789"
}
```

## How to add new commands

Adding new command:

```JS
const Command = require('../command.js');

class ModListCommand extends Command {
    constructor() {
        super("List Mods", ['mods', 'modlist', 'listmods'], 0);
    }

    help(msg) {
        return "Use to get a quick link to Aground mod.io game page!";
    }
    

    shortHelp(msg) {
        return "links to complete Aground mod list";
    }

    runInternal(msg, args) {
        msg.channel.send("https://aground.mod.io/");
    }
}

module.exports = ModListCommand;
```

1. Create new file in the `commands` folder - nothing else is needed, it is autoscanned for new commands!
2. Change the name of the class - anything goes
3. Be sure to change the name of the class on the last line as well!
4. In the constructor, change the `NAME`, `COMMAND LIST` and `MIN_PARAMS` parameters - name is human-reabadle, command list is a list of ]command aliases and min params is how many params you expect (0 for ]modlist, 1 for ]ban {user} etc.)
5. Change `help` and `short help` texts - the first is used in `]help command`, the second in general `]help` listing
6. Change the insides of the runInternal as needed! Voila!

# How to work with Haxe command

Thanks to Zeta, there is now support for haxe commands (compiled to JS).

See steam commands for example.

To make them work you need to install haxe and then install some libraries

```shell script
haxelib install hxnodejs
haxelib git discordjs https://github.com/Apprentice-Alchemist/Haxe-DiscordJs
```

When you make any changes to the Haxe part, you need to recompile the JS files using

```shell script
haxe build.hxml -D release
```