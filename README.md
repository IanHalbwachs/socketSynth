# socketSynth by Ian Halbwachs  - ian.halbwachs@gmail.com
A distributed mobile syntesizer using Socket.io and Tone.js.

Check it out in Glitch! https://glitch.com/edit/#!/socket-synth


v0.1 3/13/16
-------
Warning: code is in minimum demonstrable condition!

To run:
npm install
npm start
If you modify any code you'll have to run npm build to re-build webpack. 

Make sure your MIDI controller is connected and visit http://localhost:1337/conductor
Open the console and play a few notes -  you should see some activity in both your console and your terminal. 

Any computer or android device that now visits http://localhost:1337/ will be put into 
one of four socket rooms, in round-robin order. Rooms correspond to and will recieve MIDI 
channels 1-4 (technically 0-3).

I tested and demoed this with a Linnstrument in channel-per-row mode so that I could see that
channels/rooms were performing as expected. With a normal MIDI controller you will need some 
kind of voice allocation/note stealing strategy to take advantage of the four channels. 

Conductor app has some hidden features. Press 'A' on your computer keyboard to send a test note 
to all channels. Press spacebar to send all-notes-off to all channels. (Note that if for some reason 
socket was disconnected before note off was recieved, that device may continue to sound until the 
page is left).

Press 2 for 'windchime' preset. Devices will randomly sound one of last 5 played notes (play more 
notes to tune it). Press 1 to go back to synth preset.

In another tab in your browser, you can modify the test.js file and visit http://localhost:1337/test 
to develop more presets before incorporating them into performer.js - remember to re-build. That's it for now, stay tuned!
