var Advertiser = {
	"INFO": { "CookieName": "DERDB" },
	"GADC": { "CookieName": "GADC", "UserInfoKey": "EUD" },
	"Login": {
		"LoginCookieName": "Login",
		isLogin: function() {
			//checks for the existence of the login cookie
			regEx = new RegExp(this.LoginCookieName + '[=;]', 'i');
			cookies = document.cookie.substring(0) + ';';
			if (cookies.search(regEx) == -1) {
				return false;
			}
			return true;
		}
	},
	"Util": {
		"CookieDomain": ".myspace.com",
		"RandomSeed": Date.parse(new Date()),
		_documentURL: decodeURI(document.URL),
		Encode64: function(input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
			var i = 0;
			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				}
				else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			}
			while (i < input.length);

			return output;
		},
		Decode64: function(input) {
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) output = output + String.fromCharCode(chr2);
				if (enc4 != 64) output = output + String.fromCharCode(chr3);

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			}
			while (i < input.length);

			return output;
		},
		SetCookie: function(cookieName, cookieValue, expirationDate) {
			var cookie = cookieName + "=" + cookieValue + "; path=/;"
			if (Advertiser.Util.CookieDomain != "")
				cookie += " domain=" + Advertiser.Util.CookieDomain + ";";
			if (expirationDate != null)
				cookie += " expires=" + expirationDate + ";";

			document.cookie = cookie;
		},
		RemoveCookie: function(name) {
			if (this.CookieDomain == "")
				document.cookie = name + '=; expires=Wed, 19-Jan-2005 08:28:17 GMT; path=/';
			else
				document.cookie = name + '=; domain=' + Advertiser.Util.CookieDomain +
					'; expires=Wed, 19-Jan-2005 08:28:17 GMT; path=/';
		},
		ReadCookie: function(name) {
			regEx = new RegExp(name + '=([^;]*)', 'i');
			if (document.cookie.search(regEx) == -1) {
				return null;
			}
			return RegExp.$1;
		},
		ReadCookieKey: function(cookieName, key) {
			var cookie = this.ReadCookie(cookieName);
			if (cookie != null) {
				regEx = new RegExp(key + '=([^&]*)', 'i');
				if (cookie.search(regEx) == -1) {
					return null;
				}
				return RegExp.$1;
			}
			return null;
		},
		ReadKey: function(source, key) {
			if (source != null) {
				regEx = new RegExp(key + '=([^&]*)', 'i');
				if (source.search(regEx) == -1) {
					return null;
				}
				return RegExp.$1;
			}
			return null;
		},
		SetKey: function(source, key, value) {
			if (source.indexOf(key + '=') != -1) {
				var newPair = key + '=' + value;
				regEx = new RegExp(key + '=([^&]*)', 'i');
				source = source.replace(regEx, newPair);
			}
			else {
				source = source + '&' + key + '=' + value;
			}
			return source;
		},
		AddToCookie: function(cookieName, key, value, isSession) {
			var expirationDate = null;
			if (!isSession) {
				expirationDate = new Date();
				expirationDate.setYear(expirationDate.getFullYear() + 1);
				expirationDate = expirationDate.toGMTString();
			}

			var unencodedValue = null;
			var encodedValue = Advertiser.Util.ReadCookie(cookieName);
			if (encodedValue != null) {
				unencodedValue = Advertiser.Util.Decode64(unescape(encodedValue));
			}

			if (unencodedValue != null) {
				unencodedValue = Advertiser.Util.SetKey(unencodedValue, key, value);
				Advertiser.Util.SetCookie(cookieName, Advertiser.Util.Encode64(unencodedValue), expirationDate);
			}
		},
		IsDefined: function(name) {
			if (name === null || name === "")
				return false;

			//optional 2nd argument to specify that all parts of the var should be checked
			var checkParts = true;
			if (this.IsDefined.arguments.length == 2)
				checkParts = this.IsDefined.arguments[1];

			var nameParts = new Array();
			if (checkParts)
				nameParts = name.split(".");
			else
				nameParts[0] = name;

			var nameCheck = nameParts[0];
			var type = eval("typeof(" + nameCheck + ")");
			if (type == "undefined")
				return false;

			for (var i = 1; i < nameParts.length; i++) {
				nameCheck += "." + nameParts[i];
				var v = eval("typeof(" + nameCheck + ")");
				if (v == "undefined")
					return false;
			}

			return true;
		},
		AddEvent: function(obj, evType, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(evType, fn, false);
				return true;
			}
			else if (obj.attachEvent) {
				var r = obj.attachEvent("on" + evType, fn);
				return r;
			}
			else {
				return false;
			}
		},
		"LoadCheckExecuted": false,
		LoadCheckHandler: function() {
			//The LoadCheckHandler is added to the onload event.  We can use Advertiser.Util.LoadCheckExecuted
			//to tell whether or not onload has already occurred.
			Advertiser.Util.LoadCheckExecuted = true;
		},
		AddLoadCheck: function() {
			if (Advertiser.Util.IsDefined("$addHandler"))
				$addHandler(window, "load", Advertiser.Util.LoadCheckHandler);
		}
	},
	"SDC": {
		"DisplayedFriendEUD": "",
		//do not change DisplayedFriendEUD name 
		"PixelSrc": "http://seg.fimserve.com/relay?",
		targetValuesSet: false,
		setTargetValues: function() {
			//sets targetting values that will be added to the iframe url
			var targetValue = Advertiser.Util.ReadCookie(Advertiser.INFO.CookieName);

			if (targetValue != null)
				targetValue = Advertiser.Util.Decode64(targetValue);

			if (targetValue == null || targetValue.length === 0) return;

			var gender = Advertiser.Util.ReadKey(targetValue, "gender");
			if (gender)
				AdHelper._gender = gender == "M" ? "0" : "1";

			AdHelper._age = Advertiser.Util.ReadKey(targetValue, "age");

			var culture = Advertiser.Util.ReadKey(targetValue, "cultuserpref");
			try {
				if (!Advertiser.SDC.targetValuesSet && (pagefc === 'User' || pagefc === 'LoginTakeOver')) {
					if (culture === "21514") sdcculture = 16;
				}
				Advertiser.SDC.targetValuesSet = true;
			}
			catch (e) { }
		},
		writePixel: function() {
			//drops the SDC pixel

			if (navigator.userAgent.indexOf('GOMEZ') > -1)
				return;

			//append the DERDB cookie value and the Google EUD value to the pixel src
			derdbValue = Advertiser.Util.ReadCookie(Advertiser.INFO.CookieName);
			googleValue = Advertiser.Util.ReadCookieKey(Advertiser.GADC.CookieName, Advertiser.GADC.UserInfoKey);

			if ((derdbValue == null || derdbValue.length == 0) && (googleValue == null || googleValue.length == 0)) return;

			fimpixelsrc = Advertiser.SDC.PixelSrc;

			if (derdbValue != null && derdbValue.length != 0) {
				fimpixelsrc += 'payload=' + derdbValue;

				if (googleValue != null && googleValue.length != 0)
					fimpixelsrc += '&';
			}

			if (googleValue != null && googleValue.length != 0)
				fimpixelsrc += 'eud=' + googleValue;

			fimpixelstyle = 'display:none; position:absolute; left:0px; top:0px; border-width:0px;height:1px;width:1px;';

			fimpixel = document.createElement('img');
			fimpixel.setAttribute('src', fimpixelsrc);
			fimpixel.setAttribute('style', fimpixelstyle);
			fimpixel.style.display = 'none';

			document.getElementsByTagName('body')[0].appendChild(fimpixel);

			//Remove the login cooke after the pixel has been dropped
			Advertiser.Util.RemoveCookie(Advertiser.Login.LoginCookieName);
		},
		AllowRefresh: true, //controls whether or not ads can be refreshed
		AdsRendered: new Object //list of rendered ads, indexed by div id
	},
	"CMS": { "BlueLithium": "myspace_bluelithium" },
	"Refresher": {
		"ActiveAd": '', //The ad that the user is interacting with
		PendingAdCalls: new Object, //list of ads that will refresh when window is in focus, indexed by div id
		AutoList: new Object, //list of ads that auto refresh
		IsFocused: true, //represents whether window is in focus
		FocusEventsAdded: false,
		Focus: function() {
			//when window comes back into focus, refresh all the pending ad calls
			if (!Advertiser.Refresher.IsFocused) {
				Advertiser.Refresher.IsFocused = true;
				Advertiser.Refresher.RefreshPendingAdCalls();
			}
		},
		Blur: function() {
			Advertiser.Refresher.IsFocused = false;
		},
		AddFocusEvents: function() {
			//adds the event handlers for focusing/blurring except for FF2.0/Mac
			if (!Advertiser.Refresher.FocusEventsAdded) {
				if (Advertiser.Util.Browser.isMac && Advertiser.Util.Browser.isFirefox
					&& Advertiser.Util.Browser.versionMajor < 3) {
					Advertiser.SDC.AllowRefresh = false;
				}
				else if (Advertiser.Util.Browser.isIE) {
					document.onfocusout = function() { Advertiser.Refresher.Blur(); }
					document.onfocusin = function() { Advertiser.Refresher.Focus(); }
				} else {
					window.onblur = function() { Advertiser.Refresher.Blur(); }
					window.onfocus = function() { Advertiser.Refresher.Focus(); }
				}
				Advertiser.Refresher.FocusEventsAdded = true;
			}
		},
		AutoRefreshAd: function(tokenID) {
			//If we don't allow refreshes and the ad has been rendered, don't generate the ad
			//or set up the next refresh
			if (!Advertiser.SDC.AllowRefresh && Advertiser.SDC.AdsRendered[tokenID])
				return;

			//Refreshes an ad if window is in focus, and sets up timeout for next refresh
			//If window is not in focus, adds the ad call to the pending list
			var refreshingAd = Advertiser.Refresher.AutoList[tokenID];
			if (refreshingAd == null)
				return;

			//don't refresh the ad or set up the next refresh if the window is not in focus or the user
			//is interacting with the ad
			if (Advertiser.Refresher.IsFocused && Advertiser.Refresher.ActiveAd !== tokenID && refreshingAd.AdCall != null) {
				eval(refreshingAd.AdCall);
				var refresh = "Advertiser.Refresher.AutoRefreshAd('" + tokenID + "')";
				var delay = refreshingAd.Delay;
				if (delay > 0)
					setTimeout(refresh, delay);
			}
			else
				Advertiser.Refresher.PendingAdCalls[tokenID] = refreshingAd.AdCall;
		},
		RefreshPendingAdCalls: function() {
			//If ad call should auto refresh, call AutoRefresh ad.
			//If not, evaluate ad call to refresh it
			for (var tokenID in Advertiser.Refresher.PendingAdCalls) {
				var adCall = Advertiser.Refresher.PendingAdCalls[tokenID];
				if (adCall !== '') {
					Advertiser.Refresher.PendingAdCalls[tokenID] = '';
					var refreshingAd = Advertiser.Refresher.AutoList[tokenID];
					if (refreshingAd != null)
						Advertiser.Refresher.AutoRefreshAd(tokenID);
					else
						eval(adCall);
				}
			}
		},
		SetActiveAd: function(id) { //Sets the ActiveAd var to the id that the user is interacting with
			Advertiser.Refresher.ActiveAd = id;
		},
		ReleaseActiveAd: function() { //When a user is no longer interacting with an ad, refresh the pending ad call
			Advertiser.Refresher.ActiveAd = '';
			Advertiser.Refresher.RefreshPendingAdCalls();
		}
	},
	"DFP": { //MySpaceTV functions
		LeaderboardDivs: new Array('tkn_leaderboard', 'tkn_leaderboardband', 'tkn_leaderboardsonybmg', 'tkn_leaderboardwmg', 'tkn_leaderboardumg',
			'tkn_leaderboardemi', 'tkn_leaderboardmerlin', 'tkn_leaderboardioda', 'tkn_leaderboardorchard'),
		MedRecDivs: new Array('tkn_medrec', 'tkn_medrecband', 'tkn_medrecsonybmg', 'tkn_medrecwmg', 'tkn_medrecumg',
			'tkn_medrecemi', 'tkn_medrecmerlin', 'tkn_medrecioda', 'tkn_medrecorchard'),
		AdsRoadBlocked: false,
		AdsDetermined: false,
		TimeoutCounts: new Object, //indexed by tokenID
		HasVideoPlayer: function() {
			var flashyDiv = document.getElementById('flashy');
			var playerCompDiv = document.getElementById('tv_vid_player_comp');
			if (flashyDiv !== null || playerCompDiv !== null)
				return true;
			return false;
		},
		HasHuluPlayer: function() {
			var huluLogo = document.getElementById('NS_FLASH_logoComponent');
			if (huluLogo != null) {
				var logoSrc = huluLogo.getAttribute('src');
				if (logoSrc != null && logoSrc.indexOf('player.hulu.com') != -1) {
					return true;
				}
			}
			else {
				var playerHuluLogo = document.getElementById('tv_vid_player_hulu_lb');
				if (playerHuluLogo != null && playerHuluLogo.style.display != 'none')
					return true;
			}
			return false;
		},
		SetAdsRoadBlocked: function(adsRoadBlocked) {
			Advertiser.DFP.AdsRoadBlocked = adsRoadBlocked;
			Advertiser.DFP.AdsDetermined = true;
		},
		CallHouseBanner: function(dcTag) {
			if (dcTag == null)
				return;

			var page;
			var pos;
			var params = dcTag.split(';');
			for (i = 0; i < params.length; i++) {
				var kvp = params[i].split('=');
				if (kvp.length === 2) {
					if (kvp[0] === 'page') {
						page = kvp[1];
					}
					else if (kvp[0] === 'pos') {
						pos = kvp[1];
					}
				}
			}

			if (page != "91000017" && page != "21003206" && page != "21003306") return;

			var adTag = "http://ad.doubleclick.net/adi/myspace.video/;";
			var width;
			var height;
			var adDiv;
			if (pos === "leaderboard") {
				for (var i = 0; i < Advertiser.DFP.LeaderboardDivs.length; i++) {
					adDiv = document.getElementById(Advertiser.DFP.LeaderboardDivs[i]);
					if (adDiv != null)
						break;
				}
				adTag += "kw=house=lb;sz=728x90;"
				width = 728;
				height = 90;
			}
			else if (pos === "mrec") {
				for (var i = 0; i < Advertiser.DFP.MedRecDivs.length; i++) {
					adDiv = document.getElementById(Advertiser.DFP.MedRecDivs[i]);
					if (adDiv != null)
						break;
				}
				adTag += "kw=house=mr;sz=300x250;"
				width = 300;
				height = 250;
			}

			if (adDiv == null)
				return;

			var rand = AdHelper.get_randomNumber().substring(2, 11);
			adTag += dcTag + "adid=na;tile1;ord=" + rand;

			adDiv.innerHTML = '<iframe src="' + adTag + '" id="house_ad" width="' + width + '" height="' + height + '" marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no></iframe>';
		},
		LoadRoadBlock: function(tokenId, width, height, adTag) {
			var adDiv = null;
			if (tokenId === 'tkn_medrec') {
				for (var i = 0; i < Advertiser.DFP.MedRecDivs.length; i++) {
					adDiv = document.getElementById(Advertiser.DFP.MedRecDivs[i]);
					if (adDiv !== null)
						break;
				}
			}
			else if (tokenId === 'tkn_leaderboard') {
				for (var i = 0; i < Advertiser.DFP.LeaderboardDivs.length; i++) {
					adDiv = document.getElementById(Advertiser.DFP.LeaderboardDivs[i]);
					if (adDiv !== null)
						break;
				}
			}
			else
				adDiv = document.getElementById(tokenId);

			if (adDiv !== null) {
				adDiv.innerHTML = '<iframe src="' + adTag + '" id="ifr_companion" width="' + width + '" height="' + height + '" marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no></iframe>';
				return true;
			}
			return false;
		}
	}
}

