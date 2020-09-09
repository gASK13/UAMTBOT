const Command = require('../command.js');

class VehicleCommand extends Command {
    constructor() {
        super("Vehicle", ['vehicle'], 2);
    }

    help(msg) {
        return "Usage: ]vehicle {name} {type} [{max_weight} {fuel} {health} {defence} {speed}]\");\nSupported types: boat | flying | car | mining  | spaceship | submarine";
    }

    shortHelp(msg) {
        return "provides an easy way to create `<vehicle>` tags";
    }

    runInternal(msg, args) {
        msg.channel.send('```xml\n<vehicle id="' + args[1].replaceAll("@", "") + '" tile="' + args[1].replaceAll("@", "") + '" title="vehicle.' + args[1].replaceAll("@", "") + '" animation="' + args[1].replaceAll("@", "") + '" type="' + (args.length > 2 ? args[2].replaceAll("@", "") : "car") + '" max_weight="' + (args.length > 3 ? args[3].replaceAll("@", "") : "2000") + '" fuel="' + (args.length > 4 ? args[4].replaceAll("@", "") : "1000") + '" health="' + (args.length > 5 ? args[5].replaceAll("@", "") : "1000") + '" defence="' + (args.length > 6 ? args[6].replaceAll("@", "") : "3") + '" speed="' + (args.length > 7 ? args[7].replaceAll("@", "") : "5") + '" icon="' + args[1].replaceAll("@", "") + '.ico">\n\n</vehicle>```');
    }
}

module.exports = VehicleCommand;
