package steam;

import haxe.Constraints.NotVoid;
import haxe.DynamicAccess;
import steam.Structs;
import haxe.Json;

using StringTools;
using Lambda;

@:keep class Steam {
	public static inline var BASE = "https://api.steampowered.com";
	public static inline var VERSION = "v1";
	public static inline var CHANNEL = #if release "422849152012255254"; #else "704748213655175300"; #end
	public static final subMilestones = [
		//    { milestone: 10, messages: ["Looking for an undiscovered gem of a mod? {MODNAME} just got its 10th subscriber!"]},
		//    { milestone: 25, messages: ["Look at that! {MODNAME} by {UNAME} just got 25 subs. That's a lot of subs!"]},
		{milestone: 50, messages: ["Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers on steam!"]},
		{milestone: 100, messages: ["{UNAME} made {MODNAME} so well that 100 people subscribed to it on steam!"]},
		//    { milestone: 125, messages: ["You know what is better then 100 subs? 150 subs! And that is how many {MODNAME} just got."]},
		{milestone: 200, messages: ["I bet you did not expect {MODNAME} to get 200 subscribers on steam, did you {UNAME}?"]},
		//    { milestone: 250, messages: ["250 subscribers, {UNAME}! You know what it means? {MODNAME} should get a new update!"]},
		{
			milestone: 300,
			messages: [
				"{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 ~~warriors~~ subscribers on steam, {UNAME})!"
			]
		},
		{
			milestone: 400,
			messages: [
				"Pop the champagne! Roll out the red carpet! There is a new star on steam - it's {UNAME} and his {MODNAME} with 400 subs!!"
			]
		},
		{
			milestone: 500,
			messages: [
				"Impossible! The readings are off the chart, {UNAME}! {MODNAME} is at 500 subscribers on steam ... how is that possible?!"
			]
		}
	];
	public static var mods:DynamicAccess<Mod>;

	public static function getSteamStats(key:String, bot:#if discordjs discordjs.Client #else Dynamic #end) {
		try {
			#if discordjs
			var channel:discordjs.TextChannel = js.Syntax.code("bot.channels.resolve({0})", CHANNEL);
			#end
			var first:Bool = false;
			if (mods == null) {
				mods = {};
				first = true;
			}
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
			}, () -> sys.io.File.saveContent("steam.json", Json.stringify(mods)));
		} catch (e) {
			trace(e);
		}
	}

	public static function processMods(key:String, handle:Dynamic->Void, ?done:Void->Void, ?params:Map<String, String>) {
		if (key == null)
			throw "Key is null!";
		var req = new haxe.Http('$BASE/IPublishedFileService/QueryFiles/$VERSION/');
		req.setParameter("key", key);
		req.setParameter("format", "json");
		req.setParameter("creator_appid", "876650");
		req.setParameter("return_vote_data", "true");
		req.setParameter("return_metadata", "true");
		req.onData = function(d) {
		    try{
                var total:String = Std.string(Json.parse(d).response.total);
                req.setParameter("numperpage", total);
                if (params != null) {
                    for (o in params.keys())
                        req.addParameter(o, params[o]);
                }

                req.onData = function(d) {
                    try{
                        var data:Request = Json.parse(d);
                        if (data.response.publishedfiledetails == null) {
                            trace(data.response);
                            return;
                        }
                        for (o in data.response.publishedfiledetails) {
                            handle(o);
                        }
                        if (done != null) {
                            done();
                        }
                    } catch(e) {
                        trace(e);
                    }
                }
                req.request();
			} catch(e) {
			    trace(e);
			}
		};
		req.onError = (e) -> trace(e);
		req.request();
	}

	public static function getUserName(key:String, id:String, cb:{name:String, avatar:String}->Void):Void {
		var data:Dynamic = null;
		var error = null;
		var req = new haxe.Http("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
		req.setParameter("key", key);
		req.setParameter("steamids", id);
		req.setParameter("format", "json");
		req.onData = (s) -> {
		    try{
                data = haxe.Json.parse(s);
                cb({
                    name: data.response.players[0].personaname,
                    avatar: data.response.players[0].avatar
                });
            } catch(e) {
                trace(e);
            }
		}
		req.onError = (err) -> {
			error = err;
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
		try {
			var m:String = null;
            m = sys.io.File.getContent("steam.json");
			if (m != null) {
				mods = Json.parse(m);
			}
		} catch (e) {
			trace(e);
		}
		#if nodejs
		js.Node.module.exports = Steam;
		#end
	}
}
