/**
 * SeamlessLoop.js 2.0 - Reproduces seamless loops on HTML5/Javascript
 * https://github.com/Hivenfour/SeamlessLoop
 * 
 * Copyright (c) 2012 Main Software,
 * Written by Darío Tejedor Rico. Contact mail: hivenfour@gmail.com
 * The source code is freely distributable under the terms of LGPL license.
 * License details at http://www.gnu.org/licenses/lgpl-3.0.txt
 * 
 * USAGE:
 * - Create the Seamlessloop object
 * 		var loop = new SeamlessLoop();
 * 
 * - Add as many sounds as you will use, providing duration in miliseconds
 * (sounds must be pre-loaded if you want to update the loop without gaps)
 * 		loop.addUri(uri, length, "sound1");
 * 		loop.addUri(uri, length, "sound2");
 * ...
 * 
 * - Establish your callback function that will be called when all sounds are pre-loaded
 * 		loop.callback(soundsLoaded);
 * 
 * - Start reproducing the seamless loop:
 * 		function soundsLoaded() {
 * 			var n = 1;
 * 			loop.start("sound" + n);
 * 		};
 * 
 * - Update the looping sound, you can do this
 * synchronously (waiting the loop to finish)
 * or asynchronously (change sound immediately):
 * 		n++;
 * 		loop.update("sound" + n, false);
 * 
 * - Modify the seamless loop volume:
 * 		loop.volume(0.5);
 * 		loop.volume(loop.volume() + 0.1);
 * 
 * - Stop the seamless loop:
 * 		loop.stop();
 */

function SeamlessLoop() {
	this.is = {
			  ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
			  ie: Boolean(document.all && !window.opera),
			  opera: Boolean(window.opera),
			  chrome: Boolean(window.chrome),
			  safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
			};
	console.debug("ff: " + this.is.ff);
	console.debug("ie: " + this.is.ie);
	console.debug("opera: " + this.is.opera);
	console.debug("chrome: " + this.is.chrome);
	console.debug("safari: " + this.is.safari);
	this._total = 0;
	this._load = 0;
	this.cb_loaded;
	this.cb_loaded_flag = new Boolean();
	this.timeout;
	this.playDelay = -30;
	this.stopDelay = 30;
	if(this.is.chrome) this.playDelay = -25;
	if(this.is.chrome) this.stopDelay = 25;
	if(this.is.ff) this.playDelay = -25;
	if(this.is.ff) this.stopDelay = 85;
	if(this.is.opera) this.playDelay = 5;
	if(this.is.opera) this.stopDelay = 0;
	console.debug(this.playDelay + ", " + this.stopDelay);
	this.next = 1;
	this.audios = new Array();
	this.actual = new Array();
	this.dropOld = new Boolean();
	this.old;
	this._volume = 1;
	
	var t = this;
	this._eventCanplaythrough = function(audBool) {
		if(audBool == false) {
			audBool = true;
			t._load++;
			if(t._load == t._total) {
				t.loaded = true;
				if(t.cb_loaded_flag == true) {
					t.cb_loaded();
					t.cb_loaded_flag = false;
				}
			}
		}
	};
	
	this._eventPlaying = function(audMute) {
		setTimeout(function() {
			audMute.pause();
			try {
				audMute.currentTime = 0;
			} catch (e){console.debug(e.message);};
		}, t.stopDelay);
		
		if(t.dropOld == true) {
			setTimeout(function() {
				if(t.old.paused == false) {
					t.old.pause();
					try {
						t.old.currentTime = 0;
					} catch (e){console.debug(e.message);};
				}
			}, t.stopDelay);
			t.dropOld = false;
		}
	};

	this._eventEnded = function(aud) {
		aud.volume = this._volume;
	};

	this.doLoop = function() {
		var key = (this.next == 1 ? "_1" : "_2");
		var antikey = (this.next == 1 ? "_2" : "_1");
		
		var t = this;
		this.timeout = setTimeout(function() {t.doLoop();}, this.actual._length + this.playDelay);
		
		if(this.is.opera) this.actual[antikey].pause();
		
		this.actual[key].play();
		this.next *= -1;
	};
	
	this.isLoaded = function() {
		return Boolean(this._load == this._total);
	};
}

SeamlessLoop.prototype.start = function(id) {
	if(id != "") {
		this.actual = this.audios[id];
	}
	this.doLoop();
};

SeamlessLoop.prototype.volume = function(vol) {
	if(typeof vol != "undefined") {
		this.actual._1.volume = vol;
        	this.actual._2.volume = vol;
		this._volume = vol;
	}
	
	return vol;
};

SeamlessLoop.prototype.stop = function() {
	clearTimeout(this.timeout);
	this.actual._1.currentTime = 0;
	this.actual._1.pause();
	this.actual._2.currentTime = 0;
	this.actual._2.pause();
};

SeamlessLoop.prototype.callback = function(cb_loaded) {
	this.cb_loaded = cb_loaded;
	if(this.isLoaded() == true) cb_loaded();
	else this.cb_loaded_flag = true;
};

SeamlessLoop.prototype.update = function(id, sync) {
	//var key = (this.next == 1 ? "_1" : "_2");
	var antikey = (this.next == 1 ? "_2" : "_1");

	this.old = this.actual[antikey];
	this.actual = this.audios[id];
	if(sync == false) {
		if(this.old.paused == false) {
			this.dropOld = true;
			if(this.is.opera) this.old.pause();
		}
		clearTimeout(this.timeout);
		this.doLoop();
	}
};

SeamlessLoop.prototype.addUri = function(uri, length, id) {
	this.audios[id] = new Array();
	this.audios[id]._length = length;
	var t = this;
	this.audios[id]._1_isLoaded = new Boolean();
	this.audios[id]._2_isLoaded = new Boolean();
	this.audios[id]._1 = new Audio(uri);
	this.audios[id]._2 = new Audio(uri);
	this._total++;
	this.audios[id]._1.addEventListener("canplaythrough", function() {t._eventCanplaythrough(t.audios[id]._1_isLoaded);});
	this.audios[id]._2.addEventListener("canplaythrough", function() {t._eventCanplaythrough(t.audios[id]._2_isLoaded);});
	this.audios[id]._1.addEventListener("playing", function() {t._eventPlaying(t.audios[id]._2);});
	this.audios[id]._2.addEventListener("playing", function() {t._eventPlaying(t.audios[id]._1);});
	this.audios[id]._1.addEventListener("ended", function() {t._eventEnded(t.audios[id]._1);});
	this.audios[id]._2.addEventListener("ended", function() {t._eventEnded(t.audios[id]._2);});
	this.audios[id]._1.load();
	this.audios[id]._2.load();
	this.audios[id]._1.volume = this._volume;
	this.audios[id]._2.volume = this._volume;
};
