var io = require('socket.io-client')

var socket = io(window.location.origin);
const Reverb = require('Tone').JCReverb
const Chorus = require('Tone').Chorus
const MonoSynth = require('Tone').MonoSynth
const FMSynth = require('Tone').FMSynth
const PolySynth = require('Tone').PolySynth
const PingPongDelay = require('Tone').PingPongDelay

let pong = new PingPongDelay({delayTime: 0.5, feedback: 0.4, wet: 0.5}).toMaster()
//console.log(pong.get())
function newEcho() {
  return (Math.ceil(Math.random() * 4) * 0.125) + 1
}

let verb = new Reverb().toMaster();
verb.wet = 0

let chorus = new Chorus(0.1).connect(verb);
chorus.wet = 0

let worldOfBlue = {
  envelope: {
      attack: 0.75,
      decay: 0.5
  },
  filter: {
    Q: 1.5,
    type: 'lowpass'
  },
  filterEnvelope: {
    sustain: 1,
    decay: 0.5,
    octaves: 3.5
  },
  oscillator: {
    type: 'fatsawtooth'
  },
  volume: -15
}

var poly = new PolySynth(2, FMSynth).connect(pong);
poly.set({
    "harmonicity":8,
    "modulationIndex": 2,
    "oscillator" : {
        "type": "sine"
    },
    "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
    },
    "modulation" : {
        "type" : "square"
    },
    "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
    }
})



console.log(poly.get())

socket.on('connect', function () {
  socket.emit('joinTest', 'test')
});

socket.on('joinedTest', function (room) {
  console.log('joined room', room)
});

socket.on('set1', function() {
  console.log('setting1')
})

socket.on('noteOn', function(note){
  document.body.style.backgroundColor = "red";
  poly.triggerAttack(note);
});

socket.on('noteOff', function(note){
  document.body.style.backgroundColor = "white"
  poly.triggerRelease(note);
});

socket.on('random', function(note){
  document.body.style.backgroundColor = "white"
  console.log('random!')
  console.log(note)
  //pong.set({delayTime: newEcho()})
  //console.log(pong.get())
  poly.triggerAttackRelease(note);
});

socket.on('allNotesOff', function(){
  console.log('panic!')
  poly.releaseAll();
});

