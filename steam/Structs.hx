package steam;

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

typedef SteamJson = Map<String,Mod>

typedef Mod = {
	var title:String;
	var subs:Int;
	var votes_up:Int;
	var votes_down:Int;
}