// -- End of Advertiser Object

//Adds the load check handler to the onload event
Advertiser.Util.AddLoadCheck();

function BrowserDetection() {
	var ua = navigator.userAgent.toLowerCase();

	this.isGecko = (ua.indexOf('gecko') != -1 && ua.indexOf('safari') == -1);
	this.isSafari = (ua.indexOf('safari') != -1);
	this.isIE = (ua.indexOf('msie') != -1 && (ua.indexOf('webtv') == -1));

	this.versionMinor = parseFloat(navigator.appVersion);

	if (this.isGecko) {
		this.versionMinor = parseFloat(ua.substring(ua.indexOf('/', ua.indexOf('gecko/') + 6) + 1));
	}
	else if (this.isIE && this.versionMinor >= 4) {
		this.versionMinor = parseFloat(ua.substring(ua.indexOf('msie ') + 5));
	}
	else if (this.isSafari) {
		this.versionMinor = parseFloat(ua.substring(ua.lastIndexOf('safari/') + 7));
	}

	this.versionMajor = parseInt(this.versionMinor, 10);

	this.isWin = (ua.indexOf('win') != -1);
	this.isMac = (ua.indexOf('mac') != -1);

	this.isIE6x = (this.isIE && this.versionMajor == 6);
	this.isIE6up = (this.isIE && this.versionMajor >= 6);

	this.isFirefox = ua.indexOf('firefox') > -1;
}
Advertiser.Util.Browser = new BrowserDetection();


