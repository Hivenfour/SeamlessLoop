SeamlessLoop 2.0 for JavaScript
===============================

Reproduce seamless audio loops on HTML5 without specific browser Audio APIs.

Standard loop attribute is useless when you try to loop seamlessly without gaps in between.
Here is an approach using intervals and "double buffer" Audio objects to achieve the seamless loop.
Created inside a Main Software project.

It has been tested with wav files on Chrome 21, Firefox 15, and Opera 12.

Usage
=====

- Create the Seamlessloop object
```Javascript
var loop = new SeamlessLoop();
```

- Add as many sounds as you will use, providing duration in miliseconds (sounds must be pre-loaded if you want to update the loop without gaps)
```Javascript
loop.addUri(uri, length, "sound1");
loop.addUri(uri, length, "sound2");
...
```

- Establish your callback function that will be called when all sounds are pre-loaded
```Javascript
loop.callback(soundsLoaded);
```

- Start reproducing the seamless loop:
```Javascript
function soundsLoaded() {
    var n = 1;
    loop.start("sound" + n);
};
```

- Update the looping sound, you can do this synchronously (waiting the loop to finish) or asynchronously (change sound immediately):
```Javascript
n++;
loop.update("sound" + n, false);
```

- Modify the seamless loop volume:
```Javascript
loop.volume(0.5);
loop.volume(loop.volume() + 0.1);
```

- Stop the seamless loop:
```Javascript
loop.stop();
```

Notes
=====

- Reading files: To read a file easyly just use AJAX or a library like BinFileReader
```Javascript
var file = new BinFileReader("snd/sound.wav");
var fileContent = file.readString(file.getFileSize());
```

- URI: In our context, we used wav files embedded in a data-uri. You can do this encoding your binary file to base64 with something like BASE64UTF8
```Javascript
var encoder = new BASE64UTF8();
var base64 = encoder.base64_encode(fileContent);
var mime = "audio/wav";
var uri = "data:" + mime + ";base64," + base64;
```

- Length: The duration, in miliseconds, of the audio file to set up the intervals. You can hard-code it or get it using a decode library
For PCM Wav files, you can use the library pcmdata.js, and calculate Math.floor(Data.length / SampleRate * 1000 / BytesPerSample)
```Javascript
var pcm = PCMData(fileContent);
var soundLength = Math.floor(pcm.data.length / pcm.sampleRate*1000 / pcm.bytesPerSample);
```

Known issues
============

- Sometimes updating the loops too quickly makes some gaps.
- Chrome works pretty well, Opera is a bit unstable with sporadic gaps, Firefox usually works well.

License
=======

Copyright (c) 2012 Main Software,
Written by Darío Tejedor Rico. Contact mail: hivenfour@gmail.com
The source code is freely distributable under the terms of LGPL license.
License details at http://www.gnu.org/licenses/lgpl-3.0.txt
