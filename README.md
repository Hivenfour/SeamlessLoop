SeamlessLoop for JavaScript
===========================

Reproduce seamless audio loops on HTML5 without specific browser Audio APIs.

Standard loop attribute is useless when you try to loop seamlessly without gaps in between.
Here is an approach using intervals and "double buffer" Audio objects to achieve the seamless loop.
Created inside a Main Software project.

It has been tested on Chrome 21, Firefox 15, and Opera 12.

Usage
=====

- Create the object providing the audio file and its duration in miliseconds
var loop = new Loop(uri, length);

- Start reproducing the seamless loop
loop.start();

- Stop reproduccion of the seamless loop
loop.stop();

Notes
=====

URI: In our context, we used wav files embedded in a data-uri. You can do this encoding your binary file to base64 with something like BASE64UTF8

Length: The duration, in miliseconds, of the audio file to set up the intervals. You can hard-code it or get it using a decode library.
For PCM Wav files, you can use the library pcmdata.js, and calculate Data.length / SampleRate * 1000 / BytesPerSample

Known issues
============

The jump to the second loop seems to fire to early and the first loop gets cutted.

License
=======

Copyright (c) 2012 Main Software,
Written by Darío Tejedor Rico. Contact mail: hivenfour@gmail.com
The source code is freely distributable under the terms of LGPL license.
License details at http://www.gnu.org/licenses/lgpl-3.0.txt