/* AdHelper Object */
var AdHelper = {
	_ad_randomseed: Date.parse(new Date()),
	_randomNumber: '',
	_adCount: 1,
	_friendId: null,
	_userId: null,
	_age: null,
	_gender: null,
	_infoCookieValue: null,
	_functionalContext: '',
	_keys: [], // url name/value pairs arrays
	_values: [],
	_livePreviewUrl: null,
	_qsParsed: false,
	_documentURL: document.URL,
	_setRandom: function() {
		var randomm = 714025;
		var randoma = 4096;
		var randomc = 150889;
		var rndSeed = (this._ad_randomseed * randoma + randomc) % randomm;
		return rndSeed / randomm;
	},
	_parseQueryString: function() {
		//parses query string and sets values of the keys and values arrays
		this._qsParsed = true;
		var uri = decodeURI(this._documentURL);
		var query = uri.indexOf("?") == -1 ? "" : uri.substring(uri.indexOf("?") + 1);
		var pairs = query.split("&");
		var j = pairs.length;
		for (var i = 0; i < j; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos >= 0) {
				var argname = pairs[i].substring(0, pos);
				var value = pairs[i].substring(pos + 1);
				this._keys[this._keys.length] = argname;
				this._values[this._values.length] = value;
			}
		}
	},
	get_adCount: function() {
		return this._adCount;
	},
	set_adCount: function(value) {
		/// <param name="value" type="integer"></param>
		this._adCount = value;
	},
	incrementAdCount: function() {
		this._adCount++;
	},
	getDecodedURL: function() {
		return decodeURI(this._documentURL);
	},
	getFunctionalContext: function() {
		//gets the functional context from the MySpace Client Context js variable
		if (this._functionalContext === '') {
			if (Advertiser.Util.IsDefined("MySpace.ClientContext.FunctionalContext"))
				this._functionalContext = MySpace.ClientContext.FunctionalContext;
			else if (Advertiser.Util.IsDefined("MySpaceClientContext.FunctionalContext"))
				this._functionalContext = MySpaceClientContext.FunctionalContext;
		}
		return this._functionalContext;
	},
	queryString: function(key) {
		/// <param name="key" type="string"></param>
		//returns query string value given the key
		var args = this.queryString.arguments;
		var toLower = true;
		if (args.length === 2)
			toLower = args[1];

		if (!this._qsParsed) this._parseQueryString();
		var value = null;
		var j = this._keys.length;
		for (var i = 0; i < j; i++) {
			if (this._keys[i] == key) {
				value = escape(this._values[i]);
				break;
			}
		}

		if (value == null || !toLower)
			return value;
		else
			return value.toLowerCase();
	},
	getID: function(name) {
		var v = this.queryString(name);
		if (v != null)
			return v;
		else
			return 0;
	},
	getVar: function(name) {
		var v = eval("typeof(" + name + ")");
		if (v == "undefined")
			return null;
		return eval(name);
	},
	getVarOrId: function(varName, queryName) {
		var v = this.getVar(varName);
		if (v == null)
			return null;
		else if (v != 0)
			return v;
		else
			return this.getID(queryName);
	},
	getTVCatMasterId: function() {
		var tvcatmaster_id = this.getVar("tvcatmasterid");
		if (tvcatmaster_id == null || isNaN(tvcatmaster_id))
			return null;
		switch (tvcatmaster_id) {
			case 1:
			case 2:
				tvcatmaster_id = 0;
				break;
			case 7:
				tvcatmaster_id = 300;
				break;
			case 9:
				tvcatmaster_id = 100;
				break;
			case 15:
				tvcatmaster_id = 200;
				break;
			case 8:
				tvcatmaster_id = 1001;
				break;
			default:
				break;
		}
		return tvcatmaster_id;
	},
	getTVChannelID: function() {
		if (AdHelper.getVar("ChannelID") > 0)
			return AdHelper.getVar("ChannelID");
		if (AdHelper.getVar("tvchanid") > 0)
			return AdHelper.getVar("tvchanid");
		return null;
	},
	getTVVideoID: function() {
		if (AdHelper.getVar("videoid") > 0)
			return AdHelper.getVar("videoid");
		if (AdHelper.getVar("videoID") > 0)
			return AdHelper.getVar("videoID");
		return null;
	},
	get_friendId: function() { //el=str, case_sensitive=bool
		//gets the id of the displayed friend
		if (this._friendId != null) {
			return this._friendId;
		}

		if (Advertiser.Util.IsDefined("MySpace.ClientContext.DisplayFriendId") &&
			MySpace.ClientContext.DisplayFriendId > 0) {
			this._friendId = MySpace.ClientContext.DisplayFriendId;
		}
		else {
			var urls = this._documentURL;
			//stripTicks
			urls = urls.replace(/'/g, "");
			// look for friend, channel, or group id
			var re = new RegExp("\\?[\\w\\W]*(friendid|channelid|groupid)=([^\\&\\?#]*)", "i");
			var arr = re.exec(urls);
			if (arr && arr.length > 1) {
				this._friendId = arr[2];
			}
		}
		return this._friendId;
	},
	getCurrentUserId: function() {
		if (this._userId != null)
			return this._userId;

		if (Advertiser.Util.IsDefined("MySpace.ClientContext.UserId")
			&& MySpace.ClientContext.UserId > 0
			&& Advertiser.Util.IsDefined("MySpace.ClientContext.IsLoggedIn")
			&& (MySpace.ClientContext.IsLoggedIn == true)) {
			this._userId = MySpace.ClientContext.UserId;
		}
		return this._userId;
	},
	getAge: function() {
		return this._age;
	},
	getGender: function() {
		return this._gender;
	},
	getInfoCookie: function() {
		if (this._infoCookieValue != null)
			return this._infoCookieValue;
		this._infoCookieValue = Advertiser.Util.ReadCookie(Advertiser.INFO.CookieName);
		if (this._infoCookieValue != null)
			this._infoCookieValue = Advertiser.Util.Decode64(this._infoCookieValue);

		return this._infoCookieValue;
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		var j = ca.length;
		for (var i = 0; i < j; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
			if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
		}
		return "Unknown";
	},
	get_randomNumber: function() {
		if (this._randomNumber.length === 0) {
			this._randomNumber = this._setRandom() + "";
		}
		return this._randomNumber;
	},
	get_livePreviewUrl: function() {
		//In order to generate a live preview, AdOps passes env and cid values on the  
		//query string of the page. Using these values we generate a special url for the iframe.
		if (this._livePreviewUrl != null) {
			return this._livePreviewUrl;
		}

		var env = this.queryString('env');
		var cid = this.queryString('cid');

		if (cid != null && cid !== '' && env != null & env !== '') {
			this._livePreviewUrl = unescape(env) + '?creativeId=' + cid;
			return this._livePreviewUrl;
		}
		return null;
	}
}
/* End AdHelper */

