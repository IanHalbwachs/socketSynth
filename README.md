# socketSynth by Ian Halbwachs  - ian.halbwachs@gmail.com
A distributed mobile syntesizer using Express, Socket.io and Tone.js. 

Hear it in action! <https://youtu.be/WBm6vPsAwNU>

Does not yet support iOS devices, working on it...

Make sure your MIDI controller is connected and visit 
<a href="https://socket-synth.glitch.me/conductor" target="_blank">https://socket-synth.glitch.me/conductor</a>.

Open the console and play a few notes -  you should see some activity in both your console and your terminal. 

Any computer or android device that now visits <a href="https://socket-synth.glitch.me" target="_blank">https://socket-synth.glitch.me</a> will be put into 
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

In another tab in your browser, you can visit <a href="https://socket-synth.glitch.me/test" target="_blank">https://socket-synth.glitch.me/test</a> (all channels will sound in test mode) and modify test.js
to develop more presets before incorporating them into performer.js 