/**
 * SeamlessLoop.js - Reproduces seamless loops on HTML5
 * 
 * Copyright (c) 2012 Main Software,
 * Written by Darío Tejedor Rico. Contact mail: hivenfour@gmail.com
 * The source code is freely distributable under the terms of LGPL license.
 * License details at http://www.gnu.org/licenses/lgpl-3.0.txt
 * 
 * USAGE:
 * Create the object providing the audio file and its duration in miliseconds:
 * var loop = new SeamlessLoop(uri, length);
 * 
 * Start reproducing the seamless loop:
 * loop.start();
 * 
 * Stop reproduccion of the seamless loop:
 * loop.stop();
 */

function SeamlessLoop(uri, length) {
	this.doLoop = function(audio, audio2, length) {
		if(this.audio.paused) {
			this.audio.play();
			this.audio2.load();
		} else {
			this.audio2.play();
			this.audio.load();
		}		
	};
	
	this.length = length;
	this.audio = new Audio(uri);
	this.audio2 = new Audio(uri);
	this.audio.load();
	this.audio2.load();
	this.interval;
}

SeamlessLoop.prototype.start = function() {
	var t = this;
	this.audio.play();
	this.interval = setInterval(function() {t.doLoop(this.audio, this.audio2, this.length);}, this.length);
};

SeamlessLoop.prototype.stop = function() {
	clearInterval(this.interval);
	this.audio.load();
	this.audio2.load();
};