package steam;

import haxe.DynamicAccess;
import haxe.Json;

using StringTools;
using Lambda;

@:keep class Steam {
	public static inline var BASE = "https://api.steampowered.com";
	public static inline var VERSION = "v1";
	public static inline var CHANNEL = #if release "422849152012255254"; #else "704748213655175300"; #end
	public static final subMilestones = [
		{
			milestone: 50,
			messages: [
				"Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers on Steam!"
			]
		},
		{
			milestone: 100,
			messages: ["{UNAME} made {MODNAME} so well that 100 people subscribed to it on Steam!"]
		},
		{
			milestone: 200,
			messages: [
				"I bet you did not expect {MODNAME} to get 200 subscribers on Steam, did you {UNAME}?"
			]
		},
		{
			milestone: 300,
			messages: [
				"{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 ~~warriors~~ subscribers on Steam, {UNAME})!"
			]
		},
		{
			milestone: 400,
			messages: [
				"Pop the champagne! Roll out the red carpet! There is a new star on Steam - it's {UNAME} and his {MODNAME} with 400 subs!!"
			]
		},
		{
			milestone: 500,
			messages: [
				"Impossible! The readings are off the chart, {UNAME}! {MODNAME} is at 500 subscribers on Steam ... how is that possible?!"
			]
		}
	];
	public static var mods:DynamicAccess<Mod>;

	public static function getSteamStats(key:String, bot:#if discordjs discordjs.Client #else Dynamic #end) {
		try {
			var first:Bool = false;
			if (mods == null) {
				mods = {};
				first = true;
			}
			#if discordjs
			bot.channels.fetch(CHANNEL).then(function(c) {
				var channel:discordjs.TextChannel = cast c;
			#end
				processMods(key, function(o) {
					if (first) {
						mods[o.publishedfileid] = {
							title: o.title,
							subs: o.subscriptions,
							votes_up: o.vote_data.votes_up,
							votes_down: o.vote_data.votes_up
						};
					} else {
						var prev = mods[o.publishedfileid];
						if (prev == null) {
							mods[o.publishedfileid] = {
								title: o.title,
								subs: o.subscriptions,
								votes_up: o.vote_data.votes_up,
								votes_down: o.vote_data.votes_up
							}
							#if discordjs
							getUserName(key, untyped o.creator, function(d) {
								channel.send("New Mod release on Steam **"
									+ o.title
									+ '** by ${d.name}!'
									+ "\n"
									+ 'https://steamcommunity.com/sharedfiles/filedetails/?id=${o.publishedfileid}');
							});
							#end
						} else {
							if (o.subscriptions > prev.subs) {
								#if discordjs
								for (m in subMilestones) {
									if (o.subscriptions >= m.milestone && prev.subs < m.milestone) {
										getUserName(key, untyped o.creator, function(d) {
											channel.send(m.messages[Std.int(m.messages.length * Math.random())].replace("{UNAME}", d.name)
												.replace("{MODNAME}", o.title) + "\n"
												+ 'https://steamcommunity.com/sharedfiles/filedetails/?id=${o.publishedfileid}');
										});
									}
								}
								#end
								prev.subs = o.subscriptions;
							}
						}
					}
				}, function() {
					try
						sys.io.File.saveContent("steam.json", Json.stringify(mods))
					catch (e)
						trace("Exception while saving steam mod data\n" + e.details());
				}, function(e) {
					trace("Error in Steam.processMods for Steam.getSteamStats");
					e.trace();
				});
			#if discordjs
			}).catchError(function(e) {
				trace("Error in Steam.getSteamStats\n" + Std.string(e));
			});
			#end
		} catch (e) {
			trace("Exception in Steam.getSteamStats\n" + e.details());
		}
	}

	public static function processMods(key:String, handle:Dynamic->Void, ?done:Void->Void, ?err:SteamError->Void, ?params:Map<String, String>) {
		function error(type:SteamErrorType, ?message:String, ?exception:haxe.Exception, ?pos:haxe.PosInfos) {
			if (err == null)
				new SteamError(type, message, exception, pos).trace()
			else
				err(new SteamError(type, message, exception, pos));
		}

		if (key == null) {
			error(Other, "Key is null");
			return;
		}
		var req = new haxe.Http('$BASE/IPublishedFileService/QueryFiles/$VERSION/');
		req.setParameter("key", key);
		req.setParameter("format", "json");
		req.setParameter("creator_appid", "876650");
		req.setParameter("return_vote_data", "true");
		req.setParameter("return_metadata", "true");
		req.onData = function(d) {
			try {
				var total:String = Std.string(Json.parse(d).response.total);
				req.setParameter("numperpage", total);
				if (params != null) {
					for (o in params.keys())
						req.addParameter(o, params[o]);
				}

				req.onData = function(d) {
					try {
						var data:Request = Json.parse(d);
						if (data.response.publishedfiledetails != null) {
							for (o in data.response.publishedfiledetails) {
								handle(o);
							}
						}
						if (done != null) {
							done();
						}
					} catch (e) {
						error(Exception, e.message, e);
					}
				}

				req.onError = (e) -> error(HttpError, e);
				req.request();
			} catch (e) {
				error(Exception, e.message, e);
			}
		};
		req.onError = (e) -> error(HttpError, e);
		req.request();
	}

	public static function getUserName(key:String, id:String, cb:{name:String, avatar:String}->Void, ?err:SteamError->Void):Void {
		function error(type:SteamErrorType, ?message:String, ?exception:haxe.Exception, ?pos:haxe.PosInfos) {
			if (err == null)
				new SteamError(type, message, exception, pos).trace()
			else
				err(new SteamError(type, message, exception, pos));
		}
		var data:Dynamic = null;
		var req = new haxe.Http("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
		req.setParameter("key", key);
		req.setParameter("steamids", id);
		req.setParameter("format", "json");
		req.onData = (s) -> {
			try {
				data = haxe.Json.parse(s);
				cb({
					name: data.response.players[0].personaname,
					avatar: data.response.players[0].avatar
				});
			} catch (e) {
				error(Exception, e.message, e);
			}
		}
		req.onError = (e) -> {
			error(HttpError, e);
		}
		req.request();
	}

	static function main() {
		var key = Json.parse(sys.io.File.getContent("auth.json")).steam_key;
		var first = false;
		processMods(key, function(d) {
			if (!first) {
				first = true;
				trace(d);
			}
		});
	}

	public static function __init__() {
		if (sys.FileSystem.exists("steam.json")) {
			var m = sys.io.File.getContent("steam.json");
			mods = try Json.parse(m) catch (e) {};
		}
		#if nodejs
		js.Node.module.exports = Steam;
		#end
	}
}

class SteamError {
	public var type:SteamErrorType;
	public var message:String;
	public var exception:haxe.Exception;
	public var pos:haxe.PosInfos;

	public function new(type:SteamErrorType, message:String, exception:haxe.Exception, pos:haxe.PosInfos) {
		this.type = type;
		this.message = message;
		this.exception = exception;
		this.pos = pos;
	}

	public function toString():String {
		return switch type {
			case HttpError: '$message at $pos';
			case Exception: 'SteamError : Exception "${exception.message}" caught at $pos\nStack : ${exception.stack.toString()}';
			case Other: 'SteamError : $message at $pos';
		}
	}

	public function trace():Void {
		#if js
		untyped console.log(toString());
		#else
		Sys.println(toString());
		#end
	}
}

enum SteamErrorType {
	HttpError;
	Exception;
	Other;
}

typedef Mod = {
	var title:String;
	var subs:Int;
	var votes_up:Int;
	var votes_down:Int;
}

typedef Request = {
	var response:{
		var publishedfiledetails:Array<{
			var title:String;
			var subscriptions:Int;
			var vote_data:{
				var score:Float;
				var votes_up:Int;
				var votes_down:Int;
			}
		}>;
	};
}
