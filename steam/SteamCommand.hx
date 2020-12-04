package steam;

import discordjs.MessageEmbed;
import discordjs.Message;

using StringTools;

class SteamCommand extends Cmd {
	static var processMods:String->(Dynamic->Void)->(Void->Void)->(Dynamic->Void)->Map<String, String>->Void
		= untyped require("../services/steam.js").processMods;
	static var getUserName:String -> String -> ({var name:String; var avatar:String;}->Void) -> Void 
		= untyped require("../services/steam.js").getUserName;

	override public function new() {
		super("Steam Mod", ["steammod", "smod", "steam-mod"], 1);
	}

	override function runInternal(msg:Message, args:Array<String>) {
		var arr:Array<Dynamic> = [];
		var search = args.slice(1).join(" ").toLowerCase();
		processMods(auth.steam_key, function(d) {
			var title = ((d.title) : String).toLowerCase();
			if (title.contains(search) || title == search) {
				arr.push(d);
			}
		}, function() {
			if (arr.length == 0) {
				msg.channel.send("There are no mods matching your search");
			} else if (arr.length > 1) {
				msg.channel.send("There are multiple mods matching your search : \n" + [for (o in arr) o.title].join("\n"));
			} else {
				var embed = new MessageEmbed();
				embed.setDescription(((arr[0].file_description) : String).substr(0, 244));
				embed.setTitle(arr[0].title);
				embed.setImage(arr[0].preview_url);
				embed.setColor(BLUE);
				embed.setURL('https://steamcommunity.com/sharedfiles/filedetails/?id=${arr[0].publishedfileid}');
				embed.addField("Stats",
					'Votes : + ${arr[0].vote_data.votes_up} / - ${arr[0].vote_data.votes_down}' + "\n" + 'Subscriptions : ${arr[0].subscriptions}');
				getUserName(auth.steam_key, arr[0].creator, function(d) {
					embed.setAuthor(d.name, d.avatar);
					msg.channel.send(embed);
				});
			}
		}, function(e) {
			msg.channel.send("Something went wrong while executing your command!");
			trace("Error in Steam.processMods for SteamCommand");
			e.trace();
		}, ["search_text" => search]);
	}

	override function help():String {
		return "Returns information about a mod from the steam workshop. \n Usage : `]smod Mod Name`.";
	}

	override function shortHelp():String {
		return "info about a mod on steam";
	}

	static function __init__() {
		js.Node.module.exports = SteamCommand;
	}
}
