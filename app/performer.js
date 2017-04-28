const io = require('socket.io-client')
const socket = io(window.location.origin);
const Reverb = require('tone').JCReverb
const Chorus = require('tone').Chorus
const MonoSynth = require('tone').MonoSynth
const FMSynth = require('tone').FMSynth
const PolySynth = require('tone').PolySynth
const PingPongDelay = require('tone').PingPongDelay


function flashOn() {
  document.body.className = "on";
}

function flashOff() {
  document.body.className = "off";
}
function flashTest() {
  document.body.className = "test";
}

const verb = new Reverb().toMaster();
verb.set({wet: 0.3})

const chorus = new Chorus(0.1).connect(verb);
chorus.set({wet: 0.5})

let randomDelayTime = (Math.ceil(Math.random() * 5) * 0.125)
let pong = new PingPongDelay({delayTime: randomDelayTime, feedback: 0.5, wet: 0.5}).connect(verb)

function randomDetune(){
  let d = Math.floor((Math.random() * 5))
  if (d % 2) {d = -d}
  return d
}

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
    type: 'sawtooth',
    detune: randomDetune()
  },
  volume: -9
}

let kalimba = {
      "harmonicity":8,
      "modulationIndex": 2,
      "oscillator" : {
          "type": "sine"
      },
      "envelope": {
          "attack": 0.001,
          "decay": 2,
          "sustain": 0.1,
          "release": 1
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
  }

let poly = new PolySynth(1, MonoSynth).connect(chorus);
poly.set(worldOfBlue)



console.log(poly.get())

socket.on('connect', function () {
  socket.emit('joinRoom', 'room')
});

socket.on('joined', function (room) {
  console.log('joined room', room)
});

socket.on('set1', function () {
  poly.releaseAll();
  poly = new PolySynth(1, MonoSynth).connect(chorus);
  poly.set(worldOfBlue)
  verb.set({wet: 0.3})
});

socket.on('set2', function () {
  poly.releaseAll();
  poly = new PolySynth(2, FMSynth).connect(pong);
  poly.set(kalimba)
  verb.set({wet: 0.1})
});

socket.on('noteOn', function(note){
  flashOn();
  poly.triggerAttack(note);
});

socket.on('noteOff', function(note){
  flashOff();
  poly.triggerRelease(note);
});

socket.on('random', function(note){
  if (Math.random() < 0.3) {
    console.log('random!', note)
    flashOn()
    poly.triggerAttackRelease(note)
    setTimeout(flashOff, 500)
  }
});

socket.on('playTestNote', function(note){
  flashTest();
  poly.triggerAttackRelease("C3");
  setTimeout(() => {
    flashOff();
    poly.releaseAll();
  }, 1000)
});

socket.on('allNotesOff', function(){
  console.log('panic!')
  poly.releaseAll();
  flashOff()
});

