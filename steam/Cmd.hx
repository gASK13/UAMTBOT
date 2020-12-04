package steam;

import discordjs.*;

@:jsRequire("../command.js")
extern class Cmd {
    public var bot:Client;
    public var auth:Auth;
    public var name:String;
    public var shortlist:Array<String>;
    public var min_args:Int;
    public function new(name:String,shortlist:Array<String>,min_args:Int);
    public function setBot(bot:Client):Void;
    public function setAuth(auth:Auth):Void;
    public function help():String;
    public function shortHelp():String;
    public function run(msg:Message,args:Array<String>):Void;
    public function runInternal(msg:Message, args:Array<String>):Void;
    public function supports(cmd:String):Bool;
}
typedef Auth = {
    var ?token:String;
    var steam_key:String;
    var modio_key:String;
}