/* AdCallAd Object */
function AdCallAd(page, subd) {
	/// <param name="page" type="string"></param>
	/// <param name="subd" type="string"></param>
	var regex = /,/;
	if (regex.test(page)) {
		siteArr = page.split(",");
		this._page = siteArr[1];
	}
	this._subd = subd;
}

AdCallAd.prototype = {
	_page: '',
	_pos: '',
	_adWidth: 0,
	_adHeight: 0,
	_subd: '',
	_friendID: 0,
	_queryString: "",
	get_page: function() {
		return this._page;
	},
	set_page: function(value) {
		this._page = value;
	},
	get_pos: function() {
		return this._pos;
	},
	get_adWidth: function() {
		return this._adWidth;
	},
	get_adHeight: function() {
		return this._adHeight;
	},
	get_subd: function() {
		return this._subd;
	},
	get_friendID: function() {
		return this._friendID;
	},
	get_queryString: function() {
		return this._queryString;
	},
	setAdProperties: function(givenPos, defaultWidth, defaultHeight, defaultPos, defaultFriendID) {
		/// <param name="givenPos" type="String"></param>
		/// <param name="defaultWidth" type="Number" integer="true"></param>
		/// <param name="defaultHeight" type="Number" integer="true"></param>
		/// <param name="defaultPos" type="String"></param>
		/// <param name="defaultFriendID" type="String"></param>
		this._pos = givenPos;

		switch (givenPos) {
			case 'frame1':
				this._adWidth = 728;
				this._adHeight = 90;
				this._pos = 'leaderboard';
				this._subd = 'deLB';
				break;
			case 'top':
				this._adWidth = 468;
				this._adHeight = 60;
				this._pos = 'banner';
				this._subd = 'deBR';
				break;
			case 'x08':
				this._adWidth = 430;
				this._adHeight = 600;
				this._pos = 'halfpage';
				this._subd = 'deHP';
				break;
			case 'x14':
				this._adWidth = 300;
				this._adHeight = 250;
				this._pos = 'mrec';
				this._subd = 'deMR';
				break;
			case 'x15':
				this._adWidth = 160;
				this._adHeight = 600;
				this._pos = 'skyscraper';
				this._subd = 'deSK';
				break;
			case 'x77':
				this._adWidth = 1;
				this._adHeight = 1;
				this._pos = '1x1';
				this._subd = 'deSB';
				break;
			case 'x78': // login page
				this._adWidth = 750;
				this._adHeight = 600;
				this._pos = 'interstitial';
				this._subd = 'deSB';
				break;
			case 'uhpfp': //uhp feature profile
				this._adWidth = 200;
				this._adHeight = 170;
				this._subd = 'deFP';
				break;
			case 'west':
				this._adWidth = 440;
				this._adHeight = 160;
				this._subd = 'deWB';
				break;
			case 'east':
				this._adWidth = 300;
				this._adHeight = 100;
				this._subd = 'deEB';
				break;
			case 'vrec':
				this._adWidth = 240;
				this._adHeight = 400;
				this._subd = 'deVR';
				break;
			case 'slogo':
				this._adWidth = 180;
				this._adHeight = 32;
				this._subd = 'desb';
				break;
			case '923x250':
				this._adWidth = 923;
				this._adHeight = 250;
				this._subd = 'desb';
				break;
			case 'ccpixel':
				this._adWidth = 1;
				this._adHeight = 1;
				this._subd = 'deSB';
				break;
			case 'mfapp1':
				this._adWidth = 543;
				this._adHeight = 100;
				this._subd = 'dewb';
				break;
			case 'mfapp2':
				this._adWidth = 543;
				this._adHeight = 100;
				this._subd = 'deeb';
				break;
			case 'mfapp3':
				this._adWidth = 543;
				this._adHeight = 100;
				this._subd = 'defml';
				break;
			case 'mfapp4':
				this._adWidth = 350;
				this._adHeight = 100;
				this._subd = 'defmr';
				break;
			case '540x200':
				this._adWidth = 540;
				this._adHeight = 200;
				this._subd = 'desb';
				break;
			case '942x250':
				this._adWidth = 942;
				this._adHeight = 250;
				this._subd = 'desb';
				break;
			case '620x50':
				this._adWidth = 620;
				this._adHeight = 50;
				this._subd = 'deeb';
				break;
			case '960x50':
				this._adWidth = 960;
				this._adHeight = 50;
				this._subd = 'desb';
				break;
			case '800x50':
				this._adWidth = 800;
				this._adHeight = 50;
				this._subd = 'desb';
				break;
			case '860x250':
				this._adWidth = 860;
				this._adHeight = 250;
				this._subd = 'deeb';
				break;
			case '960x250':
				this._adWidth = 960;
				this._adHeight = 250;
				this._subd = 'desb';
				break;
			case '960x300':
				this._adWidth = 960;
				this._adHeight = 300;
				this._subd = 'dewb';
				break;
			case '300x40':
				this._adWidth = 300;
				this._adHeight = 40;
				this._subd = 'desb';
				break;
			case '500x350':
				this._adWidth = 500;
				this._adHeight = 350;
				this._subd = 'desb';
				break;
			case '1x1custom':
				this._adWidth = 1;
				this._adHeight = 1;
				this._subd = 'deeb';
				break;
			case '50x22':
				this._adWidth = 50;
				this._adHeight = 22;
				this._subd = 'desb';
				break;
			case '144x40':
				this._adWidth = 160;
				this._adHeight = 40;
				this._subd = 'desb';
				break;
			case 'hptab':
				this._adWidth = 210;
				this._adHeight = 330;
				this._subd = 'desb';
				break;
			case '600x90':
				this._adWidth = 600;
				this._adHeight = 90;
				this._subd = 'desb';
				break;
			case '930x255':
				this._adWidth = 930;
				this._adHeight = 255;
				this._subd = 'dewb';
				break;
			default:
				this._adWidth = defaultWidth;
				this._adHeight = defaultHeight;
				this._pos = defaultPos;
				this._friendID = defaultFriendID;
				break;
		}
		//parse the cookie for JP
		var cultureCookie = AdHelper.readCookie('MSCulture');
		var cookieKey = '&IPCulture=';
		var keyindex = cultureCookie.indexOf(cookieKey);
		var culture = cultureCookie.substring(keyindex + cookieKey.length, cultureCookie.length);
		if (culture.indexOf('&') >= 0) {
			culture = culture.substring(0, culture.indexOf('&'));
		}
		if (culture.indexOf('ja-JP') >= 0) {
			this._subd = 'adjp01';
			switch (givenPos) {
				case 'frame1':
					this._pos = 'leaderboard&params.styles=leaderboard';
					break;
				case 'x08':
					this._pos = 'halfpage&params.styles=halfpage';
					break;
				case 'x78': // login page
					this._pos = 'interstitial&params.styles=halfpage';
					break;
				default:
					//keep given position
					break;
			}
		} else if (culture.indexOf('pl-PL') >= 0 && givenPos == 'frame1') {
			//special leaderboard size for poland
			this._adWidth = 750;
			this._adHeight = 100;
		}

	},
	addParam: function(pKey, pValue) {
		/// <param name="pKey" type="String"></param>
		/// <param name="pKey" type="String"></param>
		/// <returns type="Boolean"></returns>

		//optional parameter
		var checkNotZero = this.addParam.arguments[2];

		if (pValue != null && pValue !== '') {
			if (checkNotZero) {
				if (!pValue) {
					return false;
				}
			}
			this._queryString += "&" + pKey + "=" + pValue;
			return true;
		}
		else
			return false;
	}
}
/* End AdCallAd Object */

function sdc_wrapper() {
	var args = sdc_wrapper.arguments;
	var page = '';
	var regex = /,/;
	if (regex.test(args[1])) {
		siteArr = args[1].split(",");
		page = siteArr[1];
	}

	var fuseaction = AdHelper.queryString('fuseaction');
	var pagefc = AdHelper.getFunctionalContext();

	//If the following conditions are true, we add the ad call to the onload event
	//If not, generate the ad without delaying
	if ((args.length === 3 || args[3] !== false) && Advertiser.Util.IsDefined("$addHandler") &&
		!Advertiser.Util.LoadCheckExecuted &&
		AdHelper.getDecodedURL().indexOf('vids.myspace.com') === -1 &&
		pagefc !== 'ViewImage' &&
		pagefc !== 'ViewTaggedPhoto' &&
		pagefc !== 'Splash' &&
		pagefc !== 'User' &&
		pagefc !== 'UserViewProfile') {
		function AdHandler() {
			generateAd(args[0], args[1], args[2]);
		}
		$addHandler(window, "load", AdHandler);
	} else {
		generateAd(args[0], args[1], args[2]);
	}

}


function generateAd() {

	var argv = generateAd.arguments;
	var tokenID = argv[0];
	var page = argv[1];
	var pos = argv[2].toLowerCase();

	//If we don't allow refreshes or if the user is interactive with the ad and the ad has been rendered , don't generate the ad
	if (Advertiser.SDC.AdsRendered[tokenID]) {
		if (!Advertiser.SDC.AllowRefresh)
			return;
		if (Advertiser.Refresher.ActiveAd === tokenID) {
			Advertiser.Refresher.PendingAdCalls[tokenID] = "generateAd('" + argv[0] + "','" + argv[1] + "','" + argv[2] + "')";
			return;
		}
	}

	var ctr = document.getElementById(tokenID);
	if (ctr == null)
		return;

	var fuseaction = AdHelper.queryString('fuseaction');
	var pagefc = AdHelper.getFunctionalContext();

	var ad = new AdCallAd(page, 'deLB');
	ad.setAdProperties(pos, 728, 90, 'leaderboard&params.styles=leaderboard', AdHelper.get_friendId());

	//Lets the video load to determine if ads are being roadblocked. We don't generate the ad, if they 
	//are roadblocked.  Checks once every second for 10 seconds, and generates the ad if the ads still
	//haven't been determined.   
	if ((pagefc === 'VideosIndividual' || pagefc === 'VidsChannel' || pagefc === 'VideosShowVideos') &&
		Advertiser.DFP.HasVideoPlayer() && !Advertiser.DFP.HasHuluPlayer()) {
		if (Advertiser.DFP.AdsDetermined) {
			if (Advertiser.DFP.AdsRoadBlocked === true || Advertiser.DFP.AdsRoadBlocked === "true")
				return;
		} else {
			if (!Advertiser.Util.IsDefined("Advertiser.DFP.TimeoutCounts['" + tokenID + "']", false))
				Advertiser.DFP.TimeoutCounts[tokenID] = 0;
			if (Advertiser.DFP.TimeoutCounts[tokenID] < 10) {
				Advertiser.DFP.TimeoutCounts[tokenID]++;
				var func = "generateAd('" + argv[0] + "','" + argv[1] + "','" + argv[2] + "')";
				setTimeout(func, 1000);
				return;
			}
		}
	}

	var qsHeight = AdHelper.queryString('adHeight');
	var qsWidth = AdHelper.queryString('adWidth');
	var livePreviewUrl = AdHelper.get_livePreviewUrl();

	//generate live preview for AdOps if the live preview url is not null and ad height and 
	//width matches values passed on the querystring
	if (livePreviewUrl != null && qsHeight == ad.get_adHeight() && qsWidth == ad.get_adWidth()) {
		frameURL = livePreviewUrl;
	}
	else if (ad.get_subd() === 'adjp01') {
		//call ad_wrapper function instead if the ip culture is ja-JP
		ad_wrapper(tokenID, page, argv[2]);
		return;
	}
	else {

		//set targeting values if on UHP or Login Interstitial
		Advertiser.SDC.setTargetValues();


		if (AdHelper.getDecodedURL().indexOf('apps.myspace.com') !== -1) {
			var cat = AdHelper.queryString('category');
			if (cat !== null && cat !== '')
				ad.set_page('45000011');
		}

		if (pagefc === "UserViewProfile" && AdHelper.queryString('pe') === "1")
			ad.set_page('11130003');
		else if (pagefc === 'SiteSearch') {
			//manipulates page value based on SiteSearch type
			var searchType = AdHelper.queryString('type');
			if (searchType === 'music')
				ad.set_page('21000002');
			else if (searchType === 'myspacetv')
				ad.set_page('91000003');
			else if (searchType === 'people')
				ad.set_page('19002003');
		}

		//manipulates values for photo pages when user is looking at their own albums/photos
		if (Advertiser.Util.IsDefined("MySpace.ClientContext.UserId") &&
			MySpace.ClientContext.UserId == AdHelper.get_friendId()) {
			if (pagefc === "ViewImage")
				ad.set_page('11013108');
			else if (pagefc === "ViewTaggedPhoto")
				ad.set_page('11011127');
			else if (pagefc === "UserViewAlbums")
				ad.set_page('11511119');
			else if (pagefc === "UserViewPicture")
				ad.set_page('11513004');
		}

		//manipulates page value for medrec only on the first load
		if (Advertiser.Util.IsDefined("MySpace.Ads.CurtainPageValue") && MySpace.Ads.CurtainPageValue != '' && ad.get_pos() === "mrec") {
			ad.set_page(MySpace.Ads.CurtainPageValue);
			MySpace.Ads.CurtainPageValue = '';
		}

		if (Advertiser.Util.IsDefined("MySpace.Ads.SiteSearchPageValue") && MySpace.Ads.SiteSearchPageValue != '') {
			ad.set_page(MySpace.Ads.SiteSearchPageValue);
		}

		//adding params onto iframe src
		ad.addParam("l", ad.get_page());
		ad.addParam("pos", ad.get_pos());
		ad.addParam("rnd", AdHelper.get_randomNumber().substring(2, 11));
		ad.addParam("fid", AdHelper.get_friendId(), true);
		ad.addParam("cat", AdHelper.getVar("ad_Topic_ID"), true);
		ad.addParam("tvcat", AdHelper.getVar("tvcat"), true);
		ad.addParam("tvch", AdHelper.getTVChannelID(), true);
		ad.addParam("tvvid", AdHelper.getTVVideoID(), true);
		ad.addParam("tvmcat", AdHelper.getTVCatMasterId());
		ad.addParam("sp", AdHelper.queryString("schoolID"));
		ad.addParam("s", AdHelper.queryString("special"));
		ad.addParam("luc", AdHelper.getVar("sdcculture"));
		ad.addParam("uhpt", AdHelper.getVar("uhpt"));
		ad.addParam("nwcat", AdHelper.getVar("nwcat"));
		ad.addParam("nwvert", AdHelper.getVar("nwvert"));
		ad.addParam("gsku", AdHelper.getVar("gsku"));
		ad.addParam("gcat", AdHelper.getVar("gcat"));
		ad.addParam("puid", AdHelper.getCurrentUserId());
		ad.addParam("neg", AdHelper.getGender());
		ad.addParam("ega", AdHelper.getAge());

		//Add rmo querystring if exist
		if (pagefc === "UserViewProfile" && AdHelper.queryString('rmo', false) !== null) {
			ad.addParam("rmo", AdHelper.queryString('rmo', false));
		}

		//add "10" + category id for apps pages
		if (AdHelper.getDecodedURL().indexOf('apps.myspace.com') !== -1) {
			var appCat = AdHelper.queryString("category");
			if (appCat != null && appCat != "") {
				appCat = "10" + appCat;
				ad.addParam("dwcat", appCat);
			}
		}

		if (Advertiser.Util.IsDefined("MySpace.Ads.BandType")) {
			ad.addParam("bg1", MySpace.Ads.BandType.Genre1, true);
			ad.addParam("bg2", MySpace.Ads.BandType.Genre2, true);
			ad.addParam("bg3", MySpace.Ads.BandType.Genre3, true);

			if (MySpace.Ads.BandType.LabelType != null) {
				switch (MySpace.Ads.BandType.LabelType) {
					case 'Major':
						ad.addParam('mlt', '2');
						break;
					case 'Indie':
						ad.addParam('mlt', '3');
						break;
					default:
						ad.addParam('mlt', '1');
						break;
				}
			}
		}

		//Add genre when MySpace.Ads.Genre exists
		if (Advertiser.Util.IsDefined("MySpace.Ads.Genre")) {
			ad.addParam('bg1', MySpace.Ads.Genre, true);
			ad.addParam('bg2', MySpace.Ads.Genre, true);
			ad.addParam('bg3', MySpace.Ads.Genre, true);
		}

		var uri = decodeURI(AdHelper._documentURL);
		//change culture value when on these intl homepages
		if (pagefc === 'Splash') {
			if (uri.indexOf("latino.myspace.com") > -1)
				ad.addParam('luc', '16');
			else if (uri.indexOf("us.myspace.com") > -1)
				ad.addParam('luc', '14');
			else if (uri.indexOf("jp.myspace.com") > -1)
				ad.addParam('luc', '9');
			else if (uri.indexOf("kr.myspace.com") > -1)
				ad.addParam('luc', '30');
		}

		//Add account type of displayed friend when MySpace.Ads.Account.Type exists
		if (Advertiser.Util.IsDefined("MySpace.Ads.Account.Type")) {
			ad.addParam('acct', MySpace.Ads.Account.Type, true);
		}

		//add the google eud value
		var ged = Advertiser.Util.ReadCookieKey(Advertiser.GADC.CookieName, Advertiser.GADC.UserInfoKey);
		if (ged == null) {
			ged = "";
		}

		//add the google displayed friend eud
		ged += Advertiser.SDC.DisplayedFriendEUD;
		ad.addParam("ged", ged);

		frameURL = "http://" + ad.get_subd() + ".opt.fimserve.com/adopt/?r=h" + ad.get_queryString();
	}

	var activeAdHandlers = "";
	if (pagefc === "PopUpPlayer" || pagefc == "CelebrityPromo" || pagefc == "MusicSinglePlaylist" || pagefc == "ArtistAlbums" || pagefc == "SiteSearch")
		activeAdHandlers = "onmouseover=\"Advertiser.Refresher.SetActiveAd('" + tokenID + "');\" onmouseout=\"Advertiser.Refresher.ReleaseActiveAd();\"";

	ctr.innerHTML = "<IFRAME width=\"" + ad.get_adWidth() + "\" height=\"" + ad.get_adHeight() + "\" style=\"position:relative;z-index:10000\" MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 FRAMEBORDER=0 SCROLLING=no allowTransparency=true src='" + frameURL + "' " + activeAdHandlers + "></iframe>";

	//add div id to list of ads rendered
	Advertiser.SDC.AdsRendered[tokenID] = true;
}

