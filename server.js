var path = require('path');

var http = require('http');
var server = http.createServer();

var volleyball = require('volleyball');
var express = require('express');
var app = express();

var socketio = require('socket.io');

server.on('request', app);

var io = socketio(server);

server.listen(1337, function () {
  console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'app')));
app.use(volleyball);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/conductor', function (req, res) {
  res.sendFile(path.join(__dirname, 'conductor.html'));
});

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, 'test.html'));
});

let connections = 0
let notesArray = ['C4', 'D4', 'F4', 'G4', 'A4']
let cancel


io.on('connection', function (socket) {
  //console.log(socket.id, ' ', connections);
  function windchime() {

    if (true/*Math.random() < .2*/) {
      let randomNote = notesArray[Math.floor((Math.random() * 5))]
      let randomRoom = Math.floor((Math.random() * 4))
      io.sockets.in(randomRoom).emit('random', randomNote)
    }
  }

  socket.on('preset1', function() {
    socket.broadcast.emit('set1')
    clearInterval(cancel)
    console.log(cancel)
  })

  socket.on('preset2', function() {
    socket.broadcast.emit('set2')
    setTimeout( function() {cancel = setInterval(windchime, 500)}, 1000)
  })

  socket.on('joinRoom', function (room) {
    connections++
    let newRoom = connections % 4
    socket.join(newRoom);
    io.sockets.in(newRoom).emit('joined', newRoom)
  });

  socket.on('joinTest', function (room) {
    socket.join('test');
    io.sockets.in('test').emit('joined Test')
  });

  socket.on('sendNote', function ({note, channel}) {
    console.log(note, channel)
    notesArray.shift();
    notesArray.push(note)
    console.log(notesArray)
    io.sockets.in(channel).in('test').emit('noteOn', note)
  });

  socket.on('endNote', function ({note, channel}) {
    io.sockets.in(channel).in('test').emit('noteOff', note);
  });

  socket.on('panic', function () {
    socket.broadcast.emit('allNotesOff')
  })

  socket.on('testNote', function(note){
    socket.broadcast.emit('playTestNote')
});

  socket.on('disconnect', function () {
    console.log('Goodbye, ', socket.id, ' :(');
  });
});

