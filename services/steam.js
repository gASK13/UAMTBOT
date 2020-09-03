// Generated by Haxe 4.1.3
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
class HxOverrides {
	static dateStr(date) {
		let m = date.getMonth() + 1;
		let d = date.getDate();
		let h = date.getHours();
		let mi = date.getMinutes();
		let s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
	}
	static substr(s,pos,len) {
		if(len == null) {
			len = s.length;
		} else if(len < 0) {
			if(pos == 0) {
				len = s.length + len;
			} else {
				return "";
			}
		}
		return s.substr(pos,len);
	}
	static now() {
		return Date.now();
	}
}
HxOverrides.__name__ = true;
Math.__name__ = true;
class Reflect {
	static field(o,field) {
		try {
			return o[field];
		} catch( _g ) {
			return null;
		}
	}
	static fields(o) {
		let a = [];
		if(o != null) {
			let hasOwnProperty = Object.prototype.hasOwnProperty;
			for( var f in o ) {
			if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
				a.push(f);
			}
			}
		}
		return a;
	}
	static isFunction(f) {
		if(typeof(f) == "function") {
			return !(f.__name__ || f.__ename__);
		} else {
			return false;
		}
	}
	static compareMethods(f1,f2) {
		if(f1 == f2) {
			return true;
		}
		if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
			return false;
		}
		if(f1.scope == f2.scope && f1.method == f2.method) {
			return f1.method != null;
		} else {
			return false;
		}
	}
}
Reflect.__name__ = true;
class Std {
	static string(s) {
		return js_Boot.__string_rec(s,"");
	}
	static parseInt(x) {
		if(x != null) {
			let _g = 0;
			let _g1 = x.length;
			while(_g < _g1) {
				let i = _g++;
				let c = x.charCodeAt(i);
				if(c <= 8 || c >= 14 && c != 32 && c != 45) {
					let nc = x.charCodeAt(i + 1);
					let v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
					if(isNaN(v)) {
						return null;
					} else {
						return v;
					}
				}
			}
		}
		return null;
	}
}
Std.__name__ = true;
class StringBuf {
	constructor() {
		this.b = "";
	}
}
StringBuf.__name__ = true;
Object.assign(StringBuf.prototype, {
	__class__: StringBuf
	,b: null
});
class StringTools {
	static lpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		l -= s.length;
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		buf_b += s == null ? "null" : "" + s;
		return buf_b;
	}
	static replace(s,sub,by) {
		return s.split(sub).join(by);
	}
}
StringTools.__name__ = true;
var ValueType = $hxEnums["ValueType"] = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"]
	,TNull: {_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_index:8,__enum__:"ValueType",toString:$estr}
};
class Type {
	static getInstanceFields(c) {
		let result = [];
		while(c != null) {
			let _g = 0;
			let _g1 = Object.getOwnPropertyNames(c.prototype);
			while(_g < _g1.length) {
				let name = _g1[_g];
				++_g;
				switch(name) {
				case "__class__":case "__properties__":case "constructor":
					break;
				default:
					if(result.indexOf(name) == -1) {
						result.push(name);
					}
				}
			}
			c = c.__super__;
		}
		return result;
	}
	static typeof(v) {
		switch(typeof(v)) {
		case "boolean":
			return ValueType.TBool;
		case "function":
			if(v.__name__ || v.__ename__) {
				return ValueType.TObject;
			}
			return ValueType.TFunction;
		case "number":
			if(Math.ceil(v) == v % 2147483648.0) {
				return ValueType.TInt;
			}
			return ValueType.TFloat;
		case "object":
			if(v == null) {
				return ValueType.TNull;
			}
			let e = v.__enum__;
			if(e != null) {
				return ValueType.TEnum($hxEnums[e]);
			}
			let c = js_Boot.getClass(v);
			if(c != null) {
				return ValueType.TClass(c);
			}
			return ValueType.TObject;
		case "string":
			return ValueType.TClass(String);
		case "undefined":
			return ValueType.TNull;
		default:
			return ValueType.TUnknown;
		}
	}
}
Type.__name__ = true;
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
	}
	get_native() {
		return this.__nativeException;
	}
	static caught(value) {
		if(((value) instanceof haxe_Exception)) {
			return value;
		} else if(((value) instanceof Error)) {
			return new haxe_Exception(value.message,null,value);
		} else {
			return new haxe_ValueException(value,null,value);
		}
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value);
			return e;
		}
	}
}
haxe_Exception.__name__ = true;
haxe_Exception.__super__ = Error;
Object.assign(haxe_Exception.prototype, {
	__class__: haxe_Exception
	,__skipStack: null
	,__nativeException: null
	,__previousException: null
});
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value;
	}
}
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
Object.assign(haxe_ValueException.prototype, {
	__class__: haxe_ValueException
	,value: null
});
class haxe_ds_StringMap {
	constructor() {
		this.h = Object.create(null);
	}
	static keysIterator(h) {
		let keys = Object.keys(h);
		let len = keys.length;
		let idx = 0;
		return { hasNext : function() {
			return idx < len;
		}, next : function() {
			idx += 1;
			return keys[idx - 1];
		}};
	}
}
haxe_ds_StringMap.__name__ = true;
Object.assign(haxe_ds_StringMap.prototype, {
	__class__: haxe_ds_StringMap
	,h: null
});
class haxe_format_JsonParser {
	constructor(str) {
		this.str = str;
		this.pos = 0;
	}
	doParse() {
		let result = this.parseRec();
		let c;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			let c1 = c;
			if(!(c1 == c1)) {
				break;
			}
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			default:
				this.invalidChar();
			}
		}
		return result;
	}
	parseRec() {
		while(true) {
			let c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			case 34:
				return this.parseString();
			case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				let c1 = c;
				let start = this.pos - 1;
				let minus = c1 == 45;
				let digit = !minus;
				let zero = c1 == 48;
				let point = false;
				let e = false;
				let pm = false;
				let end = false;
				while(true) {
					c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 43:case 45:
						if(!e || pm) {
							this.invalidNumber(start);
						}
						digit = false;
						pm = true;
						break;
					case 46:
						if(minus || point || e) {
							this.invalidNumber(start);
						}
						digit = false;
						point = true;
						break;
					case 48:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
							zero = true;
						}
						digit = true;
						break;
					case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
						}
						digit = true;
						zero = false;
						break;
					case 69:case 101:
						if(minus || zero || e) {
							this.invalidNumber(start);
						}
						digit = false;
						e = true;
						break;
					default:
						if(!digit) {
							this.invalidNumber(start);
						}
						this.pos--;
						end = true;
					}
					if(end) {
						break;
					}
				}
				let f = parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
				let i = f | 0;
				if(i == f) {
					return i;
				} else {
					return f;
				}
				break;
			case 91:
				let arr = [];
				let comma = null;
				while(true) {
					let c = this.str.charCodeAt(this.pos++);
					switch(c) {
					case 9:case 10:case 13:case 32:
						break;
					case 44:
						if(comma) {
							comma = false;
						} else {
							this.invalidChar();
						}
						break;
					case 93:
						if(comma == false) {
							this.invalidChar();
						}
						return arr;
					default:
						if(comma) {
							this.invalidChar();
						}
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 102:
				let save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				let save1 = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save1;
					this.invalidChar();
				}
				return null;
			case 116:
				let save2 = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save2;
					this.invalidChar();
				}
				return true;
			case 123:
				let obj = { };
				let field = null;
				let comma1 = null;
				while(true) {
					let c = this.str.charCodeAt(this.pos++);
					switch(c) {
					case 9:case 10:case 13:case 32:
						break;
					case 34:
						if(field != null || comma1) {
							this.invalidChar();
						}
						field = this.parseString();
						break;
					case 44:
						if(comma1) {
							comma1 = false;
						} else {
							this.invalidChar();
						}
						break;
					case 58:
						if(field == null) {
							this.invalidChar();
						}
						obj[field] = this.parseRec();
						field = null;
						comma1 = true;
						break;
					case 125:
						if(field != null || comma1 == false) {
							this.invalidChar();
						}
						return obj;
					default:
						this.invalidChar();
					}
				}
				break;
			default:
				this.invalidChar();
			}
		}
	}
	parseString() {
		let start = this.pos;
		let buf = null;
		let prev = -1;
		while(true) {
			let c = this.str.charCodeAt(this.pos++);
			if(c == 34) {
				break;
			}
			if(c == 92) {
				if(buf == null) {
					buf = new StringBuf();
				}
				let s = this.str;
				let len = this.pos - start - 1;
				buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
				c = this.str.charCodeAt(this.pos++);
				if(c != 117 && prev != -1) {
					buf.b += String.fromCodePoint(65533);
					prev = -1;
				}
				switch(c) {
				case 34:case 47:case 92:
					buf.b += String.fromCodePoint(c);
					break;
				case 98:
					buf.b += String.fromCodePoint(8);
					break;
				case 102:
					buf.b += String.fromCodePoint(12);
					break;
				case 110:
					buf.b += String.fromCodePoint(10);
					break;
				case 114:
					buf.b += String.fromCodePoint(13);
					break;
				case 116:
					buf.b += String.fromCodePoint(9);
					break;
				case 117:
					let uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					if(prev != -1) {
						if(uc < 56320 || uc > 57343) {
							buf.b += String.fromCodePoint(65533);
							prev = -1;
						} else {
							buf.b += String.fromCodePoint(((prev - 55296 << 10) + (uc - 56320) + 65536));
							prev = -1;
						}
					} else if(uc >= 55296 && uc <= 56319) {
						prev = uc;
					} else {
						buf.b += String.fromCodePoint(uc);
					}
					break;
				default:
					throw haxe_Exception.thrown("Invalid escape sequence \\" + String.fromCodePoint(c) + " at position " + (this.pos - 1));
				}
				start = this.pos;
			} else if(c != c) {
				throw haxe_Exception.thrown("Unclosed string");
			}
		}
		if(prev != -1) {
			buf.b += String.fromCodePoint(65533);
			prev = -1;
		}
		if(buf == null) {
			return HxOverrides.substr(this.str,start,this.pos - start - 1);
		} else {
			let s = this.str;
			let len = this.pos - start - 1;
			buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
			return buf.b;
		}
	}
	invalidChar() {
		this.pos--;
		throw haxe_Exception.thrown("Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos);
	}
	invalidNumber(start) {
		throw haxe_Exception.thrown("Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start));
	}
}
haxe_format_JsonParser.__name__ = true;
Object.assign(haxe_format_JsonParser.prototype, {
	__class__: haxe_format_JsonParser
	,str: null
	,pos: null
});
class haxe_format_JsonPrinter {
	constructor(replacer,space) {
		this.replacer = replacer;
		this.indent = space;
		this.pretty = space != null;
		this.nind = 0;
		this.buf = new StringBuf();
	}
	write(k,v) {
		if(this.replacer != null) {
			v = this.replacer(k,v);
		}
		let _g = Type.typeof(v);
		switch(_g._hx_index) {
		case 0:
			this.buf.b += "null";
			break;
		case 1:
			this.buf.b += Std.string(v);
			break;
		case 2:
			let v1 = isFinite(v) ? Std.string(v) : "null";
			this.buf.b += Std.string(v1);
			break;
		case 3:
			this.buf.b += Std.string(v);
			break;
		case 4:
			this.fieldsString(v,Reflect.fields(v));
			break;
		case 5:
			this.buf.b += "\"<fun>\"";
			break;
		case 6:
			let c = _g.c;
			if(c == String) {
				this.quote(v);
			} else if(c == Array) {
				let v1 = v;
				this.buf.b += String.fromCodePoint(91);
				let len = v1.length;
				let last = len - 1;
				let _g = 0;
				let _g1 = len;
				while(_g < _g1) {
					let i = _g++;
					if(i > 0) {
						this.buf.b += String.fromCodePoint(44);
					} else {
						this.nind++;
					}
					if(this.pretty) {
						this.buf.b += String.fromCodePoint(10);
					}
					if(this.pretty) {
						let v = StringTools.lpad("",this.indent,this.nind * this.indent.length);
						this.buf.b += Std.string(v);
					}
					this.write(i,v1[i]);
					if(i == last) {
						this.nind--;
						if(this.pretty) {
							this.buf.b += String.fromCodePoint(10);
						}
						if(this.pretty) {
							let v = StringTools.lpad("",this.indent,this.nind * this.indent.length);
							this.buf.b += Std.string(v);
						}
					}
				}
				this.buf.b += String.fromCodePoint(93);
			} else if(c == haxe_ds_StringMap) {
				let v1 = v;
				let o = { };
				let k = haxe_ds_StringMap.keysIterator(v1.h);
				while(k.hasNext()) {
					let k1 = k.next();
					o[k1] = v1.h[k1];
				}
				let v2 = o;
				this.fieldsString(v2,Reflect.fields(v2));
			} else if(c == Date) {
				let v1 = v;
				this.quote(HxOverrides.dateStr(v1));
			} else {
				this.classString(v);
			}
			break;
		case 7:
			let _g1 = _g.e;
			let i = v._hx_index;
			this.buf.b += Std.string(i);
			break;
		case 8:
			this.buf.b += "\"???\"";
			break;
		}
	}
	classString(v) {
		this.fieldsString(v,Type.getInstanceFields(js_Boot.getClass(v)));
	}
	fieldsString(v,fields) {
		this.buf.b += String.fromCodePoint(123);
		let len = fields.length;
		let last = len - 1;
		let first = true;
		let _g = 0;
		let _g1 = len;
		while(_g < _g1) {
			let i = _g++;
			let f = fields[i];
			let value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) {
				continue;
			}
			if(first) {
				this.nind++;
				first = false;
			} else {
				this.buf.b += String.fromCodePoint(44);
			}
			if(this.pretty) {
				this.buf.b += String.fromCodePoint(10);
			}
			if(this.pretty) {
				let v = StringTools.lpad("",this.indent,this.nind * this.indent.length);
				this.buf.b += Std.string(v);
			}
			this.quote(f);
			this.buf.b += String.fromCodePoint(58);
			if(this.pretty) {
				this.buf.b += String.fromCodePoint(32);
			}
			this.write(f,value);
			if(i == last) {
				this.nind--;
				if(this.pretty) {
					this.buf.b += String.fromCodePoint(10);
				}
				if(this.pretty) {
					let v = StringTools.lpad("",this.indent,this.nind * this.indent.length);
					this.buf.b += Std.string(v);
				}
			}
		}
		this.buf.b += String.fromCodePoint(125);
	}
	quote(s) {
		this.buf.b += String.fromCodePoint(34);
		let i = 0;
		while(true) {
			let c = s.charCodeAt(i++);
			if(c != c) {
				break;
			}
			switch(c) {
			case 8:
				this.buf.b += "\\b";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			default:
				this.buf.b += String.fromCodePoint(c);
			}
		}
		this.buf.b += String.fromCodePoint(34);
	}
	static print(o,replacer,space) {
		let printer = new haxe_format_JsonPrinter(replacer,space);
		printer.write("",o);
		return printer.buf.b;
	}
}
haxe_format_JsonPrinter.__name__ = true;
Object.assign(haxe_format_JsonPrinter.prototype, {
	__class__: haxe_format_JsonPrinter
	,buf: null
	,replacer: null
	,indent: null
	,pretty: null
	,nind: null
});
class haxe_http_HttpBase {
	constructor(url) {
		this.url = url;
		this.headers = [];
		this.params = [];
		this.emptyOnData = $bind(this,this.onData);
	}
	setParameter(name,value) {
		let _g = 0;
		let _g1 = this.params.length;
		while(_g < _g1) {
			let i = _g++;
			if(this.params[i].name == name) {
				this.params[i] = { name : name, value : value};
				return;
			}
		}
		this.params.push({ name : name, value : value});
	}
	addParameter(name,value) {
		this.params.push({ name : name, value : value});
	}
	onData(data) {
	}
	onBytes(data) {
	}
	onError(msg) {
	}
	onStatus(status) {
	}
	hasOnData() {
		return !Reflect.compareMethods($bind(this,this.onData),this.emptyOnData);
	}
	success(data) {
		this.responseBytes = data;
		this.responseAsString = null;
		if(this.hasOnData()) {
			this.onData(this.get_responseData());
		}
		this.onBytes(this.responseBytes);
	}
	get_responseData() {
		if(this.responseAsString == null && this.responseBytes != null) {
			this.responseAsString = this.responseBytes.getString(0,this.responseBytes.length,haxe_io_Encoding.UTF8);
		}
		return this.responseAsString;
	}
}
haxe_http_HttpBase.__name__ = true;
Object.assign(haxe_http_HttpBase.prototype, {
	__class__: haxe_http_HttpBase
	,url: null
	,responseBytes: null
	,responseAsString: null
	,postData: null
	,postBytes: null
	,headers: null
	,params: null
	,emptyOnData: null
});
class haxe_http_HttpNodeJs extends haxe_http_HttpBase {
	constructor(url) {
		super(url);
	}
	request(post) {
		this.responseAsString = null;
		this.responseBytes = null;
		let parsedUrl = js_node_Url.parse(this.url);
		let _gthis = this;
		let secure = parsedUrl.protocol == "https:";
		let host = parsedUrl.hostname;
		let path = parsedUrl.path;
		let port = parsedUrl.port != null ? Std.parseInt(parsedUrl.port) : secure ? 443 : 80;
		let h = { };
		let _g = 0;
		let _g1 = this.headers;
		while(_g < _g1.length) {
			let i = _g1[_g];
			++_g;
			let arr = Reflect.field(h,i.name);
			if(arr == null) {
				arr = [];
				h[i.name] = arr;
			}
			arr.push(i.value);
		}
		if(this.postData != null || this.postBytes != null) {
			post = true;
		}
		let uri = null;
		let _g2 = 0;
		let _g3 = this.params;
		while(_g2 < _g3.length) {
			let p = _g3[_g2];
			++_g2;
			if(uri == null) {
				uri = "";
			} else {
				uri += "&";
			}
			let s = p.name;
			let uri1 = encodeURIComponent(s) + "=";
			let s1 = p.value;
			uri += uri1 + encodeURIComponent(s1);
		}
		let question = path.split("?").length <= 1;
		if(uri != null) {
			path += (question ? "?" : "&") + uri;
		}
		let opts = { protocol : parsedUrl.protocol, hostname : host, port : port, method : post ? "POST" : "GET", path : path, headers : h};
		let httpResponse = function(res) {
			res.setEncoding("binary");
			let s = res.statusCode;
			if(s != null) {
				_gthis.onStatus(s);
			}
			let data = [];
			res.on("data",function(chunk) {
				data.push(js_node_buffer_Buffer.from(chunk,"binary"));
			});
			res.on("end",function(_) {
				let buf = data.length == 1 ? data[0] : js_node_buffer_Buffer.concat(data);
				let httpResponse = buf.buffer.slice(buf.byteOffset,buf.byteOffset + buf.byteLength);
				_gthis.responseBytes = haxe_io_Bytes.ofData(httpResponse);
				_gthis.req = null;
				if(s != null && s >= 200 && s < 400) {
					_gthis.success(_gthis.responseBytes);
				} else {
					_gthis.onError("Http Error #" + s);
				}
			});
		};
		this.req = secure ? js_node_Https.request(opts,httpResponse) : js_node_Http.request(opts,httpResponse);
		if(post) {
			if(this.postData != null) {
				this.req.write(this.postData);
			} else if(this.postBytes != null) {
				this.req.setHeader("Content-Length","" + this.postBytes.length);
				this.req.write(js_node_buffer_Buffer.from(this.postBytes.b.bufferValue));
			}
		}
		this.req.end();
	}
}
haxe_http_HttpNodeJs.__name__ = true;
haxe_http_HttpNodeJs.__super__ = haxe_http_HttpBase;
Object.assign(haxe_http_HttpNodeJs.prototype, {
	__class__: haxe_http_HttpNodeJs
	,req: null
});
class haxe_io_Bytes {
	constructor(data) {
		this.length = data.byteLength;
		this.b = new Uint8Array(data);
		this.b.bufferValue = data;
		data.hxBytes = this;
		data.bytes = this.b;
	}
	getString(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		let s = "";
		let b = this.b;
		let i = pos;
		let max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			let debug = pos > 0;
			while(i < max) {
				let c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					let code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					let c2 = b[i++];
					let code = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else {
					let c2 = b[i++];
					let c3 = b[i++];
					let u = (c & 15) << 18 | (c2 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				let c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	static ofData(b) {
		let hb = b.hxBytes;
		if(hb != null) {
			return hb;
		}
		return new haxe_io_Bytes(b);
	}
}
haxe_io_Bytes.__name__ = true;
Object.assign(haxe_io_Bytes.prototype, {
	__class__: haxe_io_Bytes
	,length: null
	,b: null
});
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__ : true, __constructs__ : ["UTF8","RawNative"]
	,UTF8: {_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"]
	,Blocked: {_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_.__params__ = ["e"],$_)
};
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
haxe_iterators_ArrayIterator.__name__ = true;
Object.assign(haxe_iterators_ArrayIterator.prototype, {
	__class__: haxe_iterators_ArrayIterator
	,array: null
	,current: null
});
class js_Boot {
	static getClass(o) {
		if(o == null) {
			return null;
		} else if(((o) instanceof Array)) {
			return Array;
		} else {
			let cl = o.__class__;
			if(cl != null) {
				return cl;
			}
			let name = js_Boot.__nativeClassName(o);
			if(name != null) {
				return js_Boot.__resolveNativeClass(name);
			}
			return null;
		}
	}
	static __string_rec(o,s) {
		if(o == null) {
			return "null";
		}
		if(s.length >= 5) {
			return "<...>";
		}
		let t = typeof(o);
		if(t == "function" && (o.__name__ || o.__ename__)) {
			t = "object";
		}
		switch(t) {
		case "function":
			return "<function>";
		case "object":
			if(o.__enum__) {
				let e = $hxEnums[o.__enum__];
				let n = e.__constructs__[o._hx_index];
				let con = e[n];
				if(con.__params__) {
					s = s + "\t";
					return n + "(" + ((function($this) {
						var $r;
						let _g = [];
						{
							let _g1 = 0;
							let _g2 = con.__params__;
							while(true) {
								if(!(_g1 < _g2.length)) {
									break;
								}
								let p = _g2[_g1];
								_g1 = _g1 + 1;
								_g.push(js_Boot.__string_rec(o[p],s));
							}
						}
						$r = _g;
						return $r;
					}(this))).join(",") + ")";
				} else {
					return n;
				}
			}
			if(((o) instanceof Array)) {
				let str = "[";
				s += "\t";
				let _g = 0;
				let _g1 = o.length;
				while(_g < _g1) {
					let i = _g++;
					str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
				}
				str += "]";
				return str;
			}
			let tostr;
			try {
				tostr = o.toString;
			} catch( _g ) {
				return "???";
			}
			if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
				let s2 = o.toString();
				if(s2 != "[object Object]") {
					return s2;
				}
			}
			let str = "{\n";
			s += "\t";
			let hasp = o.hasOwnProperty != null;
			let k = null;
			for( k in o ) {
			if(hasp && !o.hasOwnProperty(k)) {
				continue;
			}
			if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
				continue;
			}
			if(str.length != 2) {
				str += ", \n";
			}
			str += s + k + " : " + js_Boot.__string_rec(o[k],s);
			}
			s = s.substring(1);
			str += "\n" + s + "}";
			return str;
		case "string":
			return o;
		default:
			return String(o);
		}
	}
	static __nativeClassName(o) {
		let name = js_Boot.__toStr.call(o).slice(8,-1);
		if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
			return null;
		}
		return name;
	}
	static __resolveNativeClass(name) {
		return $global[name];
	}
}
js_Boot.__name__ = true;
var js_node_Fs = require("fs");
var js_node_Http = require("http");
var js_node_Https = require("https");
var js_node_Url = require("url");
var js_node_buffer_Buffer = require("buffer").Buffer;
class steam_Steam {
	static getSteamStats(key,bot) {
		try {
			let channel = bot.channels.get("422849152012255254");
			let first = false;
			if(steam_Steam.mods == null) {
				steam_Steam.mods = { };
				first = true;
			}
			steam_Steam.processMods(key,function(o) {
				if(first) {
					steam_Steam.mods[o.publishedfileid] = { title : o.title, subs : o.subscriptions, votes_up : o.vote_data.votes_up, votes_down : o.vote_data.votes_up};
				} else {
					let prev = steam_Steam.mods[o.publishedfileid];
					if(prev == null) {
						steam_Steam.mods[o.publishedfileid] = { title : o.title, subs : o.subscriptions, votes_up : o.vote_data.votes_up, votes_down : o.vote_data.votes_up};
						steam_Steam.getUserName(key,o.creator,function(d) {
							channel.send("New Mod release on Steam **" + o.title + ("** by " + d.name + "!") + "\n" + ("https://steamcommunity.com/sharedfiles/filedetails/?id=" + o.publishedfileid));
						});
					} else if(o.subscriptions > prev.subs) {
						let _g = 0;
						let _g1 = steam_Steam.subMilestones;
						while(_g < _g1.length) {
							let m = _g1[_g];
							++_g;
							if(o.subscriptions >= m.milestone && prev.subs < m.milestone) {
								steam_Steam.getUserName(key,o.creator,function(d) {
									channel.send(StringTools.replace(StringTools.replace(m.messages[m.messages.length * Math.random() | 0],"{UNAME}",d.name),"{MODNAME}",o.title) + "\n" + ("https://steamcommunity.com/sharedfiles/filedetails/?id=" + o.publishedfileid));
								});
							}
						}
						prev.subs = o.subscriptions;
					}
				}
			},function() {
				js_node_Fs.writeFileSync("steam.json",haxe_format_JsonPrinter.print(steam_Steam.mods,null,null));
			});
		} catch( _g ) {
			let e = haxe_Exception.caught(_g);
			console.log("steam/Steam.hx:99:",e);
		}
	}
	static processMods(key,handle,done,params) {
		if(key == null) {
			throw haxe_Exception.thrown("Key is null!");
		}
		let req = new haxe_http_HttpNodeJs("https://api.steampowered.com" + "/IPublishedFileService/QueryFiles/" + "v1" + "/");
		req.setParameter("key",key);
		req.setParameter("format","json");
		req.setParameter("creator_appid","876650");
		req.setParameter("return_vote_data","true");
		req.setParameter("return_metadata","true");
		req.onData = function(d) {
			try {
				let total = Std.string(new haxe_format_JsonParser(d).doParse().response.total);
				req.setParameter("numperpage",total);
				if(params != null) {
					let o = haxe_ds_StringMap.keysIterator(params.h);
					while(o.hasNext()) {
						let o1 = o.next();
						req.addParameter(o1,params.h[o1]);
					}
				}
				req.onData = function(d) {
					try {
						let data = new haxe_format_JsonParser(d).doParse();
						if(data.response.publishedfiledetails == null) {
							console.log("steam/Steam.hx:125:",data.response);
							return;
						}
						let _g = 0;
						let _g1 = data.response.publishedfiledetails;
						while(_g < _g1.length) {
							let o = _g1[_g];
							++_g;
							handle(o);
						}
						if(done != null) {
							done();
						}
					} catch( _g ) {
						let e = haxe_Exception.caught(_g);
						console.log("steam/Steam.hx:135:",e);
					}
				};
				req.request();
			} catch( _g ) {
				let e = haxe_Exception.caught(_g);
				console.log("steam/Steam.hx:140:",e);
			}
		};
		req.onError = function(e) {
			console.log("steam/Steam.hx:143:",e);
		};
		req.request();
	}
	static getUserName(key,id,cb) {
		let data = null;
		let error = null;
		let req = new haxe_http_HttpNodeJs("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
		req.setParameter("key",key);
		req.setParameter("steamids",id);
		req.setParameter("format","json");
		req.onData = function(s) {
			try {
				data = new haxe_format_JsonParser(s).doParse();
				cb({ name : data.response.players[0].personaname, avatar : data.response.players[0].avatar});
			} catch( _g ) {
				let e = haxe_Exception.caught(_g);
				console.log("steam/Steam.hx:162:",e);
			}
		};
		req.onError = function(err) {
			error = err;
		};
		req.request();
	}
	static main() {
		let key = new haxe_format_JsonParser(js_node_Fs.readFileSync("auth.json",{ encoding : "utf8"})).doParse().steam_key;
		let first = false;
		steam_Steam.processMods(key,function(d) {
			if(!first) {
				first = true;
				console.log("steam/Steam.hx:177:",d);
			}
		});
	}
}
steam_Steam.__name__ = true;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = "Date";
js_Boot.__toStr = ({ }).toString;
try {
	let m = null;
	m = js_node_Fs.readFileSync("steam.json",{ encoding : "utf8"});
	if(m != null) {
		steam_Steam.mods = new haxe_format_JsonParser(m).doParse();
	}
} catch( _g ) {
	let e = haxe_Exception.caught(_g);
	console.log("steam/Steam.hx:190:",e);
}
module.exports = steam_Steam;
steam_Steam.BASE = "https://api.steampowered.com";
steam_Steam.VERSION = "v1";
steam_Steam.CHANNEL = "422849152012255254";
steam_Steam.subMilestones = [{ milestone : 50, messages : ["Wow! You must be so popular {UNAME}! {MODNAME} just hit 50 subscribers on steam!"]},{ milestone : 100, messages : ["{UNAME} made {MODNAME} so well that 100 people subscribed to it on steam!"]},{ milestone : 200, messages : ["I bet you did not expect {MODNAME} to get 200 subscribers on steam, did you {UNAME}?"]},{ milestone : 300, messages : ["{MODNAME}? {MODNAME}? THIS! IS! SPARTA!\n\n(You just got 300 ~~warriors~~ subscribers on steam, {UNAME})!"]},{ milestone : 400, messages : ["Pop the champagne! Roll out the red carpet! There is a new star on steam - it's {UNAME} and his {MODNAME} with 400 subs!!"]},{ milestone : 500, messages : ["Impossible! The readings are off the chart, {UNAME}! {MODNAME} is at 500 subscribers on steam ... how is that possible?!"]}];
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