function ad_wrapper() {//this is the ad wrapper version used mostly for japan. see sdc_wrapper for comments
	var argv = ad_wrapper.arguments;
	var tokenID = argv[0];
	var page = argv[1];
	var pos = argv[2].toLowerCase();

	//If we don't allow refreshes or if the user is interactive with the ad and the ad has been rendered , don't generate the ad
	if (Advertiser.SDC.AdsRendered[tokenID]) {
		if (!Advertiser.SDC.AllowRefresh)
			return;
		if (Advertiser.Refresher.ActiveAd === tokenID) {
			Advertiser.Refresher.PendingAdCalls[tokenID] = "generateAd('" + argv[0] + "','" + argv[1] + "','" + argv[2] + "')";
			return;
		}
	}

	var ctr = document.getElementById(tokenID);
	if (ctr == null)
		return;

	var ad = new AdCallAd(page, 'deSB');
	ad.setAdProperties(pos, 468, 60, 'test', '0');
	var frameURL = "";

	var qsHeight = AdHelper.queryString('adHeight');
	var qsWidth = AdHelper.queryString('adWidth');
	var livePreviewUrl = AdHelper.get_livePreviewUrl();

	var fuseaction = AdHelper.queryString('fuseaction');
	var pagefc = AdHelper.getFunctionalContext();

	if (livePreviewUrl != null && qsHeight == ad.get_adHeight() && qsWidth == ad.get_adWidth()) {
		frameURL = livePreviewUrl;
	}
	else {
		//Lets the video load to determine if ads are being roadblocked. We don't generate the ad, if they 
		//are roadblocked.  Checks once every second for 10 seconds, and generates the ad if the ads still
		//haven't been determined.   
		if ((pagefc === 'VideosIndividual' || pagefc === 'VidsChannel' || pagefc === 'VideosShowVideos') &&
			Advertiser.DFP.HasVideoPlayer() && !Advertiser.DFP.HasHuluPlayer()) {
			if (Advertiser.DFP.AdsDetermined) {
				if (Advertiser.DFP.AdsRoadBlocked === true || Advertiser.DFP.AdsRoadBlocked === "true")
					return;
			} else {
				if (!Advertiser.Util.IsDefined("Advertiser.DFP.TimeoutCounts['" + tokenID + "']", false))
					Advertiser.DFP.TimeoutCounts[tokenID] = 0;
				if (Advertiser.DFP.TimeoutCounts[tokenID] < 10) {
					Advertiser.DFP.TimeoutCounts[tokenID]++;
					var func = "ad_wrapper('" + argv[0] + "','" + argv[1] + "','" + argv[2] + "')";
					setTimeout(func, 1000);
					return;
				}
			}
		}
		Advertiser.SDC.setTargetValues();

		ad.addParam("page", ad.get_page());
		ad.addParam("position", ad.get_pos());
		ad.addParam("rand", AdHelper.get_randomNumber().substring(2, 11));
		ad.addParam("friendid", AdHelper.get_friendId(), true);
		ad.addParam("category", AdHelper.getVar("ad_Topic_ID"), true);
		ad.addParam("acnt", AdHelper.get_adCount());
		ad.addParam("channelid", AdHelper.getVarOrId("ad_Video_CID", "channelid"), true);
		ad.addParam("tvvideoid", AdHelper.getTVVideoID(), true);
		ad.addParam("tvcategoryid", AdHelper.getVar("tvcat"), true);
		ad.addParam("tvchannelid", AdHelper.getTVChannelID(), true);
		ad.addParam("tvmastercategory", AdHelper.getTVCatMasterId());
		ad.addParam("uhpt", AdHelper.getVar("uhpt"));
		ad.addParam("nwcat", AdHelper.getVar("nwcat"));
		ad.addParam("nwvert", AdHelper.getVar("nwvert"));
		ad.addParam("puid", AdHelper.getCurrentUserId());
		ad.addParam("neg", AdHelper.getGender());
		ad.addParam("ega", AdHelper.getAge());

		if (AdHelper.getDecodedURL().indexOf('apps.myspace.com') !== -1) {
			var appCat = AdHelper.queryString("category");
			if (appCat != null && appCat != "") {
				appCat = "10" + appCat;
				ad.addParam("dwcat", appCat);
			}
		}

		var schoolIDAdded = ad.addParam("schoolpage", AdHelper.queryString("schoolID"));
		if (!schoolIDAdded)
			ad.addParam("schoolpage", "0");

		if (Advertiser.Util.IsDefined("MySpace.Ads.BandType")) {
			ad.addParam("bg1", MySpace.Ads.BandType.Genre1, true);
			ad.addParam("bg2", MySpace.Ads.BandType.Genre2, true);
			ad.addParam("bg3", MySpace.Ads.BandType.Genre3, true);

			if (MySpace.Ads.BandType.LabelType != null) {
				switch (MySpace.Ads.BandType.LabelType) {
					case 'Major':
						ad.addParam('mlt', '2');
						break;
					case 'Indie':
						ad.addParam('mlt', '3');
						break;
					default:
						ad.addParam('mlt', '1');
						break;
				}
			}
		}

		if (Advertiser.Util.IsDefined("MySpace.Ads.Genre")) {
			ad.addParam('bg1', MySpace.Ads.Genre, true);
			ad.addParam('bg2', MySpace.Ads.Genre, true);
			ad.addParam('bg3', MySpace.Ads.Genre, true);
		}

		//Add account type of displayed friend when MySpace.Ads.Account.Type exists
		if (Advertiser.Util.IsDefined("MySpace.Ads.Account.Type")) {
			ad.addParam('acct', MySpace.Ads.Account.Type, true);
		}

		var testmode = ad.addParam("special", AdHelper.queryString("special"));
		if (testmode)
			frameURL = "http://detst.myspace.com/html.ng/site=myspace" + ad.get_queryString();
		else
			frameURL = "http://" + ad.get_subd() + ".myspace.com/html.ng/site=myspace" + ad.get_queryString();
	}

	var activeAdHandlers = "";
	if (pagefc === "PopUpPlayer" || pagefc == "CelebrityPromo")
		activeAdHandlers = "onmouseover=\"Advertiser.Refresher.SetActiveAd('" + tokenID + "');\" onmouseout=\"Advertiser.Refresher.ReleaseActiveAd();\"";

	ctr.innerHTML = "<IFRAME width=\"" + ad.get_adWidth() + "\" height=\"" + ad.get_adHeight() + "\" style=\"position:relative;z-index:10000\" MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 FRAMEBORDER=0 SCROLLING=no allowTransparency=true src='" + frameURL + "' " + activeAdHandlers + "></iframe>";

	AdHelper.incrementAdCount();
	Advertiser.SDC.AdsRendered[tokenID] = true;
} //ad_wrapper

