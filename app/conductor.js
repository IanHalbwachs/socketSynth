var io = require('socket.io-client');
var socket = io(window.location.origin);

document.onkeypress = function(e) {
  console.log(e.charCode)
  if (e.charCode === 32) {
    socket.emit('panic')
  }
  if (e.charCode === 49) {
    socket.emit('preset1')
  }
  if (e.charCode === 50) {
    socket.emit('preset2')
  }
  if (e.charCode === 97) {
    socket.emit('testNote')
  }

}

const n = require('tonal-midi').note

function playNote(note, channel) {
  socket.emit('sendNote', {note, channel})
}

function stopNote(note, channel) {
  socket.emit('endNote', {note, channel})
}

socket.on('connect', function () {
  console.log('Connected!');
});

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midi) {
    // when we get a succesful response, run this code
    var inputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function chanSwitch (channel) {
  console.log(channel)
  if (channel < 3) return channel;
  else return 3
}

function onMIDIMessage(message) {
  let inChannel = message.data[0] & 0xf;
  let channel = chanSwitch(inChannel)
  console.log(inChannel, channel)
  let note = n(message.data[1])
  let type = message.data[0] & 0xf0
  switch (type){
      case 144: // noteOn message
          playNote(note, channel);
          break;
      case 128: // noteOff message
          stopNote(note, channel);
          break;
      default: return;
  }
}
