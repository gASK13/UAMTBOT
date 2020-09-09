const Command = require('../command.js');

class ItemCommand extends Command {
    constructor() {
        super("Item", ['item'], 2);
    }

    help(msg) {
        return "Usage: `]item {name} {type} [{weight} {cost}]`\nSupported types: `food | resource | potion | weapon`";
    }

    shortHelp(msg) {
        return "helps with basic item syntax";
    }

    runInternal(msg, args) {
        switch (args[2]) {
            case "potion":
            case "resource":
            case "food":
                msg.channel.send('```xml\n<item id="' + args[1].replaceAll("@", "") + '" type="' + (args.length > 2 ? args[2].replaceAll("@", "") : "food") + '" cost="' + (args.length > 4 ? args[4].replaceAll("@", "") : "0") + '" weight="' + (args.length > 3 ? args[3].replaceAll("@", "") : "0") + '" icon="' + args[1].replaceAll("@", "") + '.ico" />```');
                break;
            case "weapon":
                msg.channel.send('```xml\n<item id="' + args[1].replaceAll("@", "") + '" type="equipment" slot="weapon" durability="500" cost="' + (args.length > 4 ? args[4].replaceAll("@", "") : "0") + '" weight="' + (args.length > 3 ? args[3].replaceAll("@", "") : "0") + '" attack="0" cut="0" stamina="0" knockback="0" icon="' + args[1].replaceAll("@", "") + '.ico" animation="' + args[1].replaceAll("@", "") + '" action="equip" movement_walk="walk_rswing" critical="false" />```');
                break;
        }
    }
}

module.exports = ItemCommand;