//delays the ad for a given amount of seconds
function sdc_wrapper_medrec_delay() {
	var args = sdc_wrapper_medrec_delay.arguments;
	if (args == null || args.length !== 3) return;
	var token = document.getElementById(args[0]);
	if (token == null) return;
	token.style.height = 250;
	var func = "generateAd('" + args[0] + "','" + args[1] + "','" + args[2] + "')";
	setTimeout(func, 1000);
}

//delays the ad for a given amount of seconds
function ad_wrapper_medrec_delay() {
	var args = ad_wrapper_medrec_delay.arguments;
	if (args == null || args.length !== 3) return;
	var token = document.getElementById(args[0]);
	if (token == null) return;
	token.style.height = 250;
	var func = "ad_wrapper('" + args[0] + "','" + args[1] + "','" + args[2] + "')";
	setTimeout(func, 1000);
}

//automatically refreshes the ad based on a delay value passed
function sdc_wrapper_refresh() {
	var args = sdc_wrapper_refresh.arguments;
	if (args === null || args.length !== 4) return;
	var tokenID = args[0];
	var token = document.getElementById(tokenID);
	if (token === null) return;
	var delay = args[3] * 1000;
	if (delay > 0) {
		Advertiser.Refresher.AddFocusEvents();
		var refreshingAd = new Object;
		refreshingAd.Delay = delay;
		refreshingAd.AdCall = "generateAd('" + tokenID + "','" + args[1] + "','" + args[2] + "')";
		Advertiser.Refresher.AutoList[tokenID] = refreshingAd;
		Advertiser.Refresher.AutoRefreshAd(tokenID);
	}
}

function sdc_wrapper_delay_refresh() {
	var args = sdc_wrapper_delay_refresh.arguments;
	if (args == null || args.length != 5)
		return;
	var tokenID = args[0];
	var token = document.getElementById(tokenID);
	if (token == null)
		return;
	var waitTime = args[4] * 1000;
	// If a waitTime is not a number, set the waitTime to 3 sec.
	if (isNaN(waitTime))
		waitTime = 3000;
	Advertiser.Refresher.AddFocusEvents();
	var func = "sdc_wrapper_refresh('" + tokenID + "','" + args[1] + "','" + args[2] + "','" + args[3] + "')";
	setTimeout(func, waitTime);
}

// MySpaceTV functions called by player
function syncRoadBlock(adTag) {
	a = adTag.split(';');
	if (a.length > 0) {
		for (x = 0; x < a.length; x++) {
			if (a[x].indexOf('sz=') == 0) {
				size = a[x].substring(3);
				dims = size.split('x');
				width = dims[0];
				height = dims[1];

				if (height == 90)
					Advertiser.DFP.LoadRoadBlock('tkn_leaderboard', width, height, adTag);
				else if (height == 250)
					Advertiser.DFP.LoadRoadBlock('tkn_medrec', width, height, adTag);
			}
		}
	}
}
/* end MySpaceTV functions